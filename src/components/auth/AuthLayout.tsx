import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck } from "lucide-react";

interface Props {
  children: ReactNode;
  badge?: string;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, badge, title, subtitle }: Props) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-60"
        style={{ background: "var(--gradient-success)" }}
      />

      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div
            className="grid place-items-center h-10 w-10 rounded-lg shadow-glow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold tracking-tight text-foreground">
              MyFinAlgo
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Realtime Engine
            </p>
          </div>
        </Link>

        <div className="card-surface p-8">
          <div className="mb-6">
            {badge && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 mb-4">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-primary font-medium">
                  {badge}
                </span>
              </div>
            )}
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          Protected by MyFinAlgo · End-to-end encrypted
        </p>
      </div>
    </div>
  );
}

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  return (
    <button
      type="button"
      className="w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-md border border-border bg-background/40 hover:bg-background/70 text-sm font-medium text-foreground transition"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18a11 11 0 0 0 0 9.92l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
      </svg>
      {label}
    </button>
  );
}

export function Divider({ text = "or" }: { text?: string }) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
        <span className="bg-card px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}