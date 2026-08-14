import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { Spinner } from "@/components/atoms/Spinner";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    variant?: ButtonVariant;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-charcoal bg-charcoal text-white hover:bg-ink",
  secondary: "border-line bg-white text-charcoal hover:bg-bone",
  quiet: "border-transparent bg-transparent text-muted hover:bg-bone hover:text-charcoal",
  danger: "border-pale-red bg-pale-red text-danger hover:border-danger",
};

export const Button = ({
  children,
  className = "",
  disabled,
  loading = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    disabled={disabled || loading}
    type={type}
    {...props}
  >
    {loading ? <Spinner size="small" /> : null}
    {children}
  </button>
);
