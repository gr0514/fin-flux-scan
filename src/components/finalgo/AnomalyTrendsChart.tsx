import { useMemo, useState } from "react";

// 30 days of synthetic data — legitimate vs anomalous tx counts
const data = Array.from({ length: 30 }, (_, i) => {
  const base = 4200 + Math.round(Math.sin(i / 3) * 600 + i * 35 + Math.random() * 400);
  const anomaly = Math.max(20, Math.round(80 + Math.sin(i / 2.2) * 40 + Math.random() * 60 + (i > 22 ? 90 : 0)));
  return { day: i + 1, legit: base, anomaly };
});

export function AnomalyTrendsChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = useMemo(() => Math.max(...data.map((d) => d.legit + d.anomaly)), []);
  const W = 720;
  const H = 260;
  const padL = 44;
  const padB = 28;
  const padT = 12;
  const innerW = W - padL - 12;
  const innerH = H - padT - padB;
  const barW = innerW / data.length;
  const gap = barW * 0.28;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[260px]">
        <defs>
          <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--danger))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--danger))" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Y grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = padT + innerH * (1 - p);
          return (
            <g key={p}>
              <line x1={padL} x2={W - 12} y1={y} y2={y} stroke="hsl(var(--border))" strokeOpacity={0.5} strokeDasharray="2 4" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="JetBrains Mono">
                {Math.round((max * p) / 1000)}k
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x = padL + i * barW + gap / 2;
          const w = barW - gap;
          const totalH = ((d.legit + d.anomaly) / max) * innerH;
          const anomH = (d.anomaly / max) * innerH;
          const legitH = totalH - anomH;
          const y0 = padT + innerH - totalH;
          const isHover = hover === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <rect x={x - 2} y={padT} width={w + 4} height={innerH} fill="transparent" />
              {/* Legit (bottom) */}
              <rect
                x={x}
                y={y0 + anomH}
                width={w}
                height={legitH}
                fill="url(#legitGrad)"
                rx="2"
                opacity={hover !== null && !isHover ? 0.45 : 1}
              />
              {/* Anomaly (top) */}
              <rect
                x={x}
                y={y0}
                width={w}
                height={anomH}
                fill="url(#anomGrad)"
                rx="2"
                opacity={hover !== null && !isHover ? 0.45 : 1}
              />
              {isHover && (
                <line x1={x + w / 2} x2={x + w / 2} y1={padT} y2={padT + innerH} stroke="hsl(var(--primary))" strokeOpacity={0.4} strokeDasharray="3 3" />
              )}
            </g>
          );
        })}

        {/* X axis labels (every 5) */}
        {data.map((d, i) =>
          (i + 1) % 5 === 0 || i === 0 ? (
            <text
              key={i}
              x={padL + i * barW + barW / 2}
              y={H - 10}
              textAnchor="middle"
              fontSize="9"
              fill="hsl(var(--muted-foreground))"
              fontFamily="JetBrains Mono"
            >
              D{d.day}
            </text>
          ) : null
        )}
      </svg>

      {/* Custom tooltip */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
          style={{
            left: `${((padL + hover * barW + barW / 2) / W) * 100}%`,
            top: `${((padT + innerH - ((data[hover].legit + data[hover].anomaly) / max) * innerH) / H) * 100}%`,
          }}
        >
          <div className="card-surface px-3 py-2 text-[11px] min-w-[160px] shadow-glow-primary">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1.5">Day {data[hover].day}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary" /> Legitimate</span>
              <span className="font-mono text-foreground font-semibold">{data[hover].legit.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-3 mt-1">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-danger" /> Anomalous</span>
              <span className="font-mono text-danger font-semibold">{data[hover].anomaly.toLocaleString()}</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Anomaly rate</span>
              <span className="font-mono text-warning">
                {((data[hover].anomaly / (data[hover].legit + data[hover].anomaly)) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
