import { cn } from "@/lib/utils";

interface HealthRingProps {
  label: string;
  value: number; // 0-100
  sub: string;
  color: "success" | "primary" | "warning" | "danger";
}

const colorMap = {
  success: "hsl(var(--success))",
  primary: "hsl(var(--primary))",
  warning: "hsl(var(--warning))",
  danger: "hsl(var(--danger))",
};

const textMap = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  danger: "text-danger",
};

export function HealthRing({ label, value, sub, color }: HealthRingProps) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const stroke = colorMap[color];

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-3 hover:border-primary/30 transition">
      <div className="relative h-[72px] w-[72px] shrink-0">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
          <circle cx="36" cy="36" r={r} stroke="hsl(220 22% 18%)" strokeWidth="6" fill="none" />
          <circle
            cx="36"
            cy="36"
            r={r}
            stroke={stroke}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${stroke})`, transition: "stroke-dashoffset 600ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className={cn("font-display text-sm font-semibold tabular-nums", textMap[color])}>{value}%</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
