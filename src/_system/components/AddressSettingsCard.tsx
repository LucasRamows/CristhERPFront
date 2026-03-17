import { MapPin } from "lucide-react";
import { SystemInput as Input } from "./SystemInput";
import { formatCEP } from "../../lib/utils";

export interface AddressData {
  zipCode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressSettingsCardProps {
  data: AddressData;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
}

export function AddressSettingsCard({
  data,
  isEditing,
  onChange,
  title = "Endereço Relacionado ao Estabelecimento",
}: AddressSettingsCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 p-5 space-y-4">
      <h2 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
        <MapPin size={18} className="text-emerald-600 dark:text-emerald-400" />{" "}
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-1">
          <Input
            label="CEP"
            name="zipCode"
            value={formatCEP(data.zipCode)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
            label="Logradouro (Rua, Avenida, etc)"
            name="address"
            value={data.address}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-1">
          <Input
            label="Número"
            name="number"
            value={data.number}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
            label="Complemento"
            name="complement"
            value={data.complement}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Bairro"
            name="neighborhood"
            value={data.neighborhood}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-1">
          <Input
            label="Cidade"
            name="city"
            value={data.city}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div className="sm:col-span-1">
          <Input
            label="Estado"
            name="state"
            value={data.state}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}
