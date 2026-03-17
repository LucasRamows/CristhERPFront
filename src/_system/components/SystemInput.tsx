import React from "react";

export interface SystemInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function SystemInput({ label, ...props }: SystemInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      <input
        {...props}
        className="h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-500/30 disabled:bg-zinc-50 dark:disabled:bg-zinc-900 disabled:text-zinc-500 dark:disabled:text-zinc-500 transition-colors"
      />
    </div>
  );
}
