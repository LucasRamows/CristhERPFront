import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import apiBack from "../../services/api";
import SuccessScreen from "../../components/shared/SuccessPopUp";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { formatMoney } from "../../lib/utils";

const materialSelectionSchema = z.object({
  materialId: z.string().min(1, "Selecione um produto"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  grossWeight: z.coerce
    .number()
    .min(0.001, "A quantidade deve ser maior que zero"),
  discountPercentage: z.coerce.number().min(0).max(100),
  unitValue: z.coerce.number().min(0, "O valor não pode ser negativo"),
});

type MaterialFormValues = z.input<typeof materialSelectionSchema>;
type MaterialFormOutput = z.output<typeof materialSelectionSchema>;

export default function AddMaterialForm({ onSubmit }: any) {
  const [send, setSend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSelectionSchema),
    defaultValues: {
      materialId: "",
      unit: "",
      grossWeight: 0,
      discountPercentage: 0,
      unitValue: 0,
    },
  });

  const {
    watch,
    setValue,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const values = watch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res: any = await apiBack.get(`/products/my`);
        setProducts(res.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === values.materialId),
    [values.materialId, products],
  );

  useEffect(() => {
    if (selectedProduct) {
      setValue("unitValue", selectedProduct.price);
      setValue("unit", selectedProduct.unit);
    }
  }, [selectedProduct, setValue]);

  const weight = Number(values.grossWeight) || 0;
  const unitPrice = Number(values.unitValue) || 0;
  const discountPercent = Number(values.discountPercentage) || 0;

  const subtotalBruto = weight * unitPrice;
  const discountAmount = subtotalBruto * (discountPercent / 100);
  const totalValue = subtotalBruto - discountAmount;

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, products]);

  async function handleSubmitForm(data: MaterialFormValues) {
    if (!selectedProduct) return;
    setIsLoading(true);

    const validatedData = data as MaterialFormOutput;

    setTimeout(() => {
      onSubmit({
        ...validatedData,
        name: selectedProduct.name,
        ncm: selectedProduct.ncm,
        totalValue,
        discountValue: discountAmount,
      });
      setSend(true);
      setIsLoading(false);
      setTimeout(() => setSend(false), 2000);
    }, 600);
  }

  if (send)
    return (
      <div className="h-full flex justify-center items-center">
        <SuccessScreen message="Item Adicionado" />
      </div>
    );

  if (isLoading)
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6 p-1">
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-muted-foreground">
            Produto / Material Cadastrado
          </label>
          <Controller
            control={control}
            name="materialId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-12 bg-muted/50 border-none rounded-xl">
                  <SelectValue placeholder="Selecione um produto..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Filtrar materiais..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  {filteredProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-[11px] uppercase">
                          {p.name}
                        </span>
                        <span className="text-[9px] opacity-60">
                          Preço: {formatMoney(p.price)} | Estoque: {p.stock}{" "}
                          {p.unit}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.materialId && (
            <span className="text-[10px] text-destructive font-bold">
              {errors.materialId.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground">
              Unidade
            </label>
            <Input
              readOnly={true}
              {...register("unit")}
              className="h-11 bg-muted/50 border-none rounded-xl font-bold uppercase"
            />
            {errors.unit && (
              <span className="text-[10px] text-destructive font-bold">
                {errors.unit.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-muted-foreground">
              Quantidade
            </label>
            <Input
              type="number"
              step="any"
              {...register("grossWeight")}
              className="h-11 bg-muted/50 border-none rounded-xl font-bold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-muted-foreground">
            Valor Unitário (R$)
          </label>
          <Controller
            control={control}
            name="unitValue"
            render={({ field }) => (
              <Input
                placeholder="R$ 0,00"
                value={formatMoney((field.value as number) || 0)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  const numberValue = Number(rawValue) / 100;
                  field.onChange(numberValue);
                }}
                className="h-11 bg-primary/5 border-primary/20 border rounded-xl font-black text-primary text-lg"
              />
            )}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase text-destructive">
              Desconto (%)
            </label>
            <span className="text-[10px] font-bold text-destructive">
              - {formatMoney(discountAmount)}
            </span>
          </div>
          <div className="relative">
            <Input
              type="number"
              {...register("discountPercentage")}
              className="h-11 bg-destructive/5 border-none rounded-xl font-bold text-destructive pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-destructive/40">
              %
            </span>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 space-y-2 shadow-inner">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-[10px] font-black uppercase">
              Subtotal Bruto:
            </span>
            <span className="text-xs font-bold">
              {formatMoney(subtotalBruto)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-primary/10 pt-2">
            <span className="text-[11px] font-black uppercase text-primary">
              Total Líquido:
            </span>
            <span className="text-xl font-black text-primary">
              {formatMoney(totalValue)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <Button
          type="submit"
          disabled={!values.materialId || Number(values.grossWeight) <= 0}
          className="w-full h-14 bg-primary font-black uppercase tracking-widest text-secondary shadow-lg shadow-primary/20 text-md"
        >
          Inserir na Nota
        </Button>
      </div>
    </form>
  );
}
