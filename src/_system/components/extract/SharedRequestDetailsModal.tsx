import { Image as ImageIcon, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { SharedCollectionRequest } from "../../types/types";

interface SharedRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: SharedCollectionRequest | null;
  onSuccess: () => void;
  setRequests: React.Dispatch<React.SetStateAction<SharedCollectionRequest[]>>;
  renderActions?: (
    req: SharedCollectionRequest,
    onClose: () => void,
    onSuccess: () => void,
    setRequests: React.Dispatch<
      React.SetStateAction<SharedCollectionRequest[]>
    >,
  ) => React.ReactNode;
}

const SharedRequestDetailsModal = ({
  isOpen,
  onClose,
  request,
  onSuccess,
  renderActions,
  setRequests,
}: SharedRequestDetailsModalProps) => {
  if (!isOpen || !request) return null;

  const dateStr =
    typeof request.createdAt === "string"
      ? request.createdAt
      : new Date().toISOString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-zinc-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 object-contain max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Detalhes da Solicitação
            </h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              ID-{request.id.slice(0, 8)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Material
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {request.materialName || request.material || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Peso Estimado
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {request.totalWeight}kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Data
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {format(parseISO(dateStr), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800/80" />

          {/* Imagem */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ImageIcon size={16} className="text-emerald-500" /> Imagem
              Anexada
            </h4>

            {request.proofImageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 aspect-video shrink-0 flex items-center justify-center">
                <img
                  src={request.proofImageUrl}
                  alt="Imagem da coleta"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 border-dashed bg-zinc-50 dark:bg-zinc-900/50">
                <ImageIcon
                  size={32}
                  className="text-zinc-300 dark:text-zinc-600 mb-2"
                />
                <p className="text-xs text-zinc-400 font-medium">
                  Nenhuma imagem anexada.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions Injetáveis via Inversão de Controle */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-3">
          {renderActions
            ? renderActions(request, onClose, onSuccess, setRequests)
            : null}
        </div>
      </div>
    </div>
  );
};

export default SharedRequestDetailsModal;
