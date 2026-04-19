import { AlertTriangle, CheckCircle2, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "approved" | "pending" | "anomaly";

interface Tx {
  id: string;
  amount: string;
  currency: string;
  location: string;
  account: string;
  time: string;
  status: Status;
  reason?: string;
}

const rows: Tx[] = [
  { id: "TX-9F2A-7C41", amount: "1,284.50", currency: "EUR", location: "Berlin, DE", account: "•••• 4821", time: "2s ago", status: "approved" },
  { id: "TX-9F2A-7C42", amount: "84,920.00", currency: "USD", location: "Caracas, VE", account: "•••• 7710", time: "4s ago", status: "anomaly", reason: "Velocity + geo mismatch" },
  { id: "TX-9F2A-7C43", amount: "59.99", currency: "USD", location: "Austin, TX", account: "•••• 1182", time: "6s ago", status: "approved" },
  { id: "TX-9F2A-7C44", amount: "742.10", currency: "GBP", location: "London, UK", account: "•••• 9930", time: "8s ago", status: "approved" },
  { id: "TX-9F2A-7C45", amount: "12,400.00", currency: "USD", location: "Lagos, NG", account: "•••• 2204", time: "11s ago", status: "anomaly", reason: "ML score 0.94 — structuring" },
  { id: "TX-9F2A-7C46", amount: "318.40", currency: "EUR", location: "Paris, FR", account: "•••• 5544", time: "13s ago", status: "pending" },
  { id: "TX-9F2A-7C47", amount: "27.00", currency: "USD", location: "Toronto, CA", account: "•••• 6678", time: "15s ago", status: "approved" },
  { id: "TX-9F2A-7C48", amount: "9,950.00", currency: "USD", location: "Bucharest, RO", account: "•••• 3321", time: "18s ago", status: "anomaly", reason: "Just-below threshold pattern" },
  { id: "TX-9F2A-7C49", amount: "452.75", currency: "EUR", location: "Madrid, ES", account: "•••• 1009", time: "21s ago", status: "approved" },
  { id: "TX-9F2A-7C50", amount: "1,120.00", currency: "USD", location: "Singapore, SG", account: "•••• 4477", time: "24s ago", status: "approved" },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === "anomaly")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-danger/15 px-2 py-1 text-[11px] font-semibold text-danger ring-1 ring-danger/30">
        <AlertTriangle className="h-3 w-3" /> Anomalous
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-warning/15 px-2 py-1 text-[11px] font-semibold text-warning ring-1 ring-warning/30">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-success/15 px-2 py-1 text-[11px] font-semibold text-success ring-1 ring-success/30">
      <CheckCircle2 className="h-3 w-3" /> Approved
    </span>
  );
}

export function TransactionFeed() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-background/60 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <th className="px-5 py-3 text-left font-medium">TX ID</th>
            <th className="px-5 py-3 text-right font-medium">Amount</th>
            <th className="px-5 py-3 text-left font-medium">Account</th>
            <th className="px-5 py-3 text-left font-medium">Location</th>
            <th className="px-5 py-3 text-left font-medium">Time</th>
            <th className="px-5 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const anomaly = r.status === "anomaly";
            return (
              <tr
                key={r.id}
                className={cn(
                  "group border-t border-border/40 transition-colors",
                  anomaly
                    ? "bg-danger/10 hover:bg-danger/15 row-flash"
                    : "hover:bg-primary/5"
                )}
              >
                <td className="px-5 py-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {anomaly && <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" />}
                    <span className={anomaly ? "text-danger font-semibold" : "text-foreground/90"}>{r.id}</span>
                  </div>
                  {anomaly && r.reason && (
                    <p className="ml-5 mt-0.5 text-[10px] font-sans text-danger/80">{r.reason}</p>
                  )}
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">
                  <span className={cn("font-semibold", anomaly ? "text-danger" : "text-foreground")}>{r.amount}</span>
                  <span className="ml-1 text-[10px] text-muted-foreground">{r.currency}</span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.account}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {r.location}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{r.time}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
