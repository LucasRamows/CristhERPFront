import { Hash, Landmark, Map as MapIcon, MapPin, Signpost } from "lucide-react";

export const AddressForm = ({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (formData: any) => void;
}) => {
  // Função auxiliar para evitar repetição de código no onChange
  const updateAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      addresses: { ...formData.addresses, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      {/* Linha 1: Rua e Número */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Endereço / Rua
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <input
              type="text"
              value={formData.addresses.street}
              onChange={(e) => updateAddress("street", e.target.value)}
              placeholder="Rua ou Avenida"
              className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Número
          </label>
          <div className="relative">
            <Hash
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <input
              type="text"
              value={formData.addresses.streetNumber} // Ajustado para streetNumber
              onChange={(e) => updateAddress("streetNumber", e.target.value)}
              placeholder="Nº"
              className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Linha 2: Bairro e Cidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Bairro
          </label>
          <div className="relative">
            <Signpost
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <input
              type="text"
              value={formData.addresses.neighborhood}
              onChange={(e) => updateAddress("neighborhood", e.target.value)}
              placeholder="Ex: Centro"
              className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Cidade
          </label>
          <div className="relative">
            <Landmark
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <input
              type="text"
              value={formData.addresses.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              placeholder="Cidade"
              className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            UF
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.addresses.uf}
              onChange={(e) => updateAddress("uf", e.target.value)}
              placeholder="UF"
              className="w-full h-14 pl-5 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Linha 3: CEP e Complemento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            CEP
          </label>
          <div className="relative">
            <MapIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <input
              type="text"
              value={formData.addresses.cep}
              onChange={(e) => updateAddress("cep", e.target.value)}
              placeholder="00000-000"
              className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
            Complemento
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.addresses.complement}
              onChange={(e) => updateAddress("complement", e.target.value)}
              placeholder="Apto, Bloco, Referência..."
              className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
