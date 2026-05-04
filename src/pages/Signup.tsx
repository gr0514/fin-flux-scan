import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthLayout, GoogleButton, Divider } from "@/components/auth/AuthLayout";
import { useRegisterMutation } from "@/hooks/useAuth";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const registerMutation = useRegisterMutation();

  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.ok).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ userName, email, password });
  };

  return (
    <AuthLayout
      badge="Get started"
      title="Tạo tài khoản"
      subtitle="Bắt đầu giám sát giao dịch với MyFinAlgo."
    >
      <GoogleButton label="Đăng ký bằng Google" />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userName" className="text-xs uppercase tracking-wider text-muted-foreground">
            Tên đăng nhập
          </Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ví dụ: adalovelace"
            autoComplete="username"
            className="bg-background/40 border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
            Địa chỉ Email
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
            Mật khẩu
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
          disabled={registerMutation.isPending || strength < 3}
          className="w-full h-11 text-primary-foreground hover:opacity-90 shadow-glow-primary"
          style={{ background: "var(--gradient-primary)" }}
        >
          {registerMutation.isPending ? "Đang tạo..." : "Đăng ký tài khoản"}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          Bằng việc đăng ký, bạn đồng ý với Điều khoản của chúng tôi.
        </p>

        <p className="text-center text-xs text-muted-foreground pt-1">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;