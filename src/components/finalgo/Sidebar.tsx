import { LayoutDashboard, BarChart3, Bell, History, Settings, Activity, PanelLeft, HeartPulse, ShieldAlert } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/" },
  { title: "Analytics", icon: BarChart3, to: "/analytics" },
  { title: "Alerts", icon: Bell, badge: 3, to: "/alerts" },
  { title: "History", icon: History, to: "/history" },
  { title: "System Health", icon: HeartPulse, to: "/system-health" },
  { title: "Risk Rules", icon: ShieldAlert, to: "/risk-rules" },
  { title: "Settings", icon: Settings, to: "/settings" },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r border-sidebar-border",
        // Force solid sidebar background everywhere (desktop fixed wrapper + mobile sheet)
        "[&_[data-sidebar=sidebar]]:bg-sidebar"
      )}
    >
      {/* Header: Logo + Toggle */}
      <SidebarHeader
        className={cn(
          "h-16 border-b border-sidebar-border p-0 flex-row items-center",
          collapsed ? "justify-center px-0" : "justify-between px-4"
        )}
      >
        {collapsed ? (
          <button
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="grid place-items-center h-9 w-9 rounded-lg bg-gradient-primary shadow-glow-primary hover:opacity-90 transition"
          >
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <div className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-gradient-primary shadow-glow-primary">
                <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="leading-tight min-w-0">
                <p className="font-display text-base font-semibold tracking-tight text-foreground truncate">
                  MyFinAlgo
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                  Realtime Engine
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </>
        )}
      </SidebarHeader>

      <SidebarContent className={cn("py-4", collapsed ? "px-0" : "px-2")}>
        <SidebarGroup className={collapsed ? "p-0" : ""}>
          <SidebarGroupLabel className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={collapsed ? "items-center gap-1.5" : "gap-1"}>
              {items.map((item) => {
                const badge = "badge" in item ? item.badge : undefined;
                return (
                  <SidebarMenuItem key={item.title} className={collapsed ? "w-auto" : ""}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "group/btn relative overflow-visible",
                        collapsed
                          ? "!h-10 !w-10 !p-0 rounded-lg justify-center"
                          : "h-10 px-3"
                      )}
                    >
                      <NavLink to={item.to} end={item.to === "/"}>
                        {({ isActive }) => (
                          <>
                            {/* Active glow border */}
                            {isActive && (
                              <span
                                className={cn(
                                  "absolute top-1/2 -translate-y-1/2 rounded-r-full bg-primary shadow-glow-primary",
                                  collapsed ? "left-0 h-6 w-[3px]" : "left-0 h-6 w-[3px]"
                                )}
                              />
                            )}
                            {/* Active background tint */}
                            <span
                              className={cn(
                                "absolute inset-0 rounded-lg transition-colors",
                                isActive
                                  ? "bg-primary/10 ring-1 ring-primary/25"
                                  : "bg-transparent group-hover/btn:bg-sidebar-accent/60"
                              )}
                            />
                            <item.icon
                              className={cn(
                                "h-[18px] w-[18px] shrink-0 relative z-10 transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover/btn:text-foreground"
                              )}
                            />
                            {!collapsed && (
                              <span
                                className={cn(
                                  "relative z-10 flex-1 text-sm font-medium truncate",
                                  isActive ? "text-foreground" : "text-sidebar-foreground"
                                )}
                              >
                                {item.title}
                              </span>
                            )}
                            {!collapsed && badge && (
                              <span className="relative z-10 rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                                {badge}
                              </span>
                            )}
                            {collapsed && badge && (
                              <span className="absolute top-1 right-1 z-10 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-danger-foreground shadow-glow-danger">
                                {badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn(collapsed ? "p-2" : "p-3")}>
        {collapsed ? (
          <div
            className="grid place-items-center h-9 w-9 mx-auto rounded-lg bg-sidebar-accent/40 border border-sidebar-border"
            title="Engine Online · 12ms"
          >
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
          </div>
        ) : (
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
              <p className="text-xs font-medium text-foreground">Engine Online</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI inference latency stable at{" "}
              <span className="text-success font-mono">12ms</span>
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
