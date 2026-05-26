import { notFound } from "next/navigation";
import { getAudit } from "@/lib/audits";
import ResultsView from "@/components/ResultsView";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { Recommendation } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

interface Props {
  params: Promise<{ id: string }>;
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
