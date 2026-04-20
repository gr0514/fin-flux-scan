import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, Check, X, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function strengthOf(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
    { label: "One special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = strengthOf(password);
  const match = password.length > 0 && password === confirm;
  const canSubmit = strength >= 3 && match && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
    toast({
      title: "Password updated",
      description: "You can now sign in with your new password.",
    });
    setTimeout(() => navigate("/login"), 1800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Ambient backdrop */}
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
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="grid place-items-center h-10 w-10 rounded-lg bg-gradient-primary shadow-glow-primary">
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
        </div>

        <div className="card-surface p-8">
          {!done ? (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 mb-4">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-primary font-medium">
                    Secure reset
                  </span>
                </div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  Set a new password
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="bg-background/40 border-border pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded text-muted-foreground hover:text-foreground transition"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  <div className="flex gap-1 pt-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          i < strength
                            ? strength <= 1
                              ? "bg-danger"
                              : strength === 2
                              ? "bg-warning"
                              : strength === 3
                              ? "bg-primary"
                              : "bg-success"
                            : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Confirm */}
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={cn(
                        "bg-background/40 border-border pr-10",
                        confirm.length > 0 && !match && "border-danger/60 focus-visible:ring-danger/30"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded text-muted-foreground hover:text-foreground transition"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirm.length > 0 && !match && (
                    <p className="text-xs text-danger">Passwords don't match.</p>
                  )}
                </div>

                {/* Requirements */}
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg border border-border bg-background/30 p-3">
                  {checks.map((c) => (
                    <li key={c.label} className="flex items-center gap-1.5 text-[11px]">
                      {c.ok ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-muted-foreground/60" />
                      )}
                      <span className={cn(c.ok ? "text-foreground" : "text-muted-foreground")}>
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary"
                >
                  {submitting ? "Updating…" : "Update password"}
                </Button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 glow-success mb-4">
                <Check className="h-7 w-7 text-success" strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Password updated
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Redirecting you to sign in…
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          Protected by MyFinAlgo · End-to-end encrypted
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
