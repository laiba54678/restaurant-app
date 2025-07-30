"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
export default Button; 