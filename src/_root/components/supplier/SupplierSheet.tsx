import { Building2, Hash, Mail, Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { formatDocument, formatPhone } from "../../../lib/utils";
import {
  suppliersService,
  type SupplierResponse,
} from "../../../services/suppliers/suppliers.service";
import { AddressForm } from "../../../components/shared/AddressForm";

export function CreateSupplierSheet({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (sup: SupplierResponse) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    identification: "",
    addresses: {
      street: "",
      streetNumber: "",
      neighborhood: "",
      city: "",
      uf: "",
      country: "Brasil",
      complement: "",
      mainAddress: true,
      cep: "",
    },
    category: "Geral",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setIsLoading(true);

      const payload = {
        ...formData,
        addresses: formData.addresses,
      };

      const newSup = await suppliersService.createSupplier(payload);
      onCreated(newSup);
      setFormData({
        name: "",
        email: "",
        phone: "",
        identification: "",
        addresses: {
          street: "",
          streetNumber: "",
          neighborhood: "",
          city: "",
          uf: "",
          country: "Brasil",
          complement: "",
          mainAddress: true,
          cep: "",
        },
        category: "Geral",
      });
    } catch (error) {
      toast.error("Erro ao criar fornecedor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-[500px] p-0 flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 outline-none [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Novo Fornecedor</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          <div>
            <p className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] mb-1">
              Rede • Parceiros
            </p>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
              Novo Fornecedor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 text-zinc-500 transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar pb-32"
        >
          {/* Identificação Set */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">
              Identificação Principal
            </h4>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                Nome Fantasia / Razão Social
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Distribuidora Alimentos Central"
                  className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  CNPJ / CPF
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formatDocument(formData.identification)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identification: e.target.value,
                      })
                    }
                    placeholder="00.000.000/0001-00"
                    className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold appearance-none"
                >
                  <option>Geral</option>
                  <option>Alimentos</option>
                  <option>Bebidas</option>
                  <option>Limpeza</option>
                  <option>Logística</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contato Set */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">
              Contato e Endereço
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  Telefone
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formatPhone(formData.phone)}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(48) 99999-9999"
                    className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="vendas@fornecedor.com"
                    className="w-full h-14 pl-12 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[20px] focus:bg-white focus:border-primary outline-none transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            <AddressForm formData={formData} setFormData={setFormData} />
          </div>
        </form>

        {/* Footer Fixed */}
        <div className="p-8 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shrink-0">
          <button
            type="submit"
            disabled={isLoading || !formData.name}
            onClick={handleSubmit}
            className="w-full h-[64px] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[24px] font-black text-sm tracking-[0.2em] uppercase hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 shadow-2xl"
          >
            {isLoading ? "CADASTRANDO..." : "Confirmar Cadastro"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
