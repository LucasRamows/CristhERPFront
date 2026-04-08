import { Ban, CheckCircle } from "lucide-react";
import type { CostomersResponse } from "../../../services/costomers/customers.service";

export interface PassbookClientListPanelProps {
  clients: CostomersResponse[];
  activeClientId: string | null;
  setActiveClientId: (id: string | null) => void;
}

export function PassbookClientListPanel({
  clients,
  activeClientId,
  setActiveClientId,
}: PassbookClientListPanelProps) {


  return (
    <div
      className={`w-full lg:w-1/3 flex flex-col transition-transform ${
        activeClientId ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {clients?.map((client) => {
          return (
            <button
              key={client.id}
              onClick={() => setActiveClientId(client.id)}
              className={`w-full cursor-pointer card-default text-left p-4 mb-3 flex items-center gap-4 ${
                activeClientId === client.id
                  ? "bg-secondary border-secondary shadow-md"
                  : "bg-card border-decoration hover:border-secondary"
              }`}
            >
              {/* Avatar Simples */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full bg-decoration flex items-center justify-center text-muted-foreground font-black text-xl">
                  {client.nickname.charAt(0)}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                    client.isBlocked
                      ? "bg-red-100 text-red-500"
                      : "bg-green-100 text-green-500"
                  }`}
                >
                  {client.isBlocked ? (
                    <Ban size={12} />
                  ) : (
                    <CheckCircle size={12} />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg text-primary truncate">
                  {client.nickname}
                </p>
                <p className="text-sm font-semibold text-muted-foreground truncate">
                  {client.fullName}
                </p>
              </div>

              {/* Valor */}
              <div className="text-right shrink-0">
                <p
                  className={`font-black text-lg ${
                    client.saldoDevedor > 0 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  R$ {(Number(client.saldoDevedor) || 0).toFixed(2)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
