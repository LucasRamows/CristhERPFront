import { fetchAddressByCep } from "../../services/apiGoverment";
import { formatCEP } from "../../lib/utils";
import { Hash, Landmark, Map as MapIcon, MapPin, Signpost, Info } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface AddressFormData {
  addresses: {
    street: string;
    streetNumber: string;
    neighborhood: string;
    city: string;
    uf: string;
    cep: string;
    complement: string;
  };
  [key: string]: any;
}

export const AddressForm = ({
  formData,
  setFormData,
}: {
  formData: AddressFormData;
  setFormData: (formData: any) => void;
}) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Função auxiliar para evitar repetição de código no onChange
  const updateAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      addresses: { ...formData.addresses, [field]: value },
    });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue = formatCEP(e.target.value);
    
    updateAddress("cep", formattedValue);
    
    if (rawValue.length === 8) {
      setIsLoadingCep(true);
      try {
        const addressData = await fetchAddressByCep(rawValue);
        if (addressData) {
          setFormData({
            ...formData,
            addresses: {
              ...formData.addresses,
              cep: formattedValue,
              street: addressData.street || formData.addresses.street,
              neighborhood: addressData.neighborhood || formData.addresses.neighborhood,
              city: addressData.city || formData.addresses.city,
              uf: addressData.uf || formData.addresses.uf,
            },
          });
        }
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const inputBaseClasses = "w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold shadow-none focus-visible:ring-0 focus-visible:border-primary";
  const labelBaseClasses = "text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1 mb-1.5 block";

  return (
    <div className="space-y-4">
      {/* Linha 1: CEP e Complemento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className={labelBaseClasses}>CEP</Label>
          <div className="relative">
            <MapIcon
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLoadingCep ? "text-primary animate-pulse" : "text-zinc-300"}`}
              size={18}
            />
            <Input
              type="text"
              value={formData.addresses.cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              className={inputBaseClasses}
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-1">
          <Label className={labelBaseClasses}>Complemento</Label>
          <div className="relative">
            <Info
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <Input
              type="text"
              value={formData.addresses.complement}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress("complement", e.target.value)}
              placeholder="Apto, Bloco, Referência..."
              className={inputBaseClasses}
            />
          </div>
        </div>
      </div>

      {/* Linha 2: Rua e Número */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-1">
          <Label className={labelBaseClasses}>Endereço / Rua</Label>
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <Input
              type="text"
              value={formData.addresses.street}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress("street", e.target.value)}
              placeholder="Rua ou Avenida"
              className={inputBaseClasses}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className={labelBaseClasses}>Número</Label>
          <div className="relative">
            <Hash
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <Input
              type="text"
              value={formData.addresses.streetNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress("streetNumber", e.target.value)}
              placeholder="Nº"
              className={inputBaseClasses}
            />
          </div>
        </div>
      </div>

      {/* Linha 3: Bairro, Cidade e UF */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 space-y-1">
          <Label className={labelBaseClasses}>Bairro</Label>
          <div className="relative">
            <Signpost
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <Input
              type="text"
              value={formData.addresses.neighborhood}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress("neighborhood", e.target.value)}
              placeholder="Ex: Centro"
              className={inputBaseClasses}
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-1">
          <Label className={labelBaseClasses}>Cidade</Label>
          <div className="relative">
            <Landmark
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <Input
              type="text"
              value={formData.addresses.city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress("city", e.target.value)}
              placeholder="Cidade"
              className={inputBaseClasses}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className={labelBaseClasses}>UF</Label>
          <div className="relative">
            <Input
              type="text"
              value={formData.addresses.uf}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAddress("uf", e.target.value)}
              placeholder="UF"
              className={`${inputBaseClasses} pl-5`} // UF doesn't have an icon, so reduced padding
            />
          </div>
        </div>
      </div>
    </div>
  );
};
