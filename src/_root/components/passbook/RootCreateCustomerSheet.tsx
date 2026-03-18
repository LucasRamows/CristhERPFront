import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SuccessScreen from "../../../components/shared/SuccessPopUp";
import {
  formatDocument,
  formatMoney,
  formatPhone,
  removeMask,
} from "../../../lib/utils";
import { useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "../../../components/ui/sheet";
import {
  customerSchema,
  type CustomerFormType,
} from "../../schemas/customerSchema";

import {
  costomersService,
  type CostomersResponse,
} from "../../../services/costomers/customers.service";

interface RootCreateCustomerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newClient: CostomersResponse) => void;
  initialData?: CostomersResponse | null;
}

export default function RootCreateCustomerSheet({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: RootCreateCustomerSheetProps) {
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
    if (open) {
      form.reset({
        fullName: initialData?.fullName || "",
        nickname: initialData?.nickname || "",
        phone: initialData?.phone || "",
        cpf: initialData?.cpf || "",
        creditLimit: initialData?.creditLimit || 0,
        settlementDate: initialData?.settlementDate || 5,
      });
      setError(null);
    }
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

      let response;
      if (isEdit && initialData) {
        response = await costomersService.updateCustomer(
          initialData.id,
          payload,
        );
      } else {
        await costomersService.createCustomer(payload);
        response = {
          id: Math.random().toString(36).substring(7),
          fullName: values.fullName,
          nickname: values.nickname,
          phone: values.phone,
          cpf: values.cpf,
          creditLimit: values.creditLimit,
          isBlocked: false,
          saldoDevedor: 0,
          settlementDate: values.settlementDate,
        };
      }

      onSuccess(response);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[450px] p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
      >
        <SheetTitle className="sr-only">
          {isEdit ? "Editar Cliente" : "Cadastrar Novo Cliente"}
        </SheetTitle>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
              Caderneta • Gestão
            </p>
            <h2 className="text-2xl font-black">
              {isEdit ? "Editar Perfil" : "Novo Cliente"}
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-6 md:mx-8 mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              ⚠️ Erro ao Cadastrar
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {isSuccess ? (
          <div className="flex-1 flex items-center justify-center">
            <SuccessScreen
              message={isEdit ? "Perfil atualizado!" : "Cliente cadastrado!"}
            />
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar"
          >
            {/* Nome Completo */}
            <Controller
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <input
                    {...field}
                    placeholder="Ex: João Batista da Silva"
                    className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Apelido */}
            <Controller
              name="nickname"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    Apelido / Como é chamado
                  </label>
                  <input
                    {...field}
                    placeholder="Ex: João do Táxi"
                    className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                  />
                  {form.formState.errors.nickname && (
                    <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                      {form.formState.errors.nickname.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Telefone */}
              <Controller
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                      Telefone
                    </label>
                    <input
                      {...field}
                      value={formatPhone(field.value)}
                      onChange={(e) => {
                        const value = formatPhone(e.target.value);
                        field.onChange(removeMask(value));
                      }}
                      placeholder="(00) 00000-0000"
                      className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* CPF / CNPJ */}
              <Controller
                name="cpf"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                      CPF / CNPJ
                    </label>
                    <input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formatted = formatDocument(value);
                        field.onChange(formatted);
                      }}
                      placeholder="000.000.000-00"
                      className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                    />
                    {form.formState.errors.cpf && (
                      <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                        {form.formState.errors.cpf.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Limite de Crédito */}
              <Controller
                name="creditLimit"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                      Limite de Crédito
                    </label>
                    <input
                      value={formatMoney(field.value)}
                      onChange={(e) => {
                        const numeric =
                          Number(e.target.value.replace(/\D/g, "")) / 100;
                        field.onChange(numeric);
                      }}
                      placeholder="R$ 0,00"
                      className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                    />
                    {form.formState.errors.creditLimit && (
                      <p className="text-[10px] font-bold text-red-500 uppercase mt-1">
                        {form.formState.errors.creditLimit.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Dia de Vencimento */}
              <Controller
                name="settlementDate"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                      Dia de Acerto
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Ex: 5"
                      className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                    />
                    {form.formState.errors.settlementDate && (
                      <p className="text-[10px) font-bold text-red-500 uppercase mt-1">
                        {form.formState.errors.settlementDate.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 bg-gray-900 text-white rounded-[20px] font-bold text-base transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {isLoading
                  ? "Salvando..."
                  : isEdit
                  ? "Salvar Alterações"
                  : "Confirmar Cadastro"}
              </button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
