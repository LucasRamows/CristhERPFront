import { Plus } from "lucide-react";
import { SearhListPicker } from "../../../../components/shared/SearhListPicker";
import type { IngredientResponse } from "../../../../services/inventory/inventory.service";

interface Props {
  ingredients: IngredientResponse[];
  handleAddIngredient: (item: IngredientResponse) => void;
  setIsCreateIngredientOpen: (val: boolean) => void;
}

export function EntrySidebar({
  ingredients,
  handleAddIngredient,
  setIsCreateIngredientOpen,
}: Props) {
  return (
    <aside className="lg:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-card">
      <div className="p-4 sm:p-5 flex flex-col gap-5 h-full overflow-y-auto custom-scrollbar">
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
            Adicionar Insumo
          </p>
          <SearhListPicker
            items={ingredients}
            onSelect={(item) => item && handleAddIngredient(item)}
            placeholder="Buscar por nome…"
            searchKeys={["name"]}
            avatarText={(item) => item.name.charAt(0).toUpperCase()}
            renderTitle={(item) => item.name}
            renderSubtitle={(item) => item.unit}
          />
        </div>

        <button
          onClick={() => setIsCreateIngredientOpen(true)}
          className="w-full py-5 border-2 border-dashed border-border rounded-[24px] flex flex-col items-center gap-2.5 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all group active:scale-[0.98]"
        >
          <div className="w-10 h-10 bg-muted rounded-[16px] flex items-center justify-center group-hover:bg-muted transition-colors">
            <Plus
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest text-center leading-relaxed">
            Criar Novo
            <br />
            Insumo
          </span>
        </button>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="p-4 bg-muted/60 rounded-[20px]">
            <p className="text-[9px] font-black text-foreground/50 uppercase tracking-widest mb-1.5">
              Dica de Gestão
            </p>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Ao confirmar a nota, o estoque será atualizado imediatamente e um
              lançamento no contas a pagar será gerado automaticamente.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
