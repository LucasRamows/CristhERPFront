import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface SearchListPickerProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  placeholder?: string;
  searchKeys: (keyof T)[];
  renderItem: (item: T) => React.ReactNode;
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
export const SearhListPicker = <T extends { id: string | number }>({
  items,
  onSelect,
  placeholder,
  searchKeys,
  renderItem,
  noResultsMessage = "Nenhum resultado encontrado.",
  limit = 2,
  footerMessage = "Mostrando os resultados mais relevantes",
}: SearchListPickerProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    // Se não houver busca, não mostra nada
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

          // Busca por números (específico para CPFs, telefones, códigos, etc)
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
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      {/* Barra de Busca */}
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder={placeholder || "Pesquisar..."}
          className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Container de Resultados */}
      {searchTerm.trim() && (
        <div className="relative group">
          <div className="flex flex-col z-50 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in dark:bg-zinc-950 dark:border-zinc-800 absolute">
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      setSearchTerm(""); // Limpa após selecionar
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50/50 border-b border-zinc-50 last:border-none transition-colors group text-left dark:border-zinc-900 dark:hover:bg-zinc-900/50"
                  >
                    {renderItem(item)}
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

