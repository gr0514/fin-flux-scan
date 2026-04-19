import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent?: "primary" | "success" | "danger" | "warning";
  children?: React.ReactNode;
}

const accentMap = {
  primary: { text: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30" },
  success: { text: "text-success", bg: "bg-success/10", ring: "ring-success/30" },
  danger: { text: "text-danger", bg: "bg-danger/10", ring: "ring-danger/30" },
  warning: { text: "text-warning", bg: "bg-warning/10", ring: "ring-warning/30" },
};

export function MetricCard({ label, value, unit, delta, trend = "up", icon: Icon, accent = "primary", children }: MetricCardProps) {
  const a = accentMap[accent];
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="card-surface p-5 animate-fade-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className={cn("font-display text-3xl font-semibold tabular-nums", a.text)}>{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          {delta && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs">
              <TrendIcon className={cn("h-3.5 w-3.5", trend === "up" ? "text-success" : "text-danger")} />
              <span className={trend === "up" ? "text-success" : "text-danger"}>{delta}</span>
              <span className="text-muted-foreground">vs 1h ago</span>
            </div>
          )}
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg ring-1", a.bg, a.ring)}>
          <Icon className={cn("h-4.5 w-4.5", a.text)} />
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
