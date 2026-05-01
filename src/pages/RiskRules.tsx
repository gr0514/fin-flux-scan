import { useMemo, useState } from "react";
import { ShieldAlert, Plus, Search, Lock, Cpu, Trash2, PencilLine, CheckCircle2, AlertTriangle, ShieldCheck, Activity, Filter, GaugeCircle, FileLock2 } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Severity = "low" | "medium" | "high" | "critical";
type Field = "amount" | "frequency" | "geo_distance_km" | "device_score" | "merchant_risk" | "velocity_24h";
type Operator = ">" | ">=" | "<" | "<=" | "==" | "!=";
type Action = "flag" | "block" | "review" | "notify";

interface Rule {
  id: string;
  name: string;
  field: Field;
  operator: Operator;
  threshold: string;
  unit: string;
  action: Action;
  severity: Severity;
  enabled: boolean;
  hits24h: number;
  updatedAt: string;
  author: string;
}

const fieldMeta: Record<Field, { label: string; unit: string }> = {
  amount: { label: "Transaction Amount", unit: "USD" },
  frequency: { label: "Frequency", unit: "tx/min" },
  geo_distance_km: { label: "Geo Distance", unit: "km" },
  device_score: { label: "Device Trust Score", unit: "0–100" },
  merchant_risk: { label: "Merchant Risk Index", unit: "0–10" },
  velocity_24h: { label: "Velocity (24h)", unit: "tx" },
};

const severityMeta: Record<Severity, { label: string; cls: string; dot: string }> = {
  low: { label: "Low", cls: "bg-muted text-muted-foreground border border-border", dot: "bg-muted-foreground" },
  medium: { label: "Medium", cls: "bg-warning/10 text-warning border border-warning/30", dot: "bg-warning" },
  high: { label: "High", cls: "bg-danger/10 text-danger border border-danger/30", dot: "bg-danger" },
  critical: { label: "Critical", cls: "bg-danger text-danger-foreground border border-danger shadow-glow-danger", dot: "bg-danger-foreground" },
};

const actionMeta: Record<Action, { label: string; cls: string }> = {
  flag: { label: "Flag", cls: "bg-warning/10 text-warning border-warning/30" },
  block: { label: "Block", cls: "bg-danger/10 text-danger border-danger/30" },
  review: { label: "Manual Review", cls: "bg-primary/10 text-primary border-primary/30" },
  notify: { label: "Notify", cls: "bg-muted text-foreground border-border" },
};

const seed: Rule[] = [
  { id: "RR-001", name: "Large Single Transfer", field: "amount", operator: ">", threshold: "5000", unit: "USD", action: "review", severity: "high", enabled: true, hits24h: 47, updatedAt: "2026-04-29 14:22", author: "ana.kovacs" },
  { id: "RR-002", name: "Burst Frequency", field: "frequency", operator: ">", threshold: "5", unit: "tx/min", action: "flag", severity: "medium", enabled: true, hits24h: 213, updatedAt: "2026-04-30 09:11", author: "ana.kovacs" },
  { id: "RR-003", name: "Impossible Travel", field: "geo_distance_km", operator: ">", threshold: "1500", unit: "km", action: "block", severity: "critical", enabled: true, hits24h: 9, updatedAt: "2026-04-28 18:40", author: "luis.torres" },
  { id: "RR-004", name: "Untrusted Device", field: "device_score", operator: "<", threshold: "30", unit: "0–100", action: "review", severity: "high", enabled: true, hits24h: 88, updatedAt: "2026-04-30 12:02", author: "system" },
  { id: "RR-005", name: "High-Risk Merchant", field: "merchant_risk", operator: ">=", threshold: "8", unit: "0–10", action: "flag", severity: "medium", enabled: false, hits24h: 0, updatedAt: "2026-04-25 10:50", author: "luis.torres" },
  { id: "RR-006", name: "Daily Velocity Cap", field: "velocity_24h", operator: ">", threshold: "120", unit: "tx", action: "notify", severity: "low", enabled: true, hits24h: 14, updatedAt: "2026-04-27 22:14", author: "ana.kovacs" },
];

