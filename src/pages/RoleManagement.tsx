import { useMemo, useState } from "react";
import {
  ShieldCheck, Plus, Search, Lock, Users, PencilLine, Trash2, KeyRound, AlertTriangle,
} from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PermissionMatrix } from "@/components/finalgo/PermissionMatrix";
import { ALL_PERMISSIONS, ROLES_SEED, ROLE_BADGE_CLS, type RoleDef } from "@/lib/permissions";

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

export default function RoleManagement() {
  const [roles, setRoles] = useState<RoleDef[]>(ROLES_SEED);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<RoleDef | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const stats = useMemo(() => ({
    total: roles.length,
    system: roles.filter(r => r.system).length,
    members: roles.reduce((s, r) => s + r.members, 0),
    perms: ALL_PERMISSIONS.length,
  }), [roles]);

  const filtered = useMemo(() => roles.filter(r => {
    if (!query) return true;
    const q = query.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  }), [roles, query]);

  const upsert = (r: RoleDef) => {
    setRoles(prev => {
      const exists = prev.find(x => x.id === r.id);
      return exists ? prev.map(x => x.id === r.id ? r : x) : [...prev, r];
    });
  };

  const remove = (r: RoleDef) => {
    if (r.system) {
      toast.error("Cannot delete system role", { description: `${r.name} is required by the Identity Service.` });
      return;
    }
    setRoles(prev => prev.filter(x => x.id !== r.id));
    toast("Role removed", { description: `${r.name} deleted from policy set` });
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
                  <Lock className="h-3 w-3" /> Identity Service · ABP PermissionManagement
                </div>
                <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                  Role &amp; Permission Management
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Define roles and assign granular permissions across the MyFinAlgo platform. Changes are pushed to the
                  ABP <span className="font-mono text-foreground">PermissionManagement</span> API and propagate to every
                  microservice within seconds.
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Cryptographically audited · last sync 6s ago
                </div>
              </div>

              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-1.5" /> Create Role
                  </Button>
                </DialogTrigger>
                <RoleDialog
                  onClose={() => setCreateOpen(false)}
                  onSave={(r) => { upsert(r); setCreateOpen(false); toast.success("Role created", { description: `${r.name} added with ${r.permissions.length} permissions` }); }}
                />
              </Dialog>
            </div>

            <div className="relative mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatTile icon={ShieldCheck} label="Total Roles" value={stats.total} accent="text-foreground" />
              <StatTile icon={Lock} label="System Roles" value={stats.system} accent="text-warning" />
              <StatTile icon={Users} label="Assigned Members" value={stats.members} accent="text-primary" />
              <StatTile icon={KeyRound} label="Permissions Available" value={stats.perms} accent="text-success" />
            </div>
          </section>

          {/* Filters */}
          <section className="card-surface p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles by name or description…"
                className="pl-9 bg-background/60"
              />
            </div>
          </section>

          {/* Table */}
          <section className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border/60">
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Permissions</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id} className="border-b border-border/40">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("font-medium", ROLE_BADGE_CLS[r.id])}>{r.name}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground truncate">{r.description}</p>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-foreground">
                        {r.permissions.length}<span className="text-muted-foreground">/{ALL_PERMISSIONS.length}</span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{r.members}</TableCell>
                      <TableCell>
                        {r.system ? (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 gap-1">
                            <Lock className="h-3 w-3" /> System
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditing(r)}>
                          <PencilLine className="h-3.5 w-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-danger border-danger/30 hover:bg-danger/10"
                          onClick={() => remove(r)}
                          disabled={r.system}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                        No roles match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </main>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <RoleDialog
            initial={editing}
            onClose={() => setEditing(null)}
            onSave={(r) => {
              upsert(r);
              setEditing(null);
              toast.success("Permissions updated", { description: `${r.name} now has ${r.permissions.length} permissions` });
            }}
          />
        )}
      </Dialog>
    </div>
  );
}

function RoleDialog({
  initial,
  onClose,
  onSave,
}: {
  initial?: RoleDef;
  onClose: () => void;
  onSave: (r: RoleDef) => void;
}) {
  const isNew = !initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name required", { description: "Please enter a role name." });
      return;
    }
    const r: RoleDef = initial
      ? { ...initial, name: name.trim(), description: description.trim(), permissions }
      : {
          id: (name.trim().toLowerCase().replace(/\s+/g, "_") as RoleDef["id"]),
          name: name.trim(),
          description: description.trim() || "Custom role",
          system: false,
          members: 0,
          permissions,
        };
    onSave(r);
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {isNew ? "Create Role" : `Edit · ${initial?.name}`}
        </DialogTitle>
        <DialogDescription>
          Map permissions from the ABP <span className="font-mono">PermissionManagement</span> tree to this role.
          {initial?.system && (
            <span className="block mt-2 text-warning inline-flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> System role · name and description are locked.
            </span>
          )}
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="permissions">
            Permissions <span className="ml-1.5 text-[10px] font-mono text-muted-foreground">({permissions.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Compliance Officer" disabled={initial?.system} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What can this role do?" disabled={initial?.system} />
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              Toggle access at any level. Parent checkboxes propagate to children.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPermissions([])}>Clear all</Button>
              <Button variant="outline" size="sm" onClick={() => setPermissions(ALL_PERMISSIONS)}>Grant all</Button>
            </div>
          </div>
          <PermissionMatrix selected={permissions} onChange={setPermissions} />
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground shadow-glow-primary hover:opacity-90">
          {isNew ? "Create Role" : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}