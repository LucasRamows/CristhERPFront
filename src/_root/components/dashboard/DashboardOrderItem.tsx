import { ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

interface DashboardOrderItemProps {
  table: string;
  time: string;
  status: string;
  items: string;
  className?: string;
  onMarkDelivered?: () => void;
}

export const DashboardOrderItem = ({ 
  table, 
  time, 
  status, 
  items, 
  className,
  onMarkDelivered 
}: DashboardOrderItemProps) => (
  <div className={cn(
    "group relative p-4 rounded-xl border border-border bg-card hover:border-decoration hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col gap-2",
    className
  )}>
    
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-decoration opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="flex justify-between items-start mb-1">
      <span className="font-black text-primary text-sm uppercase tracking-tight">
        {table}
      </span>
      
      <div className={cn(
        "px-2 py-0.5 rounded-full text-primary text-[10px] font-bold uppercase",
        status === "Preparando" ? "bg-[#FACC15]" : "bg-decoration"
      )}>
        {status}
      </div>
    </div>

    <div className="space-y-1">
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight line-clamp-2">
        {items}
      </p>
    </div>

    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock size={12} className="text-decoration" />
        <span className="text-[10px] font-bold uppercase">
          {time} <span className="opacity-60">em espera</span>
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {onMarkDelivered && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMarkDelivered();
            }}
            className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-decoration dark:hover:bg-decoration hover:text-primary rounded-lg transition-all"
          >
            <CheckCircle2 size={12} />
            <span className="text-[9px] font-black uppercase">Entregue</span>
          </button>
        )}
        <ChevronRight size={14} className="text-decoration opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
      </div>
    </div>
  </div>
);