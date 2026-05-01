import { useEffect, useRef, useState } from "react";
import { Activity, CircleCheck, CircleAlert, CircleX, Cpu, Database, ShieldCheck, Radio, Users, Gauge, Server, Zap, TerminalSquare, Pause, Play, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { cn } from "@/lib/utils";

type Status = "healthy" | "degraded" | "down";

interface ServiceCard {
  name: string;
  description: string;
  icon: typeof Cpu;
  status: Status;
  uptime: string;
  latencyMs: number;
  rps: number;
  version: string;
  region: string;
}

const initialServices: ServiceCard[] = [
  { name: "Identity Service", description: "OAuth, JWT, session management", icon: ShieldCheck, status: "healthy", uptime: "99.99%", latencyMs: 18, rps: 412, version: "v2.4.1", region: "eu-west-1" },
  { name: "Transaction Service", description: "Ledger ingest & enrichment pipeline", icon: Database, status: "healthy", uptime: "99.97%", latencyMs: 42, rps: 2840, version: "v3.2.1", region: "eu-west-1" },
  { name: "Fraud Detection", description: "ML scoring & anomaly engine", icon: Cpu, status: "degraded", uptime: "99.82%", latencyMs: 134, rps: 1920, version: "v4.0.0-rc.3", region: "eu-west-1" },
  { name: "Notification Gateway", description: "Email, SMS & push fan-out", icon: Radio, status: "healthy", uptime: "99.95%", latencyMs: 27, rps: 188, version: "v1.8.2", region: "eu-west-1" },
  { name: "Reporting API", description: "Aggregations & exports", icon: Server, status: "healthy", uptime: "99.91%", latencyMs: 64, rps: 76, version: "v2.1.0", region: "eu-west-1" },
  { name: "Audit Log Sink", description: "Immutable append-only stream", icon: Activity, status: "down", uptime: "97.10%", latencyMs: 0, rps: 0, version: "v1.3.4", region: "eu-west-1" },
];

const statusMeta: Record<Status, { label: string; dot: string; ring: string; text: string; bg: string; Icon: typeof CircleCheck }> = {
  healthy: { label: "Operational", dot: "bg-success", ring: "ring-success/30", text: "text-success", bg: "bg-success/10", Icon: CircleCheck },
  degraded: { label: "Degraded", dot: "bg-warning", ring: "ring-warning/30", text: "text-warning", bg: "bg-warning/10", Icon: CircleAlert },
  down: { label: "Outage", dot: "bg-danger", ring: "ring-danger/30", text: "text-danger", bg: "bg-danger/10", Icon: CircleX },
};

type LogLevel = "info" | "warn" | "error" | "success";
interface LogEntry {
  id: number;
  ts: string;
  level: LogLevel;
  source: string;
  message: string;
}

const logSources = ["identity", "transaction", "fraud", "notify", "audit", "signalr", "gateway"];
const logTemplates: { level: LogLevel; tpl: string }[] = [
  { level: "info", tpl: "Heartbeat OK · jitter {n}ms" },
  { level: "info", tpl: "Stream consumer rebalanced (partition {n})" },
  { level: "success", tpl: "Batch flushed · {n} events committed" },
  { level: "warn", tpl: "Retry queue depth elevated ({n})" },
  { level: "warn", tpl: "Latency spike {n}ms on inbound channel" },
  { level: "error", tpl: "Failed to ack message · txn-{n}" },
  { level: "info", tpl: "Connection upgraded → wss · clients={n}" },
  { level: "success", tpl: "Snapshot persisted · checkpoint {n}" },
];

const levelMeta: Record<LogLevel, { text: string; tag: string }> = {
  info: { text: "text-primary", tag: "INFO " },
  warn: { text: "text-warning", tag: "WARN " },
  error: { text: "text-danger", tag: "ERROR" },
  success: { text: "text-success", tag: "OK   " },
};

function nowStamp() {
  const d = new Date();
  return d.toISOString().split("T")[1].replace("Z", "");
}

function StatusPill({ status }: { status: Status }) {
  const m = statusMeta[status];
  const Icon = m.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1", m.bg, m.text, m.ring)}>
      <Icon className="h-3 w-3" />
      {m.label}
    </span>
  );
}

