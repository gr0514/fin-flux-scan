import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout, GoogleButton, Divider } from "@/components/auth/AuthLayout";
import { useLoginMutation } from "@/hooks/useAuth";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  // Hook từ React Query
  const loginMutation = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ userName, password });
  };

  return (
    <AuthLayout
      badge="Secure sign in"
      title="Welcome back"
      subtitle="Sign in to your MyFinAlgo workspace."
    >
      <GoogleButton />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userName" className="text-xs uppercase tracking-wider text-muted-foreground">
            Tên đăng nhập
          </Label>
          <Input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            autoComplete="username"
            className="bg-background/40 border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
              Mật khẩu
            </Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
          <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
            Ghi nhớ đăng nhập
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-11 text-primary-foreground hover:opacity-90 shadow-glow-primary"
          style={{ background: "var(--gradient-primary)" }}
        >
          {loginMutation.isPending ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-1">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Tạo mới
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;