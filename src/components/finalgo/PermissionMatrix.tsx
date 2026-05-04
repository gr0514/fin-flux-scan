import { useMemo } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { PERMISSION_TREE, type PermissionNode } from "@/lib/permissions";

interface Props {
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

function leafIds(node: PermissionNode): string[] {
  return node.children ? node.children.flatMap(leafIds) : [node.id];
}

export function PermissionMatrix({ selected, onChange, disabled }: Props) {
  const set = useMemo(() => new Set(selected), [selected]);

  const toggleMany = (ids: string[], on: boolean) => {
    const next = new Set(selected);
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    onChange(Array.from(next));
  };

  const stateOf = (node: PermissionNode): "on" | "off" | "partial" => {
    const leaves = leafIds(node);
    const on = leaves.filter((id) => set.has(id)).length;
    if (on === 0) return "off";
    if (on === leaves.length) return "on";
    return "partial";
  };

  return (
    <div className="space-y-3">
      {PERMISSION_TREE.map((group) => {
        const groupState = stateOf(group);
        const groupLeaves = leafIds(group);
        const onCount = groupLeaves.filter((id) => set.has(id)).length;
        return (
          <div key={group.id} className="rounded-xl border border-border bg-background/60 overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <Checkbox
                  checked={groupState === "on" ? true : groupState === "partial" ? "indeterminate" : false}
                  onCheckedChange={(v) => toggleMany(groupLeaves, !!v)}
                  disabled={disabled}
                  aria-label={`Toggle all ${group.name}`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {group.name}
                  </p>
                  {group.description && (
                    <p className="text-[11px] text-muted-foreground truncate">{group.description}</p>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                {onCount}/{groupLeaves.length}
              </span>
            </div>

            <div className="p-3 space-y-2">
              {group.children?.map((sub) => {
                if (sub.children) {
                  const subLeaves = leafIds(sub);
                  const subState = stateOf(sub);
                  return (
                    <div key={sub.id} className="rounded-lg border border-border/60 bg-muted/20">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60">
                        <Checkbox
                          checked={subState === "on" ? true : subState === "partial" ? "indeterminate" : false}
                          onCheckedChange={(v) => toggleMany(subLeaves, !!v)}
                          disabled={disabled}
                        />
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">{sub.name}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3">
                        {sub.children.map((leaf) => (
                          <label
                            key={leaf.id}
                            className={cn(
                              "flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-xs hover:bg-muted/60 cursor-pointer",
                              set.has(leaf.id) && "border-primary/30 bg-primary/5"
                            )}
                          >
                            <Checkbox
                              checked={set.has(leaf.id)}
                              onCheckedChange={(v) => toggleMany([leaf.id], !!v)}
                              disabled={disabled}
                            />
                            <span className="text-foreground">{leaf.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <label
                    key={sub.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-xs hover:bg-muted/60 cursor-pointer",
                      set.has(sub.id) && "border-primary/30 bg-primary/5"
                    )}
                  >
                    <Checkbox
                      checked={set.has(sub.id)}
                      onCheckedChange={(v) => toggleMany([sub.id], !!v)}
                      disabled={disabled}
                    />
                    <span className="text-foreground">{sub.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}