// components/LeadCaptureForm.tsx
"use client";

import { useState } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { captureLead } from "@/lib/actions";

interface Props {
  auditId: string;
  totalMonthlySavings: number;
}

export default function LeadCaptureForm({ auditId, totalMonthlySavings }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await captureLead(
      { email, company, role, auditId },
      honeypot
    );

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Something went wrong.");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
        <h3 className="font-semibold text-foreground">You&apos;re all set</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ve emailed your audit link. A Credex advisor may follow up with
          tailored recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          name="url"
        />
      </div>

      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
          <Mail className="h-4.5 w-4.5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {totalMonthlySavings > 0
              ? "Get a copy + expert follow-up"
              : "Save your audit results"}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {totalMonthlySavings > 0
              ? "Enter your email and a Credex advisor will reach out with implementation guidance — free."
              : "We'll email you a link to revisit these results anytime."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">
            Work email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-sm">
              Company <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-sm">
              Role <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="role"
              placeholder="e.g. CTO, Engineering Lead"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            "Send me my results →"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          No spam. We&apos;ll only email your audit link and relevant follow-ups.
        </p>
      </form>
    </div>
  );
}
