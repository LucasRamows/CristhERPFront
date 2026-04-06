import { useState, useEffect } from "react";

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
  value: number | null;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export function BrInput({
  decimals = 2,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  className,
  inputClassName,
  disabled,
}: BrInputProps) {
  const [display, setDisplay] = useState(
    value !== null && value !== undefined ? formatBr(value, decimals) : ""
  );

  useEffect(() => {
    if (value !== null && value !== undefined) {
      setDisplay(formatBr(value, decimals));
    } else {
      setDisplay("");
    }
  }, [value, decimals]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseBrNumber(e.target.value, decimals);
    const formatted = e.target.value === "" ? "" : formatBr(num, decimals);
    setDisplay(e.target.value === "" ? "" : formatted);
    onChange(num);
  }

  return (
    <div className={className || "flex items-center h-9 bg-muted border border-border rounded-xl px-3 focus-within:border-foreground/30 focus-within:bg-background transition-all"}>
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
        disabled={disabled}
        placeholder={placeholder ?? (decimals === 3 ? "0,000" : "0,00")}
        className={inputClassName || "flex-1 bg-transparent border-none font-bold text-foreground text-sm outline-none w-full disabled:opacity-50"}
      />
      {suffix && (
        <span className="text-xs font-bold text-muted-foreground ml-1">
          {suffix}
        </span>
      )}
    </div>
  );
}