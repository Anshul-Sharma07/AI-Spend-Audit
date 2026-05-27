// components/ResultsView.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Share2, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Recommendation } from "@/lib/types";
import RecommendationCard from "@/components/RecommendationCard";
import SavingsSummary from "@/components/SavingsSummary";
import { THRESHOLDS } from "@/lib/pricing";

interface Props {
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  formData: { teamSize: number; primaryUseCase: string };
  shareUrl: string;
}

export default function ResultsView({
  recommendations,
  totalMonthlySavings,
  totalAnnualSavings,
  aiSummary,
  shareUrl,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  const highPriorityRecs = recommendations.filter((r) => r.severity === "high");
  const showCredexCTA = totalMonthlySavings >= THRESHOLDS.HIGH_SAVINGS_THRESHOLD;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Audit Results</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {recommendations.length} finding{recommendations.length !== 1 ? "s" : ""} across{" "}
            {new Set(recommendations.map((r) => r.toolName.split("+")[0].trim())).size} tool
            {recommendations.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyShareLink}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy share link
              </>
            )}
          </Button>
          <Link href="/audit">
            <Button variant="outline" size="sm">
              <RotateCcw className="h-3.5 w-3.5" /> New audit
            </Button>
          </Link>
        </div>
      </div>

      {/* Savings summary */}
      <SavingsSummary
        totalMonthlySavings={totalMonthlySavings}
        totalAnnualSavings={totalAnnualSavings}
      />

      {/* Credex CTA — only when savings are significant */}
      {showCredexCTA && (
        <div className="rounded-xl border-2 border-foreground bg-foreground p-6 text-background">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">
                Credex can help
              </p>
              <h3 className="text-lg font-bold">
                We found ${totalMonthlySavings.toLocaleString()}/mo in savings.
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Our team can implement these optimizations for you in under a week — guaranteed.
              </p>
            </div>
            <a href="https://credex.ai/contact" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="shrink-0 border-white/20 bg-white/10 text-white hover:bg-white/20">
                Talk to Credex <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* AI summary */}
      {aiSummary && (
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            AI analysis
          </p>
          <p className="text-sm leading-relaxed text-foreground">{aiSummary}</p>
        </div>
      )}

      <Separator />

      {/* High priority first */}
      {highPriorityRecs.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            High priority
          </h2>
          {highPriorityRecs.map((rec) => (
            <RecommendationCard key={rec.toolId} recommendation={rec} />
          ))}
        </div>
      )}

      {/* Other recommendations */}
      {recommendations.filter((r) => r.severity !== "high").length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Other findings
          </h2>
          {recommendations
            .filter((r) => r.severity !== "high")
            .map((rec) => (
              <RecommendationCard key={rec.toolId} recommendation={rec} />
            ))}
        </div>
      )}

      {/* Share nudge */}
      <div className="rounded-xl border border-border bg-slate-50 p-5 text-center">
        <Share2 className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Share these results</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your shareable link excludes personal details.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={copyShareLink}
        >
          {copied ? "Copied!" : "Copy public link"}
        </Button>
      </div>
    </div>
  );
}
