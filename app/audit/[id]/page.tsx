// app/audit/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAudit } from "@/lib/actions";
import ResultsView from "@/components/ResultsView";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { Recommendation } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return { title: "Audit not found" };

  const savings = audit.total_monthly_savings;
  const title =
    savings > 0
      ? `AI Spend Audit — $${savings.toLocaleString()}/mo in savings found`
      : "AI Spend Audit — Results";

  return {
    title,
    description: audit.ai_summary?.slice(0, 160) ?? "View your personalized AI spend audit results.",
    openGraph: {
      title,
      description: audit.ai_summary?.slice(0, 160) ?? "",
      type: "website",
    },
  };
}

export default async function AuditResultsPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) notFound();

  const recommendations: Recommendation[] = audit.recommendations ?? [];
  const totalMonthlySavings: number = audit.total_monthly_savings ?? 0;
  const totalAnnualSavings: number = audit.total_annual_savings ?? 0;
  const aiSummary: string = audit.ai_summary ?? "";
  const formData = audit.form_data;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://spendaudit.credex.ai";
  const shareUrl = `${appUrl}/audit/${id}`;

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <ResultsView
          recommendations={recommendations}
          totalMonthlySavings={totalMonthlySavings}
          totalAnnualSavings={totalAnnualSavings}
          aiSummary={aiSummary}
          formData={formData}
          shareUrl={shareUrl}
          auditId={id}
        />
        <LeadCaptureForm auditId={id} totalMonthlySavings={totalMonthlySavings} />
      </div>
    </main>
  );
}
