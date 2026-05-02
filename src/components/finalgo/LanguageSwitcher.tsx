import { useTranslation } from "react-i18next";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LANGS = [
  { code: "en", flag: "🇬🇧", labelKey: "language.english", short: "EN" },
  { code: "vi", flag: "🇻🇳", labelKey: "language.vietnamese", short: "VI" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = LANGS.find((l) => i18n.language?.startsWith(l.code)) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("language.label")}
        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card/60 px-3 text-xs font-medium text-foreground transition hover:border-primary/40"
      >
        <Languages className="h-4 w-4 text-muted-foreground" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-mono">{current.short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("language.label")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGS.map((l) => {
          const active = current.code === l.code;
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={() => i18n.changeLanguage(l.code)}
              className={cn("flex items-center gap-2 cursor-pointer", active && "bg-primary/10")}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span className="flex-1 text-sm">{t(l.labelKey)}</span>
              {active && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}