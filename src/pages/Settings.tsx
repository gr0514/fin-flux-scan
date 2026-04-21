import { useState } from "react";
import { Moon, Sun, User, Lock, Bell, Palette, Save, Camera, Eye, EyeOff } from "lucide-react";
import { AppSidebar } from "@/components/finalgo/Sidebar";
import { Header } from "@/components/finalgo/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme/ThemeProvider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Section = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="card-surface p-6">
    <div className="flex items-start gap-3 mb-5">
      <div className="grid place-items-center h-9 w-9 rounded-lg bg-primary/10 ring-1 ring-primary/20">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("Ada Lovelace");
  const [email] = useState("ada@myfinalgo.com");
  const [bio, setBio] = useState("Senior fraud analyst — EU region.");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [notif, setNotif] = useState({ anomaly: true, weekly: true, product: false });

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile saved", description: "Your changes are live." });
  };
  const onChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || newPw.length < 8) {
      toast({ title: "Cannot update", description: "Check current password and ensure new is 8+ chars.", variant: "destructive" });
      return;
    }
    setCurrentPw(""); setNewPw("");
    toast({ title: "Password updated", description: "Use the new password next time you sign in." });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 px-6 lg:px-8 py-6 space-y-6 max-w-4xl w-full mx-auto">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your profile, security, notifications, and appearance.
            </p>
          </div>

          {/* Profile */}
          <Section icon={User} title="Profile" description="How others see you across MyFinAlgo.">
            <form onSubmit={onSaveProfile} className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/15 text-primary font-semibold">AL</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Camera className="h-3.5 w-3.5" />
                  Change avatar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Full name
                  </Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-background/40" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </Label>
                  <Input id="email" value={email} disabled className="bg-background/40" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Bio
                </Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="bg-background/40" />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="gap-2 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  <Save className="h-3.5 w-3.5" />
                  Save changes
                </Button>
              </div>
            </form>
          </Section>

          {/* Appearance */}
          <Section icon={Palette} title="Appearance" description="Pick a theme that suits your eyes.">
            <div className="grid grid-cols-2 gap-3">
              {(["dark", "light"] as const).map((mode) => {
                const active = theme === mode;
                const Icon = mode === "dark" ? Moon : Sun;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={cn(
                      "relative rounded-xl border p-4 text-left transition",
                      active
                        ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/30 bg-background/30"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "grid place-items-center h-9 w-9 rounded-lg",
                        active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize">{mode}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {mode === "dark" ? "Default — easy on the eyes" : "Bright — for daylight"}
                        </p>
                      </div>
                    </div>
                    {active && (
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary shadow-glow-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Security */}
          <Section icon={Lock} title="Security" description="Update your password regularly.">
            <form onSubmit={onChangePw} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPw" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Current password
                  </Label>
                  <Input
                    id="currentPw"
                    type={showPw ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="bg-background/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPw" className="text-xs uppercase tracking-wider text-muted-foreground">
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPw"
                      type={showPw ? "text" : "password"}
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="bg-background/40 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded text-muted-foreground hover:text-foreground transition"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="outline" className="gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Update password
                </Button>
              </div>
            </form>
          </Section>

          {/* Notifications */}
          <Section icon={Bell} title="Notifications" description="What should we email you about?">
            <div className="space-y-1">
              {[
                { key: "anomaly", title: "Anomaly alerts", desc: "Real-time email on every high-risk transaction." },
                { key: "weekly", title: "Weekly digest", desc: "Performance summary every Monday." },
                { key: "product", title: "Product updates", desc: "Occasional news about new features." },
              ].map((row, i) => (
                <div key={row.key}>
                  {i > 0 && <Separator className="my-1" />}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">{row.desc}</p>
                    </div>
                    <Switch
                      checked={notif[row.key as keyof typeof notif]}
                      onCheckedChange={(v) => setNotif((p) => ({ ...p, [row.key]: v }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
};

export default Settings;