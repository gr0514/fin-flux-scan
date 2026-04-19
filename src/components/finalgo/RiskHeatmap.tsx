import { useState } from "react";

interface Region {
  name: string;
  cx: number;
  cy: number;
  count: number;
  risk: number; // 0-1
}

const regions: Region[] = [
  { name: "Caracas, VE", cx: 30, cy: 58, count: 412, risk: 0.96 },
  { name: "Lagos, NG", cx: 52, cy: 62, count: 388, risk: 0.91 },
  { name: "Bucharest, RO", cx: 56, cy: 36, count: 247, risk: 0.84 },
  { name: "Mumbai, IN", cx: 70, cy: 50, count: 198, risk: 0.71 },
  { name: "Singapore, SG", cx: 80, cy: 58, count: 156, risk: 0.62 },
  { name: "Berlin, DE", cx: 53, cy: 32, count: 84, risk: 0.42 },
  { name: "London, UK", cx: 49, cy: 30, count: 72, risk: 0.38 },
  { name: "São Paulo, BR", cx: 35, cy: 68, count: 134, risk: 0.55 },
  { name: "Hong Kong, CN", cx: 78, cy: 48, count: 122, risk: 0.6 },
  { name: "Moscow, RU", cx: 60, cy: 28, count: 168, risk: 0.74 },
  { name: "New York, US", cx: 25, cy: 38, count: 95, risk: 0.32 },
  { name: "Sydney, AU", cx: 86, cy: 76, count: 41, risk: 0.22 },
];

function colorFor(risk: number) {
  if (risk > 0.85) return "hsl(var(--danger))";
  if (risk > 0.6) return "hsl(var(--warning))";
  if (risk > 0.4) return "hsl(199 100% 60%)";
  return "hsl(var(--success))";
}

export function RiskHeatmap() {
  const [hover, setHover] = useState<Region | null>(null);

  return (
    <div className="relative">
      <svg viewBox="0 0 100 90" className="w-full h-[280px]">
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(199 100% 55%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(199 100% 55%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle grid background */}
        <rect width="100" height="90" fill="url(#globeGlow)" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            x2="100"
            y1={(i + 1) * 9}
            y2={(i + 1) * 9}
            stroke="hsl(var(--border))"
            strokeOpacity={0.35}
            strokeWidth={0.15}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={(i + 1) * 8}
            x2={(i + 1) * 8}
            y1="0"
            y2="90"
            stroke="hsl(var(--border))"
            strokeOpacity={0.35}
            strokeWidth={0.15}
          />
        ))}

        {/* Stylized continent silhouettes (simple paths) */}
        <g fill="hsl(220 25% 14%)" opacity={0.85}>
          {/* North America */}
          <path d="M10,22 Q14,18 22,20 L30,22 L32,30 L28,40 L20,42 L14,38 L12,30 Z" />
          {/* South America */}
          <path d="M28,48 L34,48 L36,60 L32,72 L28,72 L26,62 Z" />
          {/* Europe */}
          <path d="M46,24 L58,24 L60,32 L54,38 L46,36 Z" />
          {/* Africa */}
          <path d="M48,40 L60,40 L62,52 L58,66 L52,68 L48,58 Z" />
          {/* Asia */}
          <path d="M60,22 L88,24 L90,38 L82,46 L72,46 L66,38 L62,30 Z" />
          {/* Australia */}
          <path d="M80,68 L90,68 L92,76 L86,80 L80,76 Z" />
        </g>

        {/* Heat dots */}
        {regions.map((r) => {
          const radius = 1.2 + r.count / 120;
          const c = colorFor(r.risk);
          const isHover = hover?.name === r.name;
          return (
            <g key={r.name} onMouseEnter={() => setHover(r)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
              {/* glow */}
              <circle cx={r.cx} cy={r.cy} r={radius * 3} fill={c} opacity={0.12} />
              <circle cx={r.cx} cy={r.cy} r={radius * 2} fill={c} opacity={0.22} />
              <circle cx={r.cx} cy={r.cy} r={radius} fill={c} opacity={0.95}>
                {r.risk > 0.85 && (
                  <animate attributeName="opacity" values="0.95;0.5;0.95" dur="1.6s" repeatCount="indefinite" />
                )}
              </circle>
              {isHover && <circle cx={r.cx} cy={r.cy} r={radius + 1.2} fill="none" stroke={c} strokeWidth={0.4} />}
            </g>
          );
        })}
      </svg>

      {hover && (
        <div className="absolute top-3 right-3 card-surface px-3 py-2.5 text-[11px] min-w-[170px] pointer-events-none">
          <p className="font-medium text-foreground">{hover.name}</p>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <span className="text-muted-foreground">Anomalies</span>
            <span className="font-mono text-right text-foreground">{hover.count}</span>
            <span className="text-muted-foreground">Risk score</span>
            <span className="font-mono text-right" style={{ color: colorFor(hover.risk) }}>
              {(hover.risk * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />Low</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "hsl(199 100% 60%)" }} />Med</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />High</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" />Critical</span>
        </div>
        <span className="font-mono">12 hotspots · 2,117 events</span>
      </div>
    </div>
  );
}
