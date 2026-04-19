import { Activity, DollarSign, ShieldAlert, Cpu, Maximize2, MoreHorizontal } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { MetricCard } from "@/components/finalgo/MetricCard";
import { Sparkline } from "@/components/finalgo/Sparkline";
import { LiveFlowChart } from "@/components/finalgo/LiveFlowChart";
import { HealthRing } from "@/components/finalgo/HealthRing";
import { TransactionFeed } from "@/components/finalgo/TransactionFeed";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <Header />

        <main className="flex-1 px-6 lg:px-8 py-6 space-y-6">
          {/* Title row */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Realtime Operations</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Streaming transactions across <span className="text-foreground font-medium">14 ingestion nodes</span> · last sync 2s ago
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">
                Last 1H
              </button>
              <button className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-foreground">24H</button>
              <button className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">
                7D
              </button>
              <button className="rounded-lg bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow-primary hover:opacity-90 transition">
                Export Report
              </button>
            </div>
          </div>

          {/* Row 1 — KPI metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <MetricCard label="Transactions / sec" value="2,471" delta="+12.4%" trend="up" icon={Activity} accent="success">
              <Sparkline data={[40, 52, 48, 60, 58, 70, 65, 78, 74, 82, 90, 86, 95, 92, 100]} />
            </MetricCard>
            <MetricCard label="Total Volume Processed" value="$184.2M" delta="+4.1%" trend="up" icon={DollarSign} accent="primary">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Daily target</span>
                  <span className="font-mono text-foreground">73%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[73%] bg-gradient-primary" />
                </div>
              </div>
            </MetricCard>
            <MetricCard label="Anomalies Detected" value="38" delta="+9 in 1h" trend="down" icon={ShieldAlert} accent="danger">
              <div className="flex items-center gap-1.5">
                {[3, 5, 4, 8, 6, 9, 7, 11, 8, 12].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-danger/70"
                    style={{ height: `${v * 2.5}px`, opacity: 0.4 + i * 0.06 }}
                  />
                ))}
              </div>
            </MetricCard>
            <MetricCard label="AI Engine Status" value="Active" icon={Cpu} accent="success">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
                  <span className="text-muted-foreground">Inference</span>
                </div>
                <span className="font-mono text-success">12ms</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Model</span>
                <span className="font-mono text-foreground">xgb-v4.2 / lstm-v2.1</span>
              </div>
            </MetricCard>
          </section>

          {/* Row 2 — Flow + Health */}
          <section className="grid grid-cols-1 lg:grid-cols-10 gap-5">
            <div className="card-surface p-6 lg:col-span-7 grid-bg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold">Live Transaction Flow</h2>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success ring-1 ring-success/25">
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Volume per second · streaming via SignalR hub</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-success" /> Inflow
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" /> Settled
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-danger" /> Flagged
                    </span>
                  </div>
                  <button className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <LiveFlowChart />
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>−60s</span>
                <span>−45s</span>
                <span>−30s</span>
                <span>−15s</span>
                <span className="text-success">now</span>
              </div>
            </div>

            <div className="card-surface p-6 lg:col-span-3">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Microservices Health</h2>
                  <p className="text-xs text-muted-foreground mt-1">Load · last 30s window</p>
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground transition">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                <HealthRing label="Data Ingestion" value={92} sub="Kafka · 3 brokers · 0 lag" color="success" />
                <HealthRing label="C# Processing" value={68} sub=".NET 8 · 6 nodes · 124 rps" color="primary" />
                <HealthRing label="Python ML Engine" value={84} sub="Ray cluster · GPU 71% util" color="warning" />
              </div>
            </div>
          </section>

          {/* Row 3 — Feed */}
          <section className="card-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold">Live Transaction Feed</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger ring-1 ring-danger/25">
                    3 anomalies
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Streaming the last 10 transactions evaluated by the ML pipeline</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground">All</button>
                <button className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">Approved</button>
                <button className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">Pending</button>
                <button className="rounded-md border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs text-danger">Anomalies</button>
              </div>
            </div>
            <TransactionFeed />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
