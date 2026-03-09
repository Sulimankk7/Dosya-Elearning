import { cn } from "./ui/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "completed" | "locked" | "pending";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const variants = {
    active: "bg-primary/20 text-primary border-primary/30",
    inactive: "bg-muted text-muted-foreground border-border",
    completed: "bg-primary/20 text-primary border-primary/30",
    locked: "bg-muted text-muted-foreground border-border",
    pending: "bg-warning-amber/20 text-warning-amber border-warning-amber/30",
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs border",
        variants[status]
      )}
    >
      {children}
    </span>
  );
}
