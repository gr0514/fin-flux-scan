import { Bell, Search, ChevronDown, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Header() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 rounded-full border border-success/25 bg-success/10 px-3 py-1.5">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success pulse-dot" />
        <span className="text-xs font-medium text-success">SignalR: Connected</span>
        <span className="text-[10px] uppercase tracking-wider text-success/70">• Live</span>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono text-foreground">v3.2.1</span>
        <span>·</span>
        <span>Region: <span className="text-foreground">eu-west-1</span></span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions, IDs, accounts…"
            className="h-10 w-80 rounded-lg border border-border bg-card/60 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
        </div>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground transition hover:text-foreground hover:border-primary/40"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground transition hover:text-foreground hover:border-primary/40"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger shadow-glow-danger" />
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg border border-border bg-card/60 pl-1 pr-3 py-1 hover:border-primary/40 transition cursor-pointer"
        >
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary text-primary-foreground text-xs font-semibold">
            AK
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-semibold text-foreground">Alex Kovac</p>
            <p className="text-[10px] text-muted-foreground">Risk Analyst</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </div>
    </header>
  );
}
