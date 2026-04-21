import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, MapPin, CreditCard, Cpu, ShieldAlert, Copy, ExternalLink } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const tx = {
  id: "TX-9F2A-7C42",
  amount: 84920.0,
  currency: "USD",
  status: "anomaly" as const,
  account: "•••• 7710",
  merchant: "Acme Crypto OTC",
  location: "Caracas, VE",
  device: "iPhone 15 · iOS 17.5",
  ip: "190.142.12.34",
  riskScore: 0.94,
  reason: "Velocity + geo mismatch",
  createdAt: "2026-04-21 01:04:18 UTC",
};

const timeline = [
  { t: "01:04:18.002", title: "Transaction received", desc: "Ingested at node-us-east-02", icon: CreditCard, status: "done" },
  { t: "01:04:18.014", title: "Enrichment complete", desc: "Geo, device, merchant resolved", icon: MapPin, status: "done" },
  { t: "01:04:18.026", title: "ML inference", desc: "ensemble v4.2 → score 0.94", icon: Cpu, status: "done" },
  { t: "01:04:18.031", title: "Risk decision: BLOCK", desc: "Above 0.85 threshold — flagged anomalous", icon: ShieldAlert, status: "alert" },
  { t: "—", title: "Awaiting analyst review", desc: "Queued in case management", icon: Clock, status: "pending" },
];

const rawJson = JSON.stringify(
  {
    id: tx.id,
    timestamp: tx.createdAt,
    amount: { value: tx.amount, currency: tx.currency },
    account: { masked: tx.account, holder_id: "user_8821" },
    merchant: { name: tx.merchant, mcc: "6051" },
    geo: { city: "Caracas", country: "VE", lat: 10.4806, lon: -66.9036 },
    device: { user_agent: tx.device, ip: tx.ip, fingerprint: "fp_9f2a7c42aabb" },
    risk: {
      score: tx.riskScore,
      model: "ensemble_v4.2",
      reasons: ["velocity_24h_high", "geo_mismatch_home_country", "amount_p99_outlier"],
    },
    decision: "BLOCK",
  },
  null,
  2
);

const TransactionDetail = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(rawJson);
    setCopied(true);
    toast({ title: "Copied", description: "Raw JSON copied to clipboard." });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 px-6 lg:px-8 py-6 space-y-5 max-w-6xl w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>

          {/* Hero */}
          <div className="card-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-danger/15 px-2 py-1 text-[11px] font-semibold text-danger ring-1 ring-danger/30">
                    <AlertTriangle className="h-3 w-3" /> Anomalous
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {tx.reason}
                  </span>
                </div>
                <h1 className="font-display text-2xl font-semibold tracking-tight font-mono">
                  {id ?? tx.id}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">{tx.createdAt}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl font-semibold tabular-nums text-danger">
                  ${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
                  {tx.currency}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/60">
              {[
                { label: "Account", value: tx.account, icon: CreditCard },
                { label: "Merchant", value: tx.merchant, icon: ExternalLink },
                { label: "Location", value: tx.location, icon: MapPin },
                { label: "Risk score", value: tx.riskScore.toFixed(2), icon: ShieldAlert, highlight: true },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <f.icon className="h-3 w-3" />
                    {f.label}
                  </p>
                  <p className={cn("text-sm font-medium mt-1", f.highlight && "text-danger font-mono")}>
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Timeline */}
            <div className="card-surface p-6">
              <h2 className="font-display text-base font-semibold tracking-tight mb-5">
                Status timeline
              </h2>
              <ol className="relative space-y-5">
                {timeline.map((step, i) => {
                  const isAlert = step.status === "alert";
                  const isPending = step.status === "pending";
                  return (
                    <li key={i} className="relative pl-10">
                      {i < timeline.length - 1 && (
                        <span
                          className={cn(
                            "absolute left-[15px] top-7 bottom-[-22px] w-px",
                            isAlert ? "bg-danger/30" : "bg-border"
                          )}
                        />
                      )}
                      <div
                        className={cn(
                          "absolute left-0 top-0 grid place-items-center h-8 w-8 rounded-full ring-2",
                          isAlert
                            ? "bg-danger/15 text-danger ring-danger/30"
                            : isPending
                            ? "bg-muted text-muted-foreground ring-border"
                            : "bg-success/15 text-success ring-success/30"
                        )}
                      >
                        {isAlert ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : isPending ? (
                          <step.icon className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                          {step.t}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Raw JSON */}
            <div className="card-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-semibold tracking-tight">Raw payload</h2>
                <Button variant="outline" size="sm" onClick={onCopy} className="gap-1.5 h-8">
                  <Copy className="h-3 w-3" />
                  {copied ? "Copied" : "Copy JSON"}
                </Button>
              </div>
              <pre className="rounded-lg bg-background/60 border border-border p-4 text-[11px] font-mono leading-relaxed text-foreground/85 overflow-auto max-h-[420px]">
                {rawJson}
              </pre>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Mark reviewed</Button>
            <Button className="text-primary-foreground" style={{ background: "var(--gradient-danger)" }}>
              Block account
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionDetail;