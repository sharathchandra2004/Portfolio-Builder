import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-ink-faint focus:border-ink/30 ${className}`}
      {...props}
    />
  );
}
