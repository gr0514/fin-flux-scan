import { CheckCircle2, XCircle, AlertCircle, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const TP = 18420;
const TN = 482310;
const FP = 312;
const FN = 184;
const total = TP + TN + FP + FN;
const precision = TP / (TP + FP);
const recall = TP / (TP + FN);
const f1 = (2 * precision * recall) / (precision + recall);
const accuracy = (TP + TN) / total;

interface CellProps {
  label: string;
  value: number;
  pct: string;
  variant: "tp" | "tn" | "fp" | "fn";
  icon: typeof CheckCircle2;
}

function Cell({ label, value, pct, variant, icon: Icon }: CellProps) {
  const styles = {
    tp: "bg-success/10 ring-success/30 text-success",
    tn: "bg-primary/10 ring-primary/30 text-primary",
    fp: "bg-warning/10 ring-warning/30 text-warning",
    fn: "bg-danger/10 ring-danger/30 text-danger",
  }[variant];

  return (
    <div className={cn("rounded-lg p-3 ring-1 transition hover:scale-[1.02]", styles)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.14em] opacity-90">{label}</span>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-foreground">{value.toLocaleString()}</p>
      <p className="text-[10px] mt-0.5 opacity-80 font-mono">{pct}</p>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <span className={cn("font-display text-lg font-semibold tabular-nums", color)}>{value}</span>
    </div>
  );
}

export function ConfusionMatrix() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 ring-1 ring-primary/30">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">xgb-anomaly-v4.2</p>
          <p className="text-[10px] text-muted-foreground font-mono truncate">Trained: Apr 12 · 1.2M samples · 87 features</p>
        </div>
        <span className="rounded-md bg-success/10 px-2 py-1 text-[10px] font-semibold text-success ring-1 ring-success/30">PROD</span>
      </div>

      {/* Confusion matrix grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Confusion Matrix</p>
          <p className="text-[10px] text-muted-foreground font-mono">{total.toLocaleString()} predictions</p>
        </div>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
          <div />
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider">Pred. Legit</p>
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider">Pred. Anomaly</p>

          <p className="text-[10px] text-muted-foreground uppercase tracking-wider [writing-mode:vertical-rl] rotate-180 self-center justify-self-center">Actual Legit</p>
          <Cell label="True Neg" value={TN} pct={`${((TN / total) * 100).toFixed(2)}%`} variant="tn" icon={CheckCircle2} />
          <Cell label="False Pos" value={FP} pct={`${((FP / total) * 100).toFixed(2)}%`} variant="fp" icon={AlertCircle} />

          <p className="text-[10px] text-muted-foreground uppercase tracking-wider [writing-mode:vertical-rl] rotate-180 self-center justify-self-center">Actual Anomaly</p>
          <Cell label="False Neg" value={FN} pct={`${((FN / total) * 100).toFixed(2)}%`} variant="fn" icon={XCircle} />
          <Cell label="True Pos" value={TP} pct={`${((TP / total) * 100).toFixed(2)}%`} variant="tp" icon={CheckCircle2} />
        </div>
      </div>

      {/* Performance stats */}
      <div className="grid grid-cols-4 gap-3 rounded-lg border border-border/60 bg-card/40 p-3">
        <Stat label="Accuracy" value={`${(accuracy * 100).toFixed(2)}%`} color="text-success" />
        <Stat label="Precision" value={`${(precision * 100).toFixed(2)}%`} color="text-primary" />
        <Stat label="Recall" value={`${(recall * 100).toFixed(2)}%`} color="text-primary" />
        <Stat label="F1 Score" value={f1.toFixed(3)} color="text-warning" />
      </div>

      {/* ROC mini-bar */}
      <div className="rounded-lg border border-border/60 bg-card/40 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Decision Threshold</span>
          <span className="font-mono text-xs text-foreground">0.78</span>
        </div>
        <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-success via-warning to-danger w-full opacity-50" />
          <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-foreground ring-2 ring-background shadow-glow-primary" style={{ left: "78%" }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground font-mono">
          <span>0.0 lenient</span>
          <span>1.0 strict</span>
        </div>
      </div>
    </div>
  );
}
