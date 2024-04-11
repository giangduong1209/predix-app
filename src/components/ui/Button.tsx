import React, { ButtonHTMLAttributes, FC } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/merge-class";

export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        ghost: "bg-transparent hover:text-slate-900 hover:bg-slate-200",
        success:
          "bg-[--colors-primary] text-white rounded-2xl hover:bg-[--colors-primary] hover:opacity-70",
        error:
          "bg-[--colors-failure] text-white rounded-2xl hover:bg-[--colors-failure] hover:opacity-70",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

/**
 * * Button component for reuseable
 * @param props
 * @returns Button
 */

const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  isLoading,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="loading loading-spinner text-primary mr-2 loading-sm"></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
