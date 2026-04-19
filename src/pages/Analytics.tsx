import { Database, ShieldAlert, Target, MapPin, MoreHorizontal, TrendingUp } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { AnalyticsHeader } from "@/components/finalgo/AnalyticsHeader";
import { MetricCard } from "@/components/finalgo/MetricCard";
import { AnomalyTrendsChart } from "@/components/finalgo/AnomalyTrendsChart";
import { RiskHeatmap } from "@/components/finalgo/RiskHeatmap";
import { ConfusionMatrix } from "@/components/finalgo/ConfusionMatrix";
import { HistoricalTable } from "@/components/finalgo/HistoricalTable";

const Analytics = () => {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar active="Analytics" />

      <div className="flex flex-1 flex-col min-w-0">
        <AnalyticsHeader />

        <main className="flex-1 px-6 lg:px-8 py-6 space-y-6">
          {/* Summary band */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Last 30 Days · Performance Overview</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Comparing <span className="text-foreground font-medium">Mar 20 – Apr 19</span> against the prior period · 4.2M transactions analyzed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">7D</button>
              <button className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary font-semibold">30D</button>
              <button className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">90D</button>
              <button className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition">YTD</button>
            </div>
          </div>

          {/* Row 1 — Analytical KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <MetricCard label="Total Processed (30D)" value="4.21M" delta="+8.2%" trend="up" icon={Database} accent="primary">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Notional volume</span>
                <span className="font-mono text-foreground">$5.42B</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Daily average</span>
                <span className="font-mono text-primary">140,287</span>
              </div>
            </MetricCard>

            <MetricCard label="Total Anomalies Found" value="18,604" delta="+312 this week" trend="down" icon={ShieldAlert} accent="danger">
              <div className="flex items-center gap-1.5">
                {[5, 7, 6, 9, 8, 11, 9, 13, 10, 15, 12, 18].map((v, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-danger/70" style={{ height: `${v * 1.6}px`, opacity: 0.4 + i * 0.05 }} />
                ))}
              </div>
            </MetricCard>

            <MetricCard label="AI Accuracy Rate" value="98.5" unit="%" delta="+0.4 pts" trend="up" icon={Target} accent="success">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>F1 score</span>
                  <span className="font-mono text-success">0.987</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[98.5%] bg-gradient-success" />
                </div>
              </div>
            </MetricCard>

            <MetricCard label="Top Anomaly Category" value="Geo" unit="mismatch" icon={MapPin} accent="warning">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Unusual Location</span>
                  <span className="font-mono text-warning">42%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Velocity spike</span>
                  <span className="font-mono text-foreground">28%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Structuring</span>
                  <span className="font-mono text-foreground">19%</span>
                </div>
              </div>
            </MetricCard>
          </section>

          {/* Row 2 — Trends + Heatmap */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card-surface p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold">Anomaly Trends Over Time</h2>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/25">
                      <TrendingUp className="h-3 w-3" />
                      30D
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Daily breakdown · stacked by classification</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-sm bg-primary" /> Legitimate
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-sm bg-danger" /> Anomalous
                  </span>
                </div>
              </div>
              <AnomalyTrendsChart />
            </div>

            <div className="card-surface p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg font-semibold">Risk Distribution Heatmap</h2>
                  <p className="text-xs text-muted-foreground mt-1">Geographic origin of flagged transactions</p>
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
              <RiskHeatmap />
            </div>
          </section>

          {/* Row 3 — ML Insights + Historical Data */}
          <section className="grid grid-cols-1 lg:grid-cols-10 gap-5">
            <div className="card-surface p-6 lg:col-span-4">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Python ML Model Performance</h2>
                  <p className="text-xs text-muted-foreground mt-1">Confusion matrix · tune the decision threshold</p>
                </div>
              </div>
              <ConfusionMatrix />
            </div>

            <div className="card-surface p-6 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Historical Transaction Data</h2>
                  <p className="text-xs text-muted-foreground mt-1">Filter, sort and audit transactions in the selected window</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-card/60 border border-border px-2.5 py-1 text-[10px] font-mono text-muted-foreground">
                    4,210,847 records
                  </span>
                </div>
              </div>
              <HistoricalTable />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
