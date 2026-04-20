import { LayoutDashboard, BarChart3, Bell, History, Settings, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/" },
  { title: "Analytics", icon: BarChart3, to: "/analytics" },
  { title: "Alerts", icon: Bell, badge: 3, to: "/alerts" },
  { title: "History", icon: History, to: "/history" },
  { title: "Settings", icon: Settings, to: "/settings" },
];

export function AppSidebar({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-sidebar-border">
        <div className="grid place-items-center h-9 w-9 rounded-lg bg-gradient-primary shadow-glow-primary">
          <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">MyFinAlgo</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Realtime Engine</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Workspace</p>
        {items.map((item) => {
          const isActive = item.title === active;
          return (
            <Link
              key={item.title}
              to={item.to}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-[3px] rounded-r-full bg-primary shadow-glow-primary" />
              )}
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="flex-1 text-left font-medium">{item.title}</span>
              {"badge" in item && item.badge && (
                <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
          <p className="text-xs font-medium text-foreground">Engine Online</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          AI inference latency stable at <span className="text-success font-mono">12ms</span>
        </p>
      </div>
    </aside>
  );
}
