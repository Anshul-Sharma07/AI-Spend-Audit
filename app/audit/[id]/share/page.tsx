// app/audit/[id]/share/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, ArrowRight } from "lucide-react";
import { getAudit } from "@/lib/actions";
import { Recommendation } from "@/lib/types";
import RecommendationCard from "@/components/RecommendationCard";
import SavingsSummary from "@/components/SavingsSummary";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return { title: "Audit not found" };

  const savings = audit.total_monthly_savings;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://spendaudit.credex.ai";

  return {
    title:
      savings > 0
        ? `AI Spend Audit — $${savings.toLocaleString()}/mo savings identified`
        : "AI Spend Audit Results",
    description:
      audit.ai_summary?.slice(0, 160) ??
      "AI spend audit results. See which tools are over-budget.",
    openGraph: {
      title:
        savings > 0
          ? `This team could save $${savings.toLocaleString()}/month on AI tools`
          : "AI Spend Audit Results",
      description: audit.ai_summary?.slice(0, 160) ?? "",
      type: "website",
      url: `${appUrl}/audit/${id}/share`,
    },
  };
}

export default async function PublicSharePage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) notFound();

  const recommendations: Recommendation[] = audit.recommendations ?? [];
  const totalMonthlySavings: number = audit.total_monthly_savings ?? 0;
  const totalAnnualSavings: number = audit.total_annual_savings ?? 0;
  const aiSummary: string = audit.ai_summary ?? "";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <TrendingDown className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Credex Audit</span>
          </Link>
          <Link href="/audit">
            <Button size="sm">
              Run your own audit <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      <main className="px-6 py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Shared audit report
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Spend Audit Results
            </h1>
            {aiSummary && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {aiSummary}
              </p>
            )}
          </div>

          {/* Savings summary */}
          <SavingsSummary
            totalMonthlySavings={totalMonthlySavings}
            totalAnnualSavings={totalAnnualSavings}
          />

          {/* Recommendations */}
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">Per-tool recommendations</h2>
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.toolId} recommendation={rec} />
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-border bg-foreground p-6 text-center text-background">
            <p className="mb-1 text-sm text-slate-400">Want your own audit?</p>
            <h3 className="mb-4 text-xl font-bold">
              Find out how much your team is overpaying
            </h3>
            <Link href="/audit">
              <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Run free audit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
