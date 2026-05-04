import { useMemo, useState } from "react";
import {
  Users, Search, Filter, ShieldCheck, Lock, UserCog, Activity, AlertTriangle,
  CheckCircle2, Ban, Globe, MapPin, Monitor, Clock, KeyRound, Mail, Fingerprint, ShieldPlus,
} from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ROLES_SEED, ROLE_BADGE_CLS, type Role as PermRole } from "@/lib/permissions";

type Role = PermRole;
type RiskLevel = "low" | "medium" | "high" | "critical";
type Status = "active" | "suspended" | "locked" | "pending";

interface SecurityEvent {
  ts: string;
  ip: string;
  location: string;
  device: string;
  result: "success" | "failure" | "mfa";
}

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  roles?: Role[];
  risk: RiskLevel;
  status: Status;
  lastLogin: string;
  lastIp: string;
  mfa: boolean;
  events: SecurityEvent[];
}

const roleMeta: Record<Role, { label: string; cls: string }> = {
  admin:   { label: "Admin",    cls: "bg-primary/10 text-primary border-primary/30" },
  manager: { label: "Manager",  cls: "bg-success/10 text-success border-success/30" },
  analyst: { label: "Analyst",  cls: "bg-accent/40 text-foreground border-border" },
  auditor: { label: "Auditor",  cls: "bg-warning/10 text-warning border-warning/30" },
  user:    { label: "User",     cls: "bg-muted text-muted-foreground border-border" },
};

const riskMeta: Record<RiskLevel, { label: string; cls: string; dot: string }> = {
  low:      { label: "Low",      cls: "bg-success/10 text-success border-success/30", dot: "bg-success" },
  medium:   { label: "Medium",   cls: "bg-warning/10 text-warning border-warning/30", dot: "bg-warning" },
  high:     { label: "High",     cls: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
  critical: { label: "Critical", cls: "bg-danger text-danger-foreground border-danger shadow-glow-danger", dot: "bg-danger-foreground" },
};

const statusMeta: Record<Status, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  active:    { label: "Active",    cls: "bg-success/10 text-success border-success/30", icon: CheckCircle2 },
  suspended: { label: "Suspended", cls: "bg-warning/10 text-warning border-warning/30", icon: AlertTriangle },
  locked:    { label: "Locked",    cls: "bg-danger/10 text-danger border-danger/30", icon: Ban },
  pending:   { label: "Pending",   cls: "bg-muted text-muted-foreground border-border", icon: Clock },
};

