import { Calendar, ChevronDown, Download, FileText, Bell } from "lucide-react";

export function AnalyticsHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="font-display text-base font-semibold tracking-tight text-foreground truncate">
          Historical Analytics & Deep Dive
        </h1>
        <p className="text-[11px] text-muted-foreground hidden sm:block">
          Aggregated insights across the selected reporting window
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Date range picker */}
        <button className="hidden md:flex items-center gap-2.5 h-10 rounded-lg border border-border bg-card/60 pl-3 pr-2 text-sm text-foreground hover:border-primary/40 transition group">
          <Calendar className="h-4 w-4 text-primary" />
          <div className="leading-tight text-left">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Range</p>
            <p className="text-xs font-medium font-mono">Mar 20 → Apr 19, 2026</p>
          </div>
          <span className="ml-1 hidden lg:inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/25">
            Last 30 Days
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        <button className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground transition hover:text-foreground hover:border-primary/40">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger shadow-glow-danger" />
        </button>

        {/* Download split button */}
        <div className="flex items-center rounded-lg overflow-hidden shadow-glow-primary">
          <button className="inline-flex items-center gap-2 bg-gradient-primary px-4 h-10 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            <Download className="h-3.5 w-3.5" />
            Download Report
          </button>
          <div className="flex items-center bg-primary/90">
            <button className="px-2.5 h-10 text-[10px] font-semibold text-primary-foreground border-l border-primary-foreground/20 hover:bg-primary transition">CSV</button>
            <button className="px-2.5 h-10 text-[10px] font-semibold text-primary-foreground border-l border-primary-foreground/20 hover:bg-primary transition inline-flex items-center gap-1">
              <FileText className="h-3 w-3" /> PDF
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
