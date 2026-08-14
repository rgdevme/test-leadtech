import type { InputHTMLAttributes, PropsWithChildren } from "react";

type InputProps = PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>;

export const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`min-h-12 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[0.95rem] text-charcoal outline-none transition placeholder:text-soft focus:border-charcoal focus:ring-2 focus:ring-charcoal/5 disabled:cursor-not-allowed disabled:bg-bone disabled:text-muted ${className}`}
    {...props}
  />
);
