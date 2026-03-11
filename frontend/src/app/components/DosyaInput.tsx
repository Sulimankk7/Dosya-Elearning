import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../components/ui/utils";

interface DosyaInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const DosyaInput = forwardRef<HTMLInputElement, DosyaInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[44px]",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

DosyaInput.displayName = "DosyaInput";
