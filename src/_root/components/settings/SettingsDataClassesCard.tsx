import { Plus, Trash2 } from "lucide-react";
import React from "react";
import type { LucideIcon } from "lucide-react";

export interface ClassItem {
  id: string;
  name: string;
  _count: {
    products: number;
    suppliers: number;
  };
}

interface Props {
  title: string;
  icon: LucideIcon;
  emptyIcon: LucideIcon;
  emptyText: string;
  countSuffix: string;
  classes: ClassItem[];
  onOpenDrawer: () => void;
  onDeleteClass: (id: string) => Promise<void>;
}

export const SettingsDataClassesCard: React.FC<Props> = ({
  title,
  icon: Icon,
  emptyIcon: EmptyIcon,
  emptyText,
  countSuffix,
  classes,
  onOpenDrawer,
  onDeleteClass,
}) => {
  const [errorId, setErrorId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDeleteClick = async (item: ClassItem) => {
    const totalCount = (item._count?.products || 0) + (item._count?.suppliers || 0);
    
    if (totalCount > 0) {
      setErrorId(item.id);
      setTimeout(() => setErrorId(null), 3000); // esconde apos 3s
      return;
    }

    if (confirm(`Deseja realmente apagar a classe "${item.name}"?`)) {
      setDeletingId(item.id);
      await onDeleteClass(item.id);
      setDeletingId(null);
    }
  };
  return (
    <section className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Icon size={20} className="text-primary" />
          </div>
          <h3 className="uppercase text-lg font-bold tracking-tight">
            {title}
          </h3>
        </div>
        <button
          onClick={onOpenDrawer}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-muted/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2 px-3 h-9 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus size={14} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Nova
          </span>
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-[300px]">
        {classes.length === 0 ? (
          <div className="h-24 flex flex-col items-center justify-center text-muted-foreground/50 border border-dashed border-border rounded-2xl">
            <EmptyIcon size={24} className="mb-2 opacity-50" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {emptyText}
            </span>
          </div>
        ) : (
          classes.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col p-4 bg-muted/20 border border-border/50 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase tracking-tight">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {(item._count?.products || 0) + (item._count?.suppliers || 0)} {countSuffix}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteClick(item)}
                  disabled={deletingId === item.id}
                  className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none disabled:opacity-50"
                  aria-label="Apagar classe"
                >
                  {deletingId === item.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
              
              {errorId === item.id && (
                <div className="mt-3 text-xs font-bold text-destructive bg-destructive/10 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                  Não é possível apagar: esta classe possui itens vinculados!
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
