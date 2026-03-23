import { ChevronRight, Clock } from "lucide-react";

export const DashboardOrderItem = ({ table, time, status, items }: any) => (
  <div className="group relative p-4 rounded-xl border border-border bg-card hover:border-[#DCFF79] hover:shadow-md transition-all cursor-pointer overflow-hidden">
    
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DCFF79] opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="flex justify-between items-start mb-2">
      <span className="font-black text-primary text-sm uppercase tracking-tight">
        {table}
      </span>
      
      <div className="px-2 py-0.5 rounded-full bg-[#DCFF79] text-primary text-[10px] font-bold uppercase">
        {status}
      </div>
    </div>

    <p className="text-[11px] text-muted-foreground font-medium mb-3 line-clamp-2 uppercase">
      {items}
    </p>

    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock size={12} className="text-[#DCFF79]" />
        <span className="text-[10px] font-bold uppercase">
          {time} <span className="opacity-60">em espera</span>
        </span>
      </div>
      
      <ChevronRight size={14} className="text-[#DCFF79] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
    </div>
  </div>
);