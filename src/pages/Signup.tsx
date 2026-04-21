import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AuthLayout, GoogleButton, Divider } from "@/components/auth/AuthLayout";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast({ title: "Account created", description: "Welcome to MyFinAlgo!" });
    navigate("/");
  };

  return (
    <AuthLayout
      badge="Get started"
      title="Create your account"
      subtitle="Start monitoring fraud in realtime — free for 14 days."
    >
      <GoogleButton label="Sign up with Google" />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">
            Full name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            className="bg-background/40 border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
            Work email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="bg-background/40 border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
            Password
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

          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5 text-[11px]">
                {c.ok ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <X className="h-3.5 w-3.5 text-muted-foreground/60" />
                )}
                <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="submit"
          disabled={submitting || strength < 3}
          className="w-full h-11 text-primary-foreground hover:opacity-90 shadow-glow-primary"
          style={{ background: "var(--gradient-primary)" }}
        >
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.
        </p>

        <p className="text-center text-xs text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;