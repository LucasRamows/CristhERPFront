import { useState } from "react";

function parseBrNumber(raw: string, decimals: number): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10) / Math.pow(10, decimals);
}

function formatBr(value: number, decimals: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface BrInputProps {
  decimals?: number;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

export function BrInput({
  decimals = 2,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}: BrInputProps) {
  const [display, setDisplay] = useState(
    value ? formatBr(value, decimals) : ""
  );

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseBrNumber(e.target.value, decimals);
    const formatted = num ? formatBr(num, decimals) : "";
    setDisplay(formatted);
    onChange(num);
  }

  return (
    <div className="flex items-center h-9 bg-muted border border-border rounded-xl px-3 focus-within:border-foreground/30 focus-within:bg-background transition-all">
      {prefix && (
        <span className="text-xs font-bold text-muted-foreground mr-1">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleInput}
        placeholder={placeholder ?? (decimals === 3 ? "0,000" : "0,00")}
        className="flex-1 bg-transparent border-none font-bold text-foreground text-sm outline-none"
      />
      {suffix && (
        <span className="text-xs font-bold text-muted-foreground ml-1">
          {suffix}
        </span>
      )}
    </div>
  );
}