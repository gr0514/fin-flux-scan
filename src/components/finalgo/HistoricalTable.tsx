import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, ArrowUpDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "approved" | "pending" | "anomaly" | "blocked";

interface Row {
  id: string;
  date: string;
  amount: number;
  currency: string;
  risk: number;
  category: string;
  status: Status;
}

const seed = (i: number) => {
  const statuses: Status[] = ["approved", "approved", "approved", "pending", "anomaly", "blocked", "approved"];
  const cats = ["Card Payment", "Wire Transfer", "Crypto", "ACH", "P2P", "FX"];
  const status = statuses[i % statuses.length];
  const risk = status === "blocked" ? 0.96 : status === "anomaly" ? 0.78 + (i % 9) / 100 : status === "pending" ? 0.42 : Math.random() * 0.3;
  return {
    id: `TX-${(2026000 + i).toString(16).toUpperCase()}-${(i * 17 % 9999).toString().padStart(4, "0")}`,
    date: `Apr ${(19 - (i % 18)).toString().padStart(2, "0")}, ${String(8 + (i % 16)).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
    amount: Math.round((50 + Math.random() * 25000) * 100) / 100,
    currency: ["USD", "EUR", "GBP", "USD", "USD"][i % 5],
    risk,
    category: cats[i % cats.length],
    status,
  };
};

const ALL: Row[] = Array.from({ length: 84 }, (_, i) => seed(i));

function StatusPill({ status }: { status: Status }) {
  const map = {
    approved: { cls: "bg-success/15 text-success ring-success/30", icon: CheckCircle2, label: "Approved" },
    pending: { cls: "bg-warning/15 text-warning ring-warning/30", icon: Clock, label: "Pending" },
    anomaly: { cls: "bg-danger/15 text-danger ring-danger/30", icon: AlertTriangle, label: "Anomaly" },
    blocked: { cls: "bg-danger/25 text-danger ring-danger/40", icon: AlertTriangle, label: "Blocked" },
  }[status];
  const Icon = map.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ring-1", map.cls)}>
      <Icon className="h-3 w-3" /> {map.label}
    </span>
  );
}

function RiskBar({ value }: { value: number }) {
  const color = value > 0.75 ? "hsl(var(--danger))" : value > 0.45 ? "hsl(var(--warning))" : "hsl(var(--success))";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="relative h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${value * 100}%`, background: color }} />
      </div>
      <span className="font-mono text-[10px] tabular-nums" style={{ color }}>
        {(value * 100).toFixed(0)}
      </span>
    </div>
  );
}

const PAGE_SIZE = 8;

export function HistoricalTable() {
  const [page, setPage] = useState(0);
  const [filterId, setFilterId] = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return ALL.filter((r) => {
      if (filterId && !r.id.toLowerCase().includes(filterId.toLowerCase())) return false;
      if (filterRisk) {
        const min = parseFloat(filterRisk);
        if (!isNaN(min) && r.risk * 100 < min) return false;
      }
      if (filterAmount) {
        const min = parseFloat(filterAmount);
        if (!isNaN(min) && r.amount < min) return false;
      }
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      return true;
    });
  }, [filterId, filterRisk, filterAmount, filterStatus]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const view = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const InputCell = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
    <input
      value={value}
      onChange={(e) => { onChange(e.target.value); setPage(0); }}
      placeholder={placeholder}
      className="h-7 w-full rounded border border-border bg-background/60 px-2 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono"
    />
  );

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">
                <div className="flex items-center gap-1">TX ID <ArrowUpDown className="h-3 w-3 opacity-50" /></div>
              </th>
              <th className="px-4 py-2.5 text-left font-medium">Date</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              <th className="px-4 py-2.5 text-left font-medium">Risk Score</th>
              <th className="px-4 py-2.5 text-left font-medium">Category</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
            </tr>
            {/* Filter row */}
            <tr className="border-t border-border/40 bg-background/30">
              <th className="px-4 py-2"><InputCell value={filterId} onChange={setFilterId} placeholder="Filter ID…" /></th>
              <th className="px-4 py-2 text-[10px] text-muted-foreground/60 font-mono">—</th>
              <th className="px-4 py-2"><InputCell value={filterAmount} onChange={setFilterAmount} placeholder="Min amount" /></th>
              <th className="px-4 py-2"><InputCell value={filterRisk} onChange={setFilterRisk} placeholder="Min risk %" /></th>
              <th className="px-4 py-2 text-[10px] text-muted-foreground/60 font-mono">All</th>
              <th className="px-4 py-2">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
                  className="h-7 w-full rounded border border-border bg-background/60 px-2 text-[11px] text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="all">All statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="anomaly">Anomaly</option>
                  <option value="blocked">Blocked</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => {
              const flagged = r.status === "anomaly" || r.status === "blocked";
              return (
                <tr
                  key={r.id}
                  className={cn(
                    "border-t border-border/40 transition-colors",
                    flagged ? "bg-danger/5 hover:bg-danger/10" : "hover:bg-primary/5"
                  )}
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <span className={flagged ? "text-danger font-semibold" : "text-foreground/90"}>{r.id}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{r.date}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    <span className={cn("font-semibold", flagged ? "text-danger" : "text-foreground")}>
                      {r.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="ml-1 text-[10px] text-muted-foreground">{r.currency}</span>
                  </td>
                  <td className="px-4 py-3"><RiskBar value={r.risk} /></td>
                  <td className="px-4 py-3 text-xs text-foreground/80">{r.category}</td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                </tr>
              );
            })}
            {view.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-xs text-muted-foreground">No matching transactions</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-[11px] text-muted-foreground font-mono">
          Showing <span className="text-foreground">{view.length === 0 ? 0 : safePage * PAGE_SIZE + 1}–{safePage * PAGE_SIZE + view.length}</span> of <span className="text-foreground">{filtered.length}</span>
          <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground/70"><Filter className="h-3 w-3" /> filtered from {ALL.length}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          {Array.from({ length: pages }).slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                "h-8 min-w-8 px-2.5 rounded-md text-xs font-mono transition",
                i === safePage
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  : "border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
              )}
            >
              {i + 1}
            </button>
          ))}
          {pages > 5 && <span className="px-1 text-xs text-muted-foreground">…</span>}
          <button
            disabled={safePage >= pages - 1}
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
