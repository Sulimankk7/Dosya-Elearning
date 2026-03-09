import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../components/ui/utils";

interface DosyaCardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const DosyaCard = forwardRef<HTMLDivElement, DosyaCardProps>(
  ({ className, glass = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card rounded-2xl p-6 shadow-lg",
          glass && "backdrop-blur-sm bg-card/50 border border-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DosyaCard.displayName = "DosyaCard";
