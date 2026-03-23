import type { LucideIcon } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  highlight?: boolean; // Se verdadeiro, background ativo será primário (#E2F898)
}

export interface PageTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string; // Classes adicionais para o wrapper
}

export function PageTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: PageTabNavigationProps) {
  return (
    <div
      className={`flex h-12 md:h-14 w-fit items-center justify-center rounded-full bg-card p-1 md:p-1.5 text-primary overflow-x-auto hide-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeBg = tab.highlight ? "bg-[#E2F898]" : "bg-white";

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex h-full items-center justify-center whitespace-nowrap rounded-full px-5 md:px-6 text-sm md:text-base font-bold transition-all ${
              isActive
                ? `${activeBg} text-gray-900 shadow-sm`
                : "hover:text-gray-900 flex-1"
            }`}
          >
            {tab.icon && <tab.icon size={18} className="mr-2 shrink-0" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
