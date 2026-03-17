import { CheckCircle } from "lucide-react";

interface SuccessScreenProps {
  message?: string;
  onClose?: () => void;
}

export default function SuccessScreen({
  message = "Material enviado com sucesso!",
  onClose,
}: SuccessScreenProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl w-96 text-center">
        <CheckCircle className="text-emerald-500 w-20 h-20" />
        <h2 className="text-2xl font-bold text-gray-900">{message}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition-all"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
