import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatDocument,
  removeMask,
} from "../../../lib/utils";
import {
  costomersService,
  type CostomersResponse,
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
  const [isSuccess, setIsSuccess] = useState(false);
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
        responseData = await costomersService.updateCustomer(
          initialData.id,
          payload,
        );

        setClients((prev) =>
          prev.map((c) =>
            c.id === initialData.id ? { ...c, ...responseData } : c,
          ),
        );
      } else {
        await costomersService.createCustomer(payload);
        responseData = {
          id: Math.random().toString(36).substring(7),
          fullName: values.fullName,
          nickname: values.nickname,
          phone: values.phone,
          cpf: values.cpf,
          creditLimit: values.creditLimit,
          isBlocked: false,
          saldoDevedor: 0,
          settlementDate: values.settlementDate,
        } as CostomersResponse;
      }

      onSuccess(responseData);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
        if (!isEdit) form.reset();
      }, 2000);
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
    isSuccess,
    isLoading,
    error,
    handleSubmit,
  };
}