export default function RiskRules() {
  const [rules, setRules] = useState<Rule[]>(seed);
  const [query, setQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editing, setEditing] = useState<Rule | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const stats = useMemo(() => ({
    total: rules.length,
    active: rules.filter(r => r.enabled).length,
    critical: rules.filter(r => r.severity === "critical" && r.enabled).length,
    hits: rules.reduce((s, r) => s + r.hits24h, 0),
  }), [rules]);

  const filtered = useMemo(() => rules.filter(r => {
    if (filterSeverity !== "all" && r.severity !== filterSeverity) return false;
    if (filterStatus === "on" && !r.enabled) return false;
    if (filterStatus === "off" && r.enabled) return false;
    if (query) {
      const q = query.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || fieldMeta[r.field].label.toLowerCase().includes(q);
    }
    return true;
  }), [rules, query, filterSeverity, filterStatus]);

  const toggle = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const r = rules.find(x => x.id === id);
    if (r) toast.success(`${r.name} ${r.enabled ? "disabled" : "enabled"}`, { description: "AI engine reweighting in progress…" });
  };

  const remove = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast("Rule removed", { description: `${id} deleted from policy set` });
  };

  const upsert = (r: Rule) => {
    setRules(prev => {
      const exists = prev.find(x => x.id === r.id);
      return exists ? prev.map(x => x.id === r.id ? r : x) : [r, ...prev];
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Hero */}
          <section className="card-surface p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-[0.25] pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary uppercase tracking-[0.18em]">
                  <Lock className="h-3 w-3" /> Admin · Policy Engine
                </div>
                <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                  Risk Rule Configuration
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These rules are the <span className="text-foreground font-medium">primary input signal</span> for the MyFinAlgo
                  AI fraud detection engine. Toggling, editing, or adding a rule retrains feature weights within seconds and is
                  cryptographically logged to the immutable audit sink.
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  All changes require admin role · signed with device key · last sync 12s ago
                </div>
              </div>

              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-1.5" /> New Rule
                  </Button>
                </DialogTrigger>
                <RuleDialog
                  onClose={() => setCreateOpen(false)}
                  onSave={(r) => { upsert(r); setCreateOpen(false); toast.success("Rule created", { description: `${r.name} is now active in the policy set` }); }}
                />
              </Dialog>
            </div>

            {/* Stats */}
            <div className="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatTile icon={ShieldAlert} label="Total Rules" value={stats.total} accent="text-foreground" />
              <StatTile icon={CheckCircle2} label="Active" value={stats.active} accent="text-success" />
              <StatTile icon={AlertTriangle} label="Critical · Live" value={stats.critical} accent="text-danger" />
              <StatTile icon={Activity} label="Hits · last 24h" value={stats.hits.toLocaleString()} accent="text-primary" />
            </div>
          </section>

          {/* Engine link banner */}
          <section className="card-surface p-4 flex items-center gap-4">
            <div className="grid place-items-center h-11 w-11 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Connected to Fraud Detection Engine <span className="text-muted-foreground font-normal">· v4.0.0-rc.3</span></p>
              <p className="text-xs text-muted-foreground">Rules below feed the model as deterministic gates. Disabled rules are excluded from inference but retained for audit.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
              <span className="text-success font-medium">Sync healthy</span>
            </div>
          </section>

          {/* Filters */}
          <section className="card-surface p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, ID or field…"
                className="pl-9 bg-background/60"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-[150px] bg-background/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-background/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="on">Enabled</SelectItem>
                  <SelectItem value="off">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Table */}
          <section className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border/60">
                    <TableHead className="w-[60px]">Status</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Logic</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Hits 24h</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const sev = severityMeta[r.severity];
                    const act = actionMeta[r.action];
                    return (
                      <TableRow key={r.id} className={cn("border-b border-border/40 transition-colors", !r.enabled && "opacity-60")}>
                        <TableCell>
                          <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} aria-label={`Toggle ${r.name}`} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{r.name}</span>
                            <span className="font-mono text-[11px] text-muted-foreground">{r.id} · by {r.author}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="font-mono text-xs px-2 py-1 rounded-md bg-muted/60 border border-border text-foreground inline-flex items-center gap-1.5">
                            <span className="text-primary">{fieldMeta[r.field].label}</span>
                            <span className="text-muted-foreground">{r.operator}</span>
                            <span className="text-foreground font-semibold">{r.threshold}</span>
                            <span className="text-muted-foreground">{r.unit}</span>
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("font-medium", act.cls)}>{act.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", sev.cls)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
                            {sev.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          <span className={r.hits24h > 100 ? "text-warning" : "text-foreground"}>{r.hits24h}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{r.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Dialog open={editing?.id === r.id} onOpenChange={(o) => !o && setEditing(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(r)}>
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              {editing?.id === r.id && (
                                <RuleDialog
                                  initial={editing}
                                  onClose={() => setEditing(null)}
                                  onSave={(updated) => { upsert(updated); setEditing(null); toast.success("Rule updated"); }}
                                />
                              )}
                            </Dialog>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-danger" onClick={() => remove(r.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                        No rules match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/20 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <FileLock2 className="h-3.5 w-3.5" /> Showing {filtered.length} of {rules.length} rules · changes audit-logged
              </span>
              <span className="inline-flex items-center gap-2">
                <GaugeCircle className="h-3.5 w-3.5 text-success" /> Engine reweight ETA: &lt; 2s
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, accent }: { icon: typeof ShieldAlert; label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-4 flex items-center gap-3">
      <div className="grid place-items-center h-10 w-10 rounded-lg bg-muted/60 border border-border">
        <Icon className={cn("h-5 w-5", accent)} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className={cn("font-display text-xl font-semibold leading-tight", accent)}>{value}</p>
      </div>
    </div>
  );
}

function RuleDialog({ initial, onClose, onSave }: { initial?: Rule; onClose: () => void; onSave: (r: Rule) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [field, setField] = useState<Field>(initial?.field ?? "amount");
  const [operator, setOperator] = useState<Operator>(initial?.operator ?? ">");
  const [threshold, setThreshold] = useState(initial?.threshold ?? "");
  const [action, setAction] = useState<Action>(initial?.action ?? "flag");
  const [severity, setSeverity] = useState<Severity>(initial?.severity ?? "medium");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);

  const submit = () => {
    if (!name.trim() || !threshold.trim()) {
      toast.error("Name and threshold are required");
      return;
    }
    const rule: Rule = {
      id: initial?.id ?? `RR-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: name.trim(),
      field, operator, threshold: threshold.trim(),
      unit: fieldMeta[field].unit,
      action, severity, enabled,
      hits24h: initial?.hits24h ?? 0,
      updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      author: initial?.author ?? "you",
    };
    onSave(rule);
  };

  return (
    <DialogContent className="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          {initial ? "Edit Rule" : "Create New Rule"}
        </DialogTitle>
        <DialogDescription>
          Define a deterministic gate that feeds the AI fraud engine. All fields are required.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="rule-name">Rule name</Label>
          <Input id="rule-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Large Single Transfer" maxLength={80} />
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6 space-y-1.5">
            <Label>Field</Label>
            <Select value={field} onValueChange={(v) => setField(v as Field)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(fieldMeta).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Op</Label>
            <Select value={operator} onValueChange={(v) => setOperator(v as Operator)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {([">", ">=", "<", "<=", "==", "!="] as Operator[]).map(o => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4 space-y-1.5">
            <Label>Threshold ({fieldMeta[field].unit})</Label>
            <Input value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="0" inputMode="decimal" maxLength={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Action</Label>
            <Select value={action} onValueChange={(v) => setAction(v as Action)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flag">Flag</SelectItem>
                <SelectItem value="review">Manual Review</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="notify">Notify only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
          <div>
            <p className="text-sm font-medium text-foreground">Enable on save</p>
            <p className="text-xs text-muted-foreground">Rule will be pushed to the engine immediately.</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs font-mono text-foreground">
          <span className="text-muted-foreground">PREVIEW › </span>
          IF <span className="text-primary">{fieldMeta[field].label}</span> {operator} <span className="font-semibold">{threshold || "?"}</span> {fieldMeta[field].unit} → <span className="text-danger uppercase">{action}</span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} className="bg-gradient-primary text-primary-foreground shadow-glow-primary">
          {initial ? "Save changes" : "Create rule"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
