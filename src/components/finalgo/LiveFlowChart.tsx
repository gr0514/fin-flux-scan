import { useEffect, useState } from "react";

function generate(n: number) {
  const arr: number[] = [];
  let v = 60;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.45) * 14;
    v = Math.max(20, Math.min(110, v));
    arr.push(v);
  }
  return arr;
}

export function LiveFlowChart() {
  const [data, setData] = useState<number[]>(() => generate(60));

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const next = [...d.slice(1)];
        const last = d[d.length - 1];
        let v = last + (Math.random() - 0.45) * 14;
        v = Math.max(20, Math.min(110, v));
        next.push(v);
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const w = 1000;
  const h = 280;
  const pad = 24;
  const max = 120;
  const min = 0;
  const step = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => [pad + i * step, h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
  const last = points[points.length - 1];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[280px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flow-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(199 100% 55%)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="hsl(199 100% 55%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flow-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(142 90% 50%)" />
            <stop offset="60%" stopColor="hsl(199 100% 55%)" />
            <stop offset="100%" stopColor="hsl(220 95% 65%)" />
          </linearGradient>
          <filter id="flow-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* gridlines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={pad}
            x2={w - pad}
            y1={pad + ((h - pad * 2) / 4) * i}
            y2={pad + ((h - pad * 2) / 4) * i}
            stroke="hsl(220 22% 18%)"
            strokeDasharray="2 4"
          />
        ))}

        <path d={area} fill="url(#flow-area)" />
        <path d={path} stroke="url(#flow-stroke)" strokeWidth="2.25" fill="none" strokeLinejoin="round" strokeLinecap="round" filter="url(#flow-glow)" />

        {/* leading marker */}
        <circle cx={last[0]} cy={last[1]} r="6" fill="hsl(199 100% 55%)" opacity="0.25" />
        <circle cx={last[0]} cy={last[1]} r="3.5" fill="hsl(199 100% 55%)" />
        <line x1={last[0]} x2={last[0]} y1={pad} y2={h - pad} stroke="hsl(199 100% 55%)" strokeOpacity="0.25" strokeDasharray="3 4" />
      </svg>

      {/* Y-axis labels */}
      <div className="pointer-events-none absolute inset-y-6 left-1 flex flex-col justify-between text-[10px] text-muted-foreground font-mono">
        <span>120</span>
        <span>90</span>
        <span>60</span>
        <span>30</span>
        <span>0</span>
      </div>
    </div>
  );
}