const seed: User[] = [
  {
    id: "USR-1042", username: "ana.kovacs", email: "ana.kovacs@myfinalgo.io",
    role: "admin", risk: "low", status: "active",
    lastLogin: "2026-05-04 09:22", lastIp: "84.21.118.4", mfa: true,
    events: [
      { ts: "2026-05-04 09:22", ip: "84.21.118.4",   location: "Vienna, AT",   device: "MacBook Pro · Safari", result: "mfa" },
      { ts: "2026-05-03 18:11", ip: "84.21.118.4",   location: "Vienna, AT",   device: "iPhone 15 · Mobile",   result: "success" },
      { ts: "2026-05-02 07:45", ip: "84.21.118.4",   location: "Vienna, AT",   device: "MacBook Pro · Safari", result: "success" },
    ],
  },
  {
    id: "USR-1058", username: "luis.torres", email: "luis.torres@myfinalgo.io",
    role: "analyst", risk: "medium", status: "active",
    lastLogin: "2026-05-04 08:03", lastIp: "190.45.12.221", mfa: true,
    events: [
      { ts: "2026-05-04 08:03", ip: "190.45.12.221", location: "Madrid, ES",   device: "Windows · Chrome",     result: "success" },
      { ts: "2026-05-03 22:50", ip: "190.45.12.221", location: "Madrid, ES",   device: "Windows · Chrome",     result: "mfa" },
      { ts: "2026-05-03 22:48", ip: "190.45.12.221", location: "Madrid, ES",   device: "Windows · Chrome",     result: "failure" },
    ],
  },
  {
    id: "USR-1101", username: "mei.chen", email: "mei.chen@myfinalgo.io",
    role: "auditor", risk: "low", status: "active",
    lastLogin: "2026-05-04 07:10", lastIp: "203.115.88.9", mfa: true,
    events: [
      { ts: "2026-05-04 07:10", ip: "203.115.88.9",  location: "Singapore, SG", device: "Linux · Firefox",      result: "success" },
    ],
  },
  {
    id: "USR-1233", username: "jordan.h", email: "jordan.h@external.com",
    role: "user", risk: "high", status: "suspended",
    lastLogin: "2026-05-02 02:14", lastIp: "45.231.9.18", mfa: false,
    events: [
      { ts: "2026-05-02 02:14", ip: "45.231.9.18",   location: "Caracas, VE",   device: "Android · WebView",    result: "failure" },
      { ts: "2026-05-02 02:13", ip: "45.231.9.18",   location: "Caracas, VE",   device: "Android · WebView",    result: "failure" },
      { ts: "2026-05-02 02:12", ip: "45.231.9.18",   location: "Caracas, VE",   device: "Android · WebView",    result: "failure" },
    ],
  },
  {
    id: "USR-1402", username: "k.nakamura", email: "k.nakamura@myfinalgo.io",
    role: "analyst", risk: "low", status: "active",
    lastLogin: "2026-05-04 06:32", lastIp: "126.21.4.55", mfa: true,
    events: [
      { ts: "2026-05-04 06:32", ip: "126.21.4.55",   location: "Tokyo, JP",     device: "MacBook Air · Chrome", result: "success" },
    ],
  },
  {
    id: "USR-1577", username: "ghost.user", email: "ghost@unknown.io",
    role: "user", risk: "critical", status: "locked",
    lastLogin: "2026-04-30 23:59", lastIp: "tor-exit-93.onion", mfa: false,
    events: [
      { ts: "2026-04-30 23:59", ip: "tor-exit-93.onion", location: "Unknown",   device: "Tor Browser",          result: "failure" },
      { ts: "2026-04-30 23:58", ip: "tor-exit-93.onion", location: "Unknown",   device: "Tor Browser",          result: "failure" },
    ],
  },
  {
    id: "USR-1619", username: "sara.b", email: "sara.b@myfinalgo.io",
    role: "user", risk: "medium", status: "pending",
    lastLogin: "—", lastIp: "—", mfa: false,
    events: [],
  },
];

