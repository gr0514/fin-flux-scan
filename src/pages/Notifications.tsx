import { useMemo, useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Info, Search, BellOff } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warning" | "info" | "success";

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const seed: Alert[] = [
  { id: "1", severity: "critical", title: "Anomaly detected · TX-9F2A-7C42", message: "Velocity + geo mismatch (Caracas, VE) — $84,920.00", time: "2m ago", read: false },
  { id: "2", severity: "warning", title: "Model drift on ensemble v4.2", message: "Precision dropped to 0.91 over the last 6h.", time: "18m ago", read: false },
  { id: "3", severity: "critical", title: "Structuring pattern · TX-9F2A-7C45", message: "ML score 0.94 — Lagos, NG.", time: "42m ago", read: true },
  { id: "4", severity: "info", title: "New ingestion node online", message: "node-eu-fra-03 is now streaming.", time: "1h ago", read: true },
  { id: "5", severity: "success", title: "Weekly digest ready", message: "Last week: 1.2M txs, 0.31% flagged, 99.97% uptime.", time: "Yesterday", read: true },
  { id: "6", severity: "warning", title: "Latency spike", message: "Inference p95 reached 28ms briefly.", time: "Yesterday", read: true },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

const sevStyle = (s: Severity) => {
  switch (s) {
    case "critical":
      return { Icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", ring: "ring-danger/30" };
    case "warning":
      return { Icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", ring: "ring-warning/30" };
    case "success":
      return { Icon: CheckCircle2, color: "text-success", bg: "bg-success/10", ring: "ring-success/30" };
    default:
      return { Icon: Info, color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30" };
  }
};

const Notifications = () => {
  const [items, setItems] = useState<Alert[]>(seed);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((a) => {
      if (filter === "unread" && a.read) return false;
      if (filter !== "all" && filter !== "unread" && a.severity !== filter) return false;
      if (query && !`${a.title} ${a.message}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [items, filter, query]);

  const unreadCount = items.filter((i) => !i.read).length;

  const markAllRead = () => setItems((p) => p.map((i) => ({ ...i, read: true })));
  const toggleRead = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, read: !i.read } : i)));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 px-6 lg:px-8 py-6 space-y-5 max-w-5xl w-full mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}` : "You're all caught up."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
          </div>

          <div className="card-surface p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search alerts…"
                  className="pl-9 bg-background/40"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap",
                      filter === f.key
                        ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card-surface p-12 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-muted mb-4">
                <BellOff className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try clearing filters or search.
              </p>
            </div>
          ) : (
            <div className="card-surface divide-y divide-border/60 overflow-hidden">
              {filtered.map((a) => {
                const { Icon, color, bg, ring } = sevStyle(a.severity);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleRead(a.id)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 p-4 hover:bg-muted/40 transition",
                      !a.read && "bg-primary/[0.04]"
                    )}
                  >
                    <div className={cn("grid place-items-center h-9 w-9 rounded-lg ring-1", bg, ring)}>
                      <Icon className={cn("h-4 w-4", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm truncate", !a.read ? "font-semibold" : "font-medium text-foreground/90")}>
                          {a.title}
                        </p>
                        {!a.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.message}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">{a.time}</span>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications;