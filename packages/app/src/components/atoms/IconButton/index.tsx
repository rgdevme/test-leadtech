import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type IconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
  }
>;

export const IconButton = ({
  children,
  className = "",
  label,
  type = "button",
  ...props
}: IconButtonProps) => (
  <button
    aria-label={label}
    className={`inline-grid size-10 place-items-center rounded-[6px] border border-transparent text-muted transition duration-200 hover:border-line hover:bg-white hover:text-charcoal active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    title={label}
    type={type}
    {...props}
  >
    {children}
  </button>
);
