import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BanknoteArrowUp, CalendarIcon, X } from "lucide-react";
import { useState } from "react";

import { BrInput } from "../../../../components/ui/BrInput"; // Ajuste o caminho se necessário
import { Button } from "../../../../components/ui/button";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { usePassbook } from "../../hooks/PassbookContext";

export default function AddDebtSheet() {
  const { addDebtAction } = usePassbook();

  // Estado local para gerenciar abertura/fechamento
  const [isOpen, setIsOpen] = useState(false);

  // Estados do formulário
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!description || !amount || !date) return;

    try {
      setIsSubmitting(true);

      // Chama a action do contexto
      await addDebtAction({
        description,
        amount,
        date,
      });

      // Se deu sucesso, fecha a gaveta (o que também limpa os dados)
      handleOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar dívida:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função centralizada para abrir/fechar e limpar o form
  const handleOpenChange = (newOpenState: boolean) => {
    setIsOpen(newOpenState);
    if (!newOpenState) {
      // Limpa os campos sempre que fechar
      setDescription("");
      setAmount(0);
      setDate(new Date());
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {/* O GATILHO ESTÁ AQUI DENTRO AGORA! */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button>
                <BanknoteArrowUp size={20} />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lançar Dívida Avulsa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* O CONTEÚDO DO SHEET */}
      <SheetContent
        side="right"
        className="w-[90%] sm:max-w-112.5 p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
      >
        <SheetTitle className="sr-only">Lançar Nova Dívida</SheetTitle>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
              Caderneta • Cliente
            </p>
            <h2 className="text-2xl font-black">Nova Dívida</h2>
          </div>
          <button
            onClick={() => handleOpenChange(false)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
              Descrição da Dívida
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra de roupas, saldo devedor..."
              className="w-full h-14 px-5 bg-zinc-50 border border-zinc-200/50 rounded-[20px] focus:bg-white focus:border-[#44A08D] focus:ring-1 focus:ring-[#44A08D] outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
            />
          </div>

          {/* Valores */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
              Valor Total
            </label>
            <BrInput
              prefix="R$"
              decimals={2}
              value={amount}
              onChange={(val) => setAmount(val)}
            />
          </div>

          {/* Data da Cobrança */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
              Data da Cobrança
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full h-14 px-5 justify-start text-left transition-all bg-zinc-50 border-zinc-200/50 rounded-[20px] hover:bg-white hover:border-[#44A08D] font-semibold text-zinc-900 ${
                    !date ? "text-zinc-400 font-medium" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-60" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  required
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Botão Salvar Fixo no Final */}
          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={!date || !description || !amount || isSubmitting}
              className={`w-full h-14 bg-gray-900 text-white rounded-[20px] font-bold text-base transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 ${
                !date || !description || !amount || isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {isSubmitting ? "Salvando..." : "Salvar Dívida"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
