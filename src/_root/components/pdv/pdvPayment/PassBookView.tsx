import { Ban, CheckCircle, ChevronLeft, Trash, User } from "lucide-react";
import { SearhListPicker } from "../../../../components/shared/SearhListPicker";
import { formatDocument } from "../../../../lib/utils";

interface FiadoViewProps {
  clients: any[];
  selectedClient: any;
  isLoading: boolean;
  isSubmitting: boolean;
  onSelect: (id: string | number) => void;
  onRemoveSelection: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function PassBookView({
  clients,
  selectedClient,
  isLoading,
  isSubmitting,
  onSelect,
  onRemoveSelection,
  onBack,
  onConfirm,
}: FiadoViewProps) {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-bold">Pendurar Conta</h3>
      </div>

      {/* Seleção de Cliente */}
      <div className="mb-6 space-y-3">
        <label className="text-sm font-bold text-gray-500 ml-1">
          Vincular ao Cadastro de
        </label>

        {selectedClient ? (
          /* Card do Cliente Selecionado */
          <div className="w-full flex items-center justify-between p-4 bg-zinc-50 border-2 border-[#44A08D]/20 rounded-2xl transition-all group">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                ${
                  selectedClient.isBlocked
                    ? "bg-red-50 text-red-500"
                    : "bg-white text-[#44A08D] shadow-sm"
                }`}
              >
                {selectedClient.isBlocked ? (
                  <Ban size={18} />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                  {selectedClient.fullName}
                  {selectedClient.isBlocked && (
                    <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase font-black">
                      Bloqueado
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-none mt-1">
                  {selectedClient.nickname} • {formatDocument(selectedClient.cpf)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveSelection}
              className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
            >
              <Trash size={18} />
            </button>
          </div>
        ) : (
          /* Input de Busca */
          <div className="relative">
            {isLoading ? (
              <div className="w-full h-20 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-5 h-5 border-2 border-[#44A08D]/30 border-t-[#44A08D] rounded-full animate-spin" />
                <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Buscando Clientes...
                </span>
              </div>
            ) : (
              <SearhListPicker
                items={clients}
                onSelect={(client) => onSelect(client.id)}
                placeholder="Pesquisar por nome, apelido ou CPF..."
                searchKeys={["fullName", "nickname", "cpf"]}
                renderItem={(client) => (
                  <div className="flex items-center gap-3 py-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                      ${
                        client.isBlocked
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-zinc-500"
                      }`}
                    >
                      {client.isBlocked ? (
                        <Ban size={18} />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-zinc-800 flex items-center gap-2 truncate">
                        {client.fullName}
                        {client.isBlocked && (
                          <span className="text-[8px] bg-red-500 text-white px-1 rounded">
                            BLOQ
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-medium truncate">
                        {formatDocument(client.cpf)}
                      </p>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      <div className="mt-auto pt-4">
        {selectedClient?.isBlocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-pulse">
            <Ban size={18} />
            <p className="text-[11px] font-bold leading-tight">
              Este cliente está bloqueado e não pode realizar compras no fiado.
            </p>
          </div>
        )}

        <button
          onClick={onConfirm}
          disabled={!selectedClient || isSubmitting || selectedClient.isBlocked}
          className={`w-full py-4 rounded-[16px] font-black text-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] ${
            selectedClient && !isSubmitting && !selectedClient.isBlocked
              ? "bg-[#E2F898] text-gray-900 shadow-lg shadow-[#E2F898]/20 hover:brightness-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle size={22} />
              <span>Salvar Dívida</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
