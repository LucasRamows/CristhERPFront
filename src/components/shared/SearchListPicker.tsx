import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface SearchListPickerProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  placeholder?: string;
  searchKeys: (keyof T)[];
  renderTitle?: (item: T) => React.ReactNode;
  renderSubtitle?: (item: T) => React.ReactNode;
  avatarText?: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
  noResultsMessage?: string;
  limit?: number;
  footerMessage?: string;
}

/**
 * Um componente de busca genérico e modular que exibe uma lista de resultados
 * formatados conforme a necessidade do desenvolvedor.
 *
 * @template T - O tipo do objeto na lista. Deve conter uma propriedade `id`.
 */
export const SearchListPicker = <T extends { id: string | number }>({
  items,
  onSelect,
  placeholder,
  searchKeys,
  renderTitle,
  renderSubtitle,
  avatarText,
  renderItem,
  noResultsMessage = "Nenhum resultado encontrado.",
  limit = 2,
  footerMessage = "Mostrando os resultados mais relevantes",
}: SearchListPickerProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const normalizedSearch = searchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const onlyNumbers = searchTerm.replace(/\D/g, "");

    return items
      .filter((item) => {
        return searchKeys.some((key) => {
          const value = item[key];
          if (value === undefined || value === null) return false;

          const strValue = String(value);
          const normalizedValue = strValue
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          if (onlyNumbers && onlyNumbers.length > 0) {
            const numericValue = strValue.replace(/\D/g, "");
            if (numericValue && numericValue.includes(onlyNumbers)) return true;
          }

          return normalizedValue.includes(normalizedSearch);
        });
      })
      .slice(0, limit);
  }, [items, searchTerm, searchKeys, limit]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder={placeholder || "Pesquisar..."}
          className="w-full h-9 pl-11 pr-4 bg-gray-50 border border-zinc-200 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm.trim() && (
        <div className="relative group">
          <div className="flex flex-col z-50 w-full mt-1 bg-white border border-zinc-200 rounded shadow-xl overflow-hidden animate-fade-in dark:bg-zinc-950 dark:border-zinc-800 absolute">
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      setSearchTerm("");
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 border-b border-zinc-50 last:border-none transition-colors group text-left dark:border-zinc-900 dark:hover:bg-zinc-900/50"
                  >
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <div className="flex items-center gap-3 py-1 text-left">
                        {avatarText && (
                          <Avatar className="h-10 w-10 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 overflow-hidden shrink-0 transition-transform group-hover:scale-110">
                            <AvatarFallback className="font-black text-xs text-primary bg-primary/10 w-full h-full flex items-center justify-center">
                              {avatarText(item)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col min-w-0">
                          {renderTitle && (
                            <span className="font-black text-sm text-zinc-800 dark:text-zinc-200 truncate">
                              {renderTitle(item)}
                            </span>
                          )}
                          {renderSubtitle && (
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                              {renderSubtitle(item)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-zinc-500">{noResultsMessage}</p>
                </div>
              )}
            </div>

            {/* Rodapé do Dropdown */}
            {filteredItems.length > 0 && (
              <div className="bg-zinc-50 p-2 text-center border-t border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-400 font-bold uppercase">
                  {footerMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const StatusLegend = () => (
  <div className="flex w-fit flex-nowrap items-center gap-3 text-xs md:text-sm font-bold text-primary">
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
      Livre
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#E2F898]"></div>
      Ocupada
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#FACC15]"></div>
      Ag. Prato
    </div>
  </div>
);
