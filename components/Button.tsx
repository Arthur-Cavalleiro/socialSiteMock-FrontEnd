"use client";

import { forwardRef } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "cancel"
  | "danger"
  | "success"
  | "ghost"
  | "icon";

type ButtonProps = {
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  uppercase?: boolean;
  size?: "default" | "fixed" | "fixedSm";
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
  onClick?: () => void;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
>;

const variantStyles: Record<
  ButtonVariant,
  string
> = {
  primary:
    "cursor-pointer rounded-lg bg-[#7695EC] text-base font-bold text-white transition-colors hover:bg-[#6b87e0] disabled:cursor-not-allowed disabled:bg-[#A8A8A8] disabled:hover:bg-[#A8A8A8] dark:disabled:bg-zinc-600 dark:disabled:hover:bg-zinc-600",
  secondary:
    "cursor-pointer rounded-lg border border-[#999999] bg-white text-base font-bold text-[#000000] transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600",
  cancel:
    "cursor-pointer rounded border border-zinc-400 bg-zinc-200 px-6 py-2 text-base font-bold text-zinc-900 transition-colors hover:bg-zinc-300 disabled:opacity-50 dark:border-zinc-500 dark:bg-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-500",
  danger:
    "cursor-pointer rounded-lg bg-[#FF5151] text-base font-bold text-white transition-colors hover:bg-[#e64848] disabled:opacity-50 dark:bg-[#FF5151] dark:hover:bg-[#e64848]",
  success:
    "cursor-pointer rounded-lg bg-[#47B960] text-base font-bold text-white transition-colors hover:bg-[#3da352] disabled:opacity-50 dark:bg-[#47B960] dark:hover:bg-[#3da352]",
  ghost:
    "cursor-pointer rounded px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20",
  icon:
    "cursor-pointer rounded p-1 transition-opacity hover:opacity-80",
};

const sizeStyles: Record<string, string> = {
  default: "h-8 px-6 py-2",
  fixed: "h-8 w-[120px]",
  fixedSm: "h-8 w-[111px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      type = "button",
      disabled = false,
      uppercase = false,
      size = "default",
      className = "",
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const base = "inline-flex items-center justify-center";
    const sizeClass = variant === "icon" ? "" : sizeStyles[size];
    const variantClass = variantStyles[variant];
    const combined =
      [base, sizeClass, variantClass, uppercase && "uppercase tracking-wide", className]
        .filter(Boolean)
        .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={combined}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
