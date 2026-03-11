import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../components/ui/utils";

interface DosyaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const DosyaButton = forwardRef<HTMLButtonElement, DosyaButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      ghost: "text-foreground hover:bg-secondary/50",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[36px]",
      md: "px-6 py-3 text-base min-h-[44px]",
      lg: "px-8 py-4 text-lg min-h-[52px]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DosyaButton.displayName = "DosyaButton";
