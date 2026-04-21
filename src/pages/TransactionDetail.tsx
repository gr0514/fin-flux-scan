import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, AlertTriangle, CheckCircle2, Clock, MapPin, CreditCard, Cpu,
  ShieldAlert, Copy, ExternalLink, Check, Flag, Activity, Globe, TrendingUp,
  Smartphone, ChevronRight,
} from "lucide-react";
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
  accountId: "acc_8821",
  account: "•••• 7710",
  merchantId: "mer_acme_otc",
  merchant: "Acme Crypto OTC",
  location: "Caracas, VE",
  lat: 10.4806,
  lon: -66.9036,
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
    account: { id: tx.accountId, masked: tx.account, holder_id: "user_8821" },
    merchant: { id: tx.merchantId, name: tx.merchant, mcc: "6051" },
    geo: { city: "Caracas", country: "VE", lat: tx.lat, lon: tx.lon },
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

const riskFactors = [
  {
    icon: Globe,
    title: "Unusual geographic location",
    desc: "Account historically transacts in DE/AT — first activity from VE.",
    weight: 0.34,
  },
  {
    icon: TrendingUp,
    title: "High velocity in last 24h",
    desc: "12 transactions in 6h vs. baseline of 2/day.",
    weight: 0.28,
  },
  {
    icon: Activity,
    title: "Amount above 99th percentile",
    desc: "$84,920 vs. account median of $312.",
    weight: 0.22,
  },
  {
    icon: Smartphone,
    title: "New device fingerprint",
    desc: "First seen 14 minutes before this transaction.",
    weight: 0.10,
  },
];

const TransactionDetail = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [decision, setDecision] = useState<"none" | "approved" | "flagged">("none");

  const onCopy = async () => {
    await navigator.clipboard.writeText(rawJson);
    setCopied(true);
    toast({ title: "Copied", description: "Raw JSON copied to clipboard." });
    setTimeout(() => setCopied(false), 1500);
  };

  const onApprove = () => {
    setDecision("approved");
    toast({ title: "Transaction approved", description: `${id ?? tx.id} marked as legitimate.` });
  };
  const onFlag = () => {
    setDecision("flagged");
    toast({
      title: "Flagged as fraud",
      description: `${id ?? tx.id} sent to the fraud queue.`,
      variant: "destructive",
    });
  };

  // Static OSM embed centered on the geo coords with a marker
  const bbox = `${tx.lon - 0.05},${tx.lat - 0.04},${tx.lon + 0.05},${tx.lat + 0.04}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${tx.lat},${tx.lon}`;

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
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {decision === "approved" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-success/15 px-2 py-1 text-[11px] font-semibold text-success ring-1 ring-success/30">
                      <CheckCircle2 className="h-3 w-3" /> Approved
                    </span>
                  ) : decision === "flagged" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-danger/15 px-2 py-1 text-[11px] font-semibold text-danger ring-1 ring-danger/30">
                      <Flag className="h-3 w-3" /> Flagged as fraud
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-danger/15 px-2 py-1 text-[11px] font-semibold text-danger ring-1 ring-danger/30">
                      <AlertTriangle className="h-3 w-3" /> Anomalous
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {tx.reason}
                  </span>
                </div>
                <h1 className="font-display text-2xl font-semibold tracking-tight font-mono break-all">
                  {id ?? tx.id}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">{tx.createdAt}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="font-mono text-3xl font-semibold tabular-nums text-danger">
                    ${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
                    {tx.currency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={onApprove}
                    disabled={decision === "approved"}
                    className="gap-1.5 text-success-foreground hover:opacity-90 shadow-glow-success"
                    style={{ background: "var(--gradient-success)" }}
                  >
                    <Check className="h-4 w-4" />
                    Approve transaction
                  </Button>
                  <Button
                    onClick={onFlag}
                    disabled={decision === "flagged"}
                    className="gap-1.5 text-danger-foreground hover:opacity-90 shadow-glow-danger"
                    style={{ background: "var(--gradient-danger)" }}
                  >
                    <Flag className="h-4 w-4" />
                    Flag as fraud
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/60">
              <Link
                to={`/accounts/${tx.accountId}`}
                className="group block rounded-lg -m-1 p-1 hover:bg-primary/5 transition"
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" />
                  Account
                </p>
                <p className="text-sm font-medium mt-1 inline-flex items-center gap-1 text-foreground group-hover:text-primary transition">
                  {tx.account}
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </p>
              </Link>

              <Link
                to={`/merchants/${tx.merchantId}`}
                className="group block rounded-lg -m-1 p-1 hover:bg-primary/5 transition"
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <ExternalLink className="h-3 w-3" />
                  Merchant
                </p>
                <p className="text-sm font-medium mt-1 inline-flex items-center gap-1 text-foreground group-hover:text-primary transition">
                  {tx.merchant}
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </p>
              </Link>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  Location
                </p>
                <p className="text-sm font-medium mt-1">{tx.location}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3 w-3" />
                  Risk score
                </p>
                <p className="text-sm font-medium mt-1 text-danger font-mono">
                  {tx.riskScore.toFixed(2)}
                </p>
              </div>
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