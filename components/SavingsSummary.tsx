// components/SavingsSummary.tsx
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export default function SavingsSummary({ totalMonthlySavings, totalAnnualSavings }: Props) {
  const hasSavings = totalMonthlySavings > 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-6",
        hasSavings
          ? "border-emerald-200 bg-emerald-50"
          : "border-border bg-white"
      )}
    >
      {hasSavings ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <TrendingDown className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
                Potential savings identified
              </p>
              <p className="mt-0.5 text-3xl font-bold tracking-tight text-emerald-900">
                ${totalMonthlySavings.toLocaleString()}
                <span className="ml-1 text-lg font-medium text-emerald-700">/month</span>
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-100/60 px-5 py-3 text-center">
            <p className="text-xs font-medium text-emerald-700">Annual savings</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-900">
              ${totalAnnualSavings.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Your AI stack looks lean</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No major savings opportunities found based on the plans and seat counts you entered.
              As your team grows, re-run this audit — the math changes significantly at scale.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
