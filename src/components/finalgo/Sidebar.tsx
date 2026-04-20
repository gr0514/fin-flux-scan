import { LayoutDashboard, BarChart3, Bell, History, Settings, Activity } from "lucide-react";
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
  SidebarMenuBadge,
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
  { title: "Settings", icon: Settings, to: "/settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border [&_[data-sidebar=sidebar]]:bg-sidebar"
    >
      <SidebarHeader className="border-b border-sidebar-border h-16 px-4 justify-center">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-gradient-primary shadow-glow-primary">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <p className="font-display text-lg font-semibold tracking-tight text-foreground truncate">
                MyFinAlgo
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                Realtime Engine
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="h-10 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && !collapsed && (
                            <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-[3px] rounded-r-full bg-primary shadow-glow-primary" />
                          )}
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                  {"badge" in item && item.badge && !collapsed && (
                    <SidebarMenuBadge className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-semibold text-danger">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-3">
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
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
