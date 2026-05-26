// app/audit/page.tsx
import { Metadata } from "next";
import AuditForm from "@/components/AuditForm";

export const metadata: Metadata = {
  title: "Run Your AI Spend Audit — Credex",
  description: "Enter your AI tools and get instant recommendations to reduce overspending.",
};

export default function AuditPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AI Spend Audit
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add each AI tool your team pays for. We&apos;ll identify savings opportunities instantly.
          </p>
        </div>
        <AuditForm />
      </div>
    </main>
  );
}
