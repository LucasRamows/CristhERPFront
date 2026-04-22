import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  formatDocument,
  removeMask,
} from "../../../lib/utils";
import type { CostomersResponse } from "../../../services/costomers/customer.type";
import {
  costomersService,
} from "../../../services/costomers/customers.service";
import {
  customerSchema,
  type CustomerFormType,
} from "../../schemas/customerSchema";

interface UseCustomerFormProps {
  open: boolean;
  initialData?: CostomersResponse | null;
  setClients: React.Dispatch<React.SetStateAction<CostomersResponse[]>>;
  onSuccess: (newClient: CostomersResponse) => void;
  onOpenChange: (open: boolean) => void;
}

export function useCustomerForm({
  open,
  initialData,
  setClients,
  onSuccess,
  onOpenChange,
}: UseCustomerFormProps) {
  const isEdit = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CustomerFormType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      nickname: initialData?.nickname || "",
      phone: initialData?.phone || "",
      cpf: initialData?.cpf || "",
      creditLimit: initialData?.creditLimit || 0,
      settlementDate: initialData?.settlementDate || 5,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      fullName: initialData?.fullName || "",
      nickname: initialData?.nickname || "",
      phone: initialData?.phone || "",
      cpf: formatDocument(initialData?.cpf || ""),
      creditLimit: Number(initialData?.creditLimit) || 0,
      settlementDate: initialData?.settlementDate || 5,
    });

    setError(null);
  }, [open, initialData, form]);

 const handleSubmit = async (values: CustomerFormType) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        fullName: values.fullName,
        nickname: values.nickname,
        phone: removeMask(values.phone),
        cpf: removeMask(values.cpf),
        creditLimit: values.creditLimit,
        settlementDate: values.settlementDate,
      };

      let responseData: CostomersResponse;

      if (isEdit && initialData) {
        // MODO EDIÇÃO
        responseData = await costomersService.updateCustomer(
          initialData.id,
          payload,
        );

        // Atualiza a lista substituindo o cliente antigo pelo editado
        setClients((prev) =>
          prev.map((c) =>
            c.id === initialData.id ? { ...c, ...responseData } : c,
          ),
        );
      } else {
        // MODO CRIAÇÃO
        // 1. Pegamos a resposta real da API (que já vem com o ID do banco)
        responseData = await costomersService.createCustomer(payload);
        
        // 2. 🚀 A MÁGICA AQUI: Adicionamos o novo cliente no topo da lista!
        setClients((prev) => [responseData, ...prev]);
      }

      onSuccess(responseData);
      toast.success(`Cliente ${isEdit ? "atualizado" : "cadastrado"} com sucesso!`);

      onOpenChange(false);
    } catch (err: any) {
      console.error("Erro ao salvar cliente:", err);
      setError(
        `Ocorreu um erro ao ${
          isEdit ? "atualizar" : "salvar"
        } o cliente. Verifique os dados e tente novamente.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    handleSubmit,
  };
}
