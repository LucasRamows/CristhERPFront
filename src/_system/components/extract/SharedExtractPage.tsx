import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  ChevronRight,
} from "lucide-react";
import apiBack from "../../../services/api";
import MATERIALS_MAP from "../../../_features/materials/mappers/materialsMap";
import SharedRequestDetailsModal from "./SharedRequestDetailsModal";
import type { SharedCollectionRequest } from "../../types/types";

interface SharedExtractPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  fetchUrl: string;
  emptyMessage: string;
  emptyIcon?: React.ReactNode;
  renderCardFooter?: (req: SharedCollectionRequest) => React.ReactNode;
  renderModalActions?: (
    req: SharedCollectionRequest,
    onClose: () => void,
    onSuccess: () => void,
    setRequests: React.Dispatch<
      React.SetStateAction<SharedCollectionRequest[]>
    >,
  ) => React.ReactNode;
}

const SharedExtractPage = ({
  title,
  subtitle,
  fetchUrl,
  emptyMessage,
  emptyIcon = <Package size={32} />,
  renderCardFooter,
  renderModalActions,
}: SharedExtractPageProps) => {
  const [requests, setRequests] = useState<SharedCollectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<SharedCollectionRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchUrl]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await apiBack.get(fetchUrl);
      const data = response.data;
      setRequests(Array.isArray(data) ? data : data.requests || []);
    } catch (error) {
      console.error("Error fetching extract:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "CONCLUIDA":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle2 size={14} /> Concluída
          </span>
        );
      case "CANCELLED":
      case "CANCELADA":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
            <XCircle size={14} /> Cancelada
          </span>
        );
      case "ACCEPTED":
      case "ACEITA":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            <Clock3 size={14} /> A caminho
          </span>
        );
      case "PENDING":
      case "PENDENTE":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            <Clock3 size={14} /> Pendente
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Responsivo */}
      <div className="md:block hidden bg-linear-to-r from-emerald-50 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
          {subtitle}
        </p>
      </div>

      <div className="md:hidden">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {subtitle}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 border-dashed">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-500 mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 text-sm animate-pulse">
            Carregando histórico...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 border-dashed p-16 text-center flex flex-col items-center justify-center">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center w-20 h-20 rounded-full mb-6 text-zinc-400 dark:text-zinc-500">
            {emptyIcon}
          </div>
          <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
            Nenhuma solicitação
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => {
            const dateStr =
              typeof req.createdAt === "string"
                ? req.createdAt
                : new Date().toISOString();

            // Lógica de Mapper Visual
            const cat = req.material || "OUTROS";
            const MaterialInfo = MATERIALS_MAP[cat];
            const MaterialIcon = MaterialInfo ? MaterialInfo.icon : Package;
            const materialColorClass = MaterialInfo
              ? MaterialInfo.color
                  .replace("bg-", "dark:bg-")
                  .replace("border-", "dark:border-")
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
            const badgeLabel = MaterialInfo ? MaterialInfo.label : "Outros";

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className="group relative flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:-translate-y-1 cursor-pointer"
              >
                {/* Header (Status & ID) */}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex flex-col gap-2">
                    {renderStatusBadge(req.status)}
                    <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                      ID-{req.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Material Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${materialColorClass}`}
                  >
                    <MaterialIcon size={24} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {req.materialName || badgeLabel}
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {badgeLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 inline-flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        Peso:
                      </span>
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                        {req.totalWeight ? `${req.totalWeight}kg` : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Calendar size={14} className="text-zinc-400" />
                    {format(parseISO(dateStr), "dd MMM, yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </div>

                <hr className="my-4 border-zinc-100 dark:border-zinc-800/80" />

                {/* Footer Injetado Dinamicamente */}
                <div className="flex items-center justify-between mt-auto">
                  {renderCardFooter ? (
                    renderCardFooter(req)
                  ) : (
                    <div className="text-xs text-transparent select-none">
                      .
                    </div>
                  )}

                  <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Injetado Dinamicamente */}
      <SharedRequestDetailsModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSuccess={() => {
          setSelectedRequest(null);
          fetchRequests();
        }}
        renderActions={renderModalActions}
        setRequests={setRequests}
      />
    </div>
  );
};

export default SharedExtractPage;
