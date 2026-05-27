// lib/actions.ts
"use server";

import { v4 as uuidv4 } from "uuid";
import { getServiceSupabase } from "./supabase";
import { runAudit, calcTotals } from "./audit-engine";
import { generateAISummary } from "./ai-summary";
import { AuditFormData, LeadData } from "./types";

// ─── Rate limiting (simple in-memory, good enough for MVP) ───────────────────
const submissionCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const maxPerHour = 10;

  const entry = submissionCounts.get(ip);
  if (!entry || entry.resetAt < now) {
    submissionCounts.set(ip, { count: 1, resetAt: now + window });
    return true;
  }

  if (entry.count >= maxPerHour) return false;
  entry.count++;
  return true;
}

// ─── Submit audit ─────────────────────────────────────────────────────────────
export async function submitAudit(
  formData: AuditFormData,
  honeypot: string,
  clientIp?: string
): Promise<{ success: boolean; auditId?: string; error?: string }> {
  // Honeypot check
  if (honeypot && honeypot.length > 0) {
    return { success: false, error: "Bot detected" };
  }

  // Rate limit
  if (clientIp && !checkRateLimit(clientIp)) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  // Validate
  if (!formData.tools || formData.tools.length === 0) {
    return { success: false, error: "Please add at least one tool." };
  }

  if (formData.teamSize < 1 || formData.teamSize > 10000) {
    return { success: false, error: "Invalid team size." };
  }

  const recommendations = runAudit(formData);
  const { totalMonthlySavings, totalAnnualSavings } = calcTotals(recommendations);
  const aiSummary = await generateAISummary(formData, recommendations, totalMonthlySavings);

  try {
    const auditId = uuidv4();
    const db = getServiceSupabase();

    const { error } = await db.from("audits").insert({
      id: auditId,
      form_data: formData,
      recommendations,
      total_monthly_savings: totalMonthlySavings,
      total_annual_savings: totalAnnualSavings,
      ai_summary: aiSummary,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        success: false,
        error: `Failed to save audit: ${error.message}`,
      };
    }

    return { success: true, auditId };
  } catch (err) {
    console.error("Audit submission error:", err);
    if (err instanceof Error && err.message.includes("Supabase")) {
      return {
        success: false,
        error: "Server is missing Supabase environment variables.",
      };
    }

    return { success: false, error: "Failed to save audit. Please try again." };
  }
}

// ─── Capture lead ─────────────────────────────────────────────────────────────
export async function captureLead(
  leadData: LeadData,
  honeypot: string
): Promise<{ success: boolean; error?: string }> {
  if (honeypot && honeypot.length > 0) {
    return { success: false, error: "Bot detected" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(leadData.email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const db = getServiceSupabase();

    const { error } = await db.from("leads").insert({
      email: leadData.email,
      company: leadData.company || null,
      role: leadData.role || null,
      audit_id: leadData.auditId,
      created_at: new Date().toISOString(),
    });

    if (error && error.code !== "23505") {
      // 23505 = unique violation (email already submitted)
      console.error("Lead capture error:", error);
      return { success: false, error: "Failed to save. Please try again." };
    }

    // Send confirmation email via Resend
    await sendConfirmationEmail(leadData.email);

    return { success: true };
  } catch (err) {
    console.error("Lead capture error:", err);
    return { success: false, error: "Something went wrong." };
  }
}

async function sendConfirmationEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "audit@credex.ai";

  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: "Your AI Spend Audit is ready",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #111;">
            <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Your audit results are saved ✓</h2>
            <p style="color: #444; line-height: 1.6;">
              Thanks for running an AI Spend Audit. Your personalized recommendations are available at your shareable link anytime.
            </p>
            <p style="color: #444; line-height: 1.6;">
              If your team could benefit from hands-on help reducing AI costs, the Credex team is happy to take a deeper look — no commitment required.
            </p>
            <a href="https://credex.ai" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #0f172a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Visit Credex →
            </a>
            <p style="margin-top: 32px; font-size: 13px; color: #999;">You're receiving this because you submitted an audit at spendaudit.credex.ai</p>
          </div>
        `,
      }),
    });
  } catch {
    // Email failure is non-blocking
    console.error("Resend email failed — non-blocking");
  }
}