function StatTile({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4 flex items-center gap-3">
      <div className={cn("grid place-items-center h-10 w-10 rounded-lg bg-muted/60 border border-border", accent)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className={cn("text-xl font-display font-semibold", accent)}>{value}</p>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(seed);
  const [query, setQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editing, setEditing] = useState<User | null>(null);
  const [draftRole, setDraftRole] = useState<Role>("user");
  const [draftRisk, setDraftRisk] = useState<RiskLevel>("low");

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    highRisk: users.filter(u => u.risk === "high" || u.risk === "critical").length,
    locked: users.filter(u => u.status === "locked" || u.status === "suspended").length,
  }), [users]);

  const filtered = useMemo(() => users.filter(u => {
    if (filterRisk !== "all" && u.risk !== filterRisk) return false;
    if (filterStatus !== "all" && u.status !== filterStatus) return false;
    if (query) {
      const q = query.toLowerCase();
      return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    }
    return true;
  }), [users, query, filterRisk, filterStatus]);

  const openEdit = (u: User) => {
    setEditing(u);
    setDraftRole(u.role);
    setDraftRisk(u.risk);
  };

  const saveEdit = () => {
    if (!editing) return;
    setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, role: draftRole, risk: draftRisk } : u));
    toast.success("User updated", { description: `${editing.username} → role: ${draftRole}, risk override: ${draftRisk}` });
    setEditing(null);
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
                  <Lock className="h-3 w-3" /> Identity Service · Admin
                </div>
                <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                  User Management
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage all identities authenticated through the MyFinAlgo Identity Service. Role changes propagate to the
                  fraud engine within seconds and every override is signed to the immutable audit trail.
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Service healthy · OIDC + WebAuthn · last sync 4s ago
                </div>
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatTile icon={Users} label="Total Users" value={stats.total} accent="text-foreground" />
              <StatTile icon={CheckCircle2} label="Active" value={stats.active} accent="text-success" />
              <StatTile icon={AlertTriangle} label="High / Critical Risk" value={stats.highRisk} accent="text-danger" />
              <StatTile icon={Ban} label="Locked / Suspended" value={stats.locked} accent="text-warning" />
            </div>
          </section>

          {/* Filters */}
          <section className="card-surface p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by username, email or ID…"
                className="pl-9 bg-background/60"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[150px] bg-background/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All risk levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] bg-background/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => {
                    const risk = riskMeta[u.risk];
                    const role = roleMeta[u.role];
                    const st = statusMeta[u.status];
                    const StIcon = st.icon;
                    return (
                      <TableRow key={u.id} className="border-b border-border/40">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                              <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                                {u.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground flex items-center gap-1.5">
                                {u.username}
                                {u.mfa && <KeyRound className="h-3 w-3 text-success" aria-label="MFA enabled" />}
                              </span>
                              <span className="font-mono text-[11px] text-muted-foreground">{u.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" /> {u.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("font-medium", role.cls)}>{role.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide border", risk.cls)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", risk.dot)} />
                            {risk.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("font-medium gap-1", st.cls)}>
                            <StIcon className="h-3 w-3" /> {st.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground font-mono">{u.lastLogin}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">{u.lastIp}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                            <UserCog className="h-3.5 w-3.5 mr-1.5" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                        No users match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </main>
      </div>

      {/* Edit / Detail dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-primary" />
                  {editing.username}
                </DialogTitle>
                <DialogDescription>
                  <span className="font-mono text-xs">{editing.id}</span> · {editing.email}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">
                    <UserCog className="h-3.5 w-3.5 mr-1.5" /> Profile & Role
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Security Log
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role</Label>
                      <Select value={draftRole} onValueChange={(v) => setDraftRole(v as Role)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">Controls access to admin surfaces and the policy engine.</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Risk Level Override</Label>
                      <Select value={draftRisk} onValueChange={(v) => setDraftRisk(v as RiskLevel)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-warning inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Manual overrides outweigh model-derived scores.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2"><KeyRound className="h-3.5 w-3.5" /> MFA: <span className={editing.mfa ? "text-success" : "text-danger"}>{editing.mfa ? "Enabled" : "Disabled"}</span></p>
                    <p className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Last IP: <span className="font-mono text-foreground">{editing.lastIp}</span></p>
                    <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Last login: <span className="font-mono text-foreground">{editing.lastLogin}</span></p>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="pt-4">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Timestamp</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editing.events.map((e, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-xs">{e.ts}</TableCell>
                            <TableCell className="font-mono text-xs">{e.ip}</TableCell>
                            <TableCell className="text-xs inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{e.location}</TableCell>
                            <TableCell className="text-xs inline-flex items-center gap-1"><Monitor className="h-3 w-3 text-muted-foreground" />{e.device}</TableCell>
                            <TableCell>
                              {e.result === "success" && <Badge variant="outline" className="bg-success/10 text-success border-success/30">Success</Badge>}
                              {e.result === "mfa" && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">MFA</Badge>}
                              {e.result === "failure" && <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30">Failure</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                        {editing.events.length === 0 && (
                          <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-6">No login activity yet.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 inline-flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Streamed from Identity Service · retained 90 days
                  </p>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={saveEdit} className="bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90">
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}