import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
  };

  return (
    <AuthLayout
      badge="Account recovery"
      title={sent ? "Check your inbox" : "Forgot password?"}
      subtitle={
        sent
          ? `We've sent a reset link to ${email}.`
          : "Enter your email and we'll send you a reset link."
      }
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
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

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 text-primary-foreground hover:opacity-90 shadow-glow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            {submitting ? "Sending…" : "Send reset link"}
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 glow-primary">
            <MailCheck className="h-7 w-7 text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Didn't get it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary hover:underline"
            >
              try again
            </button>
            .
          </p>
          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;