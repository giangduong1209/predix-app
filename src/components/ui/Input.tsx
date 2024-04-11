import { cn } from "@/utils/merge-class";
import { VariantProps, cva } from "class-variance-authority";
import React, { FC, InputHTMLAttributes } from "react";

export const InputVariants = cva(
  "rounded-sm py-2 w-full focus:outline-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-[--colors-input] boder-[--colors-inputSecondary]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  isDisable?: boolean;
  ref?: React.LegacyRef<HTMLInputElement> | undefined;
}

const Input: FC<InputProps> = ({
  className,
  variant,
  isDisable,
  ref,
  ...props
}) => {
  return (
    <input
      className={cn(InputVariants({ className, variant }))}
      autoFocus
      ref={ref}
      disabled={isDisable}
      {...props}
    />
  );
};

export default Input;