const SystemHealth = () => {
  const [services] = useState<ServiceCard[]>(initialServices);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [latency, setLatency] = useState(14);
  const [latencyHistory, setLatencyHistory] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 12 + Math.random() * 10)
  );
  const [connections, setConnections] = useState(1284);
  const [msgRate, setMsgRate] = useState(412);
  const idRef = useRef(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  // simulate signalR metrics
  useEffect(() => {
    const t = setInterval(() => {
      const next = Math.max(6, Math.min(80, latency + (Math.random() - 0.5) * 6));
      setLatency(Math.round(next));
      setLatencyHistory((h) => [...h.slice(-39), next]);
      setConnections((c) => Math.max(800, c + Math.round((Math.random() - 0.45) * 18)));
      setMsgRate((m) => Math.max(80, m + Math.round((Math.random() - 0.5) * 40)));
    }, 1500);
    return () => clearInterval(t);
  }, [latency]);

  // simulate log stream
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const tpl = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const src = logSources[Math.floor(Math.random() * logSources.length)];
      const n = Math.floor(Math.random() * 9000 + 100);
      const entry: LogEntry = {
        id: ++idRef.current,
        ts: nowStamp(),
        level: tpl.level,
        source: src,
        message: tpl.tpl.replace("{n}", String(n)),
      };
      setLogs((prev) => [...prev.slice(-180), entry]);
    }, 700 + Math.random() * 600);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs]);

  const total = services.length;
  const healthy = services.filter((s) => s.status === "healthy").length;
  const degraded = services.filter((s) => s.status === "degraded").length;
  const down = services.filter((s) => s.status === "down").length;
  const overall: Status = down > 0 ? "down" : degraded > 0 ? "degraded" : "healthy";

  // sparkline path
  const sparkW = 280;
  const sparkH = 60;
  const min = Math.min(...latencyHistory);
  const max = Math.max(...latencyHistory);
  const range = Math.max(1, max - min);
  const path = latencyHistory
    .map((v, i) => {
      const x = (i / (latencyHistory.length - 1)) * sparkW;
      const y = sparkH - ((v - min) / range) * sparkH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 px-6 lg:px-8 py-6 space-y-6">
          {/* Title */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">System Health</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Live infrastructure telemetry · {total} services monitored ·{" "}
                <span className="text-foreground font-medium">eu-west-1</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 ring-1", statusMeta[overall].bg, statusMeta[overall].ring)}>
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", statusMeta[overall].dot, overall === "healthy" && "pulse-dot")} />
                <span className={cn("text-xs font-medium", statusMeta[overall].text)}>
                  {overall === "healthy" ? "All systems operational" : overall === "degraded" ? "Partial degradation" : "Active incident"}
                </span>
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Healthy", value: healthy, accent: "success" as const, Icon: CircleCheck },
              { label: "Degraded", value: degraded, accent: "warning" as const, Icon: CircleAlert },
              { label: "Down", value: down, accent: "danger" as const, Icon: CircleX },
              { label: "Avg Latency", value: `${Math.round(services.reduce((a, s) => a + s.latencyMs, 0) / total)}ms`, accent: "primary" as const, Icon: Gauge },
            ].map((c) => {
              const colors = {
                success: "text-success bg-success/10 ring-success/25",
                warning: "text-warning bg-warning/10 ring-warning/25",
                danger: "text-danger bg-danger/10 ring-danger/25",
                primary: "text-primary bg-primary/10 ring-primary/25",
              }[c.accent];
              return (
                <div key={c.label} className="card-surface p-4 flex items-center gap-4">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-lg ring-1", colors)}>
                    <c.Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{c.label}</p>
                    <p className="font-display text-2xl font-semibold tabular-nums mt-0.5">{c.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Microservices grid */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold">Microservices</h2>
              <p className="text-xs text-muted-foreground">Polling every 5s · health endpoint /healthz</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {services.map((s) => {
                const meta = statusMeta[s.status];
                return (
                  <div key={s.name} className="card-surface p-5 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("grid h-10 w-10 place-items-center rounded-lg ring-1", meta.bg, meta.ring)}>
                          <s.icon className={cn("h-4.5 w-4.5", meta.text)} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{s.description}</p>
                        </div>
                      </div>
                      <StatusPill status={s.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-border/60 bg-background/40 px-2.5 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Latency</p>
                        <p className={cn("font-mono text-sm tabular-nums mt-0.5", s.status === "down" ? "text-danger" : s.latencyMs > 100 ? "text-warning" : "text-foreground")}>
                          {s.status === "down" ? "—" : `${s.latencyMs}ms`}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/40 px-2.5 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">RPS</p>
                        <p className="font-mono text-sm tabular-nums mt-0.5 text-foreground">{s.rps.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-background/40 px-2.5 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Uptime</p>
                        <p className="font-mono text-sm tabular-nums mt-0.5 text-foreground">{s.uptime}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono">{s.version}</span>
                      <span>{s.region}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SignalR panel */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="card-surface p-5 xl:col-span-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
                    <Radio className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">SignalR Hub</p>
                    <p className="text-[11px] text-muted-foreground">wss://realtime.myfinalgo.io/hub · transport: WebSockets</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 ring-1 ring-success/30 px-2.5 py-1 text-[11px] font-medium text-success">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
                  Connected
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" /> Latency</p>
                  <p className={cn("font-display text-2xl font-semibold tabular-nums mt-1", latency > 40 ? "text-warning" : "text-success")}>{latency}<span className="text-xs text-muted-foreground ml-1">ms</span></p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Connections</p>
                  <p className="font-display text-2xl font-semibold tabular-nums mt-1 text-foreground">{connections.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Msg / sec</p>
                  <p className="font-display text-2xl font-semibold tabular-nums mt-1 text-primary">{msgRate}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Uptime</p>
                  <p className="font-display text-2xl font-semibold tabular-nums mt-1 text-foreground">14d 06h</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Latency · last 60s</p>
                  <p className="text-[11px] font-mono text-muted-foreground">min {Math.round(min)}ms · max {Math.round(max)}ms</p>
                </div>
                <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full h-16" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${path} L${sparkW},${sparkH} L0,${sparkH} Z`} fill="url(#sparkFill)" />
                  <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="card-surface p-5">
              <p className="text-sm font-semibold">Hub channels</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active subscriptions</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  { name: "transactions.live", subs: 842, status: "healthy" as Status },
                  { name: "alerts.fraud", subs: 318, status: "healthy" as Status },
                  { name: "metrics.engine", subs: 96, status: "degraded" as Status },
                  { name: "notifications.push", subs: 28, status: "healthy" as Status },
                ].map((ch) => {
                  const m = statusMeta[ch.status];
                  return (
                    <li key={ch.name} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={cn("h-2 w-2 rounded-full shrink-0", m.dot)} />
                        <span className="font-mono text-xs text-foreground truncate">{ch.name}</span>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-muted-foreground">{ch.subs}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Live log terminal */}
          <section className="card-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-background/40">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                </div>
                <TerminalSquare className="h-4 w-4 text-muted-foreground ml-2" />
                <p className="text-xs font-mono text-muted-foreground">~/myfinalgo/logs/system.stream</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground tabular-nums">{logs.length} lines</span>
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
                >
                  {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
                >
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              </div>
            </div>
            <div className="h-72 overflow-y-auto bg-background/60 px-4 py-3 font-mono text-[12px] leading-relaxed">
              {logs.length === 0 && (
                <p className="text-muted-foreground">Waiting for events…</p>
              )}
              {logs.map((l) => {
                const lm = levelMeta[l.level];
                return (
                  <div key={l.id} className="flex gap-3 hover:bg-foreground/5 px-1 -mx-1 rounded">
                    <span className="text-muted-foreground/70 shrink-0">{l.ts}</span>
                    <span className={cn("shrink-0 font-semibold", lm.text)}>{lm.tag}</span>
                    <span className="text-muted-foreground shrink-0">[{l.source}]</span>
                    <span className="text-foreground/90 truncate">{l.message}</span>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SystemHealth;
