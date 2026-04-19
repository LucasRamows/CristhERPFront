import { BrInput } from "../../../components/ui/BrInput";

interface InventoryQuantityInputProps {
  unit: string;
  value: number | null;
  onChange: (value: number) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function InventoryQuantityInput({
  unit,
  value,
  onChange,
  className,
  inputClassName,
  placeholder,
  disabled,
}: InventoryQuantityInputProps) {
  const isUnit = unit?.toLowerCase() === "un";
  const decimals = isUnit ? 0 : 3;

  return (
    <div className={className}>
      <BrInput
        value={value}
        onChange={onChange}
        decimals={decimals}
        suffix={unit}
        className={inputClassName}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
