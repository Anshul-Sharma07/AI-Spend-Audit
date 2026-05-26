// components/RecommendationCard.tsx
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Recommendation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  recommendation: Recommendation;
}

const SEVERITY_CONFIG = {
  high: {
    icon: XCircle,
    badge: "danger" as const,
    label: "High priority",
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
  },
  medium: {
    icon: AlertTriangle,
    badge: "warning" as const,
    label: "Medium priority",
    bg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  low: {
    icon: Info,
    badge: "secondary" as const,
    label: "Low priority",
    bg: "bg-white border-border",
    iconColor: "text-blue-500",
  },
  ok: {
    icon: CheckCircle2,
    badge: "success" as const,
    label: "Looks good",
    bg: "bg-white border-border",
    iconColor: "text-emerald-600",
  },
};

export default function RecommendationCard({ recommendation: rec }: Props) {
  const config = SEVERITY_CONFIG[rec.severity];
  const Icon = config.icon;
  const hasSavings = rec.monthlySavings > 0;

  return (
    <div className={cn("rounded-xl border p-5 transition-shadow hover:shadow-sm", config.bg)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)} />
          <div className="flex-1 min-w-0">
            {/* Tool name + plan */}
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground text-sm">
                {rec.toolName}
              </span>
              {rec.currentPlan && rec.currentPlan !== "Multiple" && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {rec.currentPlan}
                </span>
              )}
              <Badge variant={config.badge} className="text-xs">
                {config.label}
              </Badge>
            </div>

            {/* Recommendation */}
            <p className="font-medium text-foreground text-sm">{rec.recommendation}</p>

            {/* Reasoning */}
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {rec.reason}
            </p>
          </div>
        </div>

        {/* Savings */}
        {hasSavings && (
          <div className="shrink-0 text-right">
            <div className="text-lg font-bold text-emerald-700">
              −${rec.monthlySavings.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">per month</div>
            <div className="mt-0.5 text-xs font-medium text-emerald-700">
              ${rec.annualSavings.toLocaleString()}/yr
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
