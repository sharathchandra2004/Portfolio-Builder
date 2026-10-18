import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition placeholder:text-ink-faint focus:border-ink/30 ${className}`}
      {...props}
    />
  );
}
