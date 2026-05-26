// lib/ai-summary.ts
import Anthropic from "@anthropic-ai/sdk";
import { AuditFormData, Recommendation } from "./types";

function buildFallbackSummary(
  data: AuditFormData,
  recommendations: Recommendation[],
  totalMonthlySavings: number
): string {
  const highSeverity = recommendations.filter((r) => r.severity === "high").length;
  const toolCount = data.tools.length;

  if (totalMonthlySavings === 0) {
    return `Your team of ${data.teamSize} is running a lean AI stack across ${toolCount} tool${toolCount > 1 ? "s" : ""}. Current spending appears well-optimized for your scale. As your team grows, revisit enterprise tier thresholds — the math changes significantly above 15–20 seats.`;
  }

  const savings = `$${totalMonthlySavings.toLocaleString()}/month ($${(totalMonthlySavings * 12).toLocaleString()}/year)`;

  if (highSeverity > 0) {
    return `Your ${data.teamSize}-person team is leaving real money on the table. This audit identified ${highSeverity} high-priority optimization${highSeverity > 1 ? "s" : ""} across your ${toolCount} AI tools, with potential savings of ${savings}. The biggest wins come from right-sizing plans to actual usage — a common blind spot for fast-moving teams where tool subscriptions accumulate faster than reviews happen.`;
  }

  return `This audit flagged several moderate opportunities across your ${toolCount} AI tools. Your team of ${data.teamSize} could recover ${savings} by aligning plans with actual usage patterns. Most of these fixes take less than 30 minutes to implement through vendor admin portals.`;
}

export async function generateAISummary(
  data: AuditFormData,
  recommendations: Recommendation[],
  totalMonthlySavings: number
): Promise<string> {
  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const toolList = data.tools
      .map((t) => `${t.toolName} (${t.plan}, $${t.monthlySpend}/mo, ${t.seats} seats)`)
      .join(", ");

    const recList = recommendations
      .filter((r) => r.monthlySavings > 0)
      .map((r) => `${r.toolName}: ${r.recommendation} (saves $${r.monthlySavings}/mo)`)
      .join("; ");

    const prompt = `You are a financial analyst writing a concise audit summary for a startup. Write exactly 2–3 sentences (around 80–100 words total). Be specific, financially grounded, and direct. No filler phrases like "In today's competitive landscape."

Team size: ${data.teamSize}
Primary use case: ${data.primaryUseCase}
Tools: ${toolList}
Key findings: ${recList || "No major savings found — stack is lean"}
Total potential monthly savings: $${totalMonthlySavings}

Write a personalized summary paragraph for this team.`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type === "text" && content.text.trim().length > 20) {
      return content.text.trim();
    }

    return buildFallbackSummary(data, recommendations, totalMonthlySavings);
  } catch {
    // API unavailable — use deterministic fallback
    return buildFallbackSummary(data, recommendations, totalMonthlySavings);
  }
}
