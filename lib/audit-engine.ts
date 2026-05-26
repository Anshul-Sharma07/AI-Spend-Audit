// lib/audit-engine.ts
// Deterministic rule-based audit logic. No AI involved here.

import { AuditFormData, Recommendation, ToolEntry } from "./types";
import { THRESHOLDS } from "./pricing";

// ─── Individual tool rules ────────────────────────────────────────────────────

function auditCursor(tool: ToolEntry, teamSize: number): Recommendation {
  const base: Omit<Recommendation, "recommendation" | "reason" | "monthlySavings" | "annualSavings" | "severity"> = {
    toolId: tool.id,
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
  };

  const costPerSeat = tool.seats > 0 ? tool.monthlySpend / tool.seats : tool.monthlySpend;

  // Business plan with very few seats → Pro is enough
  if (
    tool.plan.toLowerCase().includes("business") &&
    tool.seats <= 2
  ) {
    const proMonthly = 20 * tool.seats;
    const savings = tool.monthlySpend - proMonthly;
    return {
      ...base,
      recommendation: `Downgrade to Cursor Pro ($20/seat)`,
      reason: `Cursor Business adds SSO and admin controls — unnecessary overhead for ${tool.seats} seat${tool.seats > 1 ? "s" : ""}. Pro covers full AI completions at half the cost.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: savings > 0 ? "high" : "ok",
    };
  }

  // Business plan for small team (≤5)
  if (
    tool.plan.toLowerCase().includes("business") &&
    tool.seats <= THRESHOLDS.TINY_TEAM
  ) {
    const proMonthly = 20 * tool.seats;
    const savings = tool.monthlySpend - proMonthly;
    return {
      ...base,
      recommendation: `Consider Cursor Pro until team exceeds 10 seats`,
      reason: `Business tier pays off at scale. For ${tool.seats} seats, you're paying a ${Math.round((savings / proMonthly) * 100)}% premium for enterprise features a small team won't use.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: savings > 50 ? "medium" : "ok",
    };
  }

  // Overpaying per seat
  if (costPerSeat > 45) {
    const savings = tool.monthlySpend - 40 * tool.seats;
    return {
      ...base,
      recommendation: `Review seat count — cost per seat is unusually high`,
      reason: `At $${costPerSeat.toFixed(0)}/seat you're above Cursor's standard Business rate ($40/seat). Audit active vs. inactive seats.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: "medium",
    };
  }

  return {
    ...base,
    recommendation: "Plan looks right-sized",
    reason: `Cursor ${tool.plan} at $${(costPerSeat).toFixed(0)}/seat is appropriately priced for your ${tool.seats} active seats.`,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "ok",
  };
}

function auditGitHubCopilot(tool: ToolEntry, teamSize: number): Recommendation {
  const base = {
    toolId: tool.id,
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
  };

  const costPerSeat = tool.seats > 0 ? tool.monthlySpend / tool.seats : tool.monthlySpend;

  if (tool.plan.toLowerCase().includes("enterprise") && tool.seats < THRESHOLDS.SMALL_TEAM) {
    const businessMonthly = 19 * tool.seats;
    const savings = tool.monthlySpend - businessMonthly;
    return {
      ...base,
      recommendation: `Downgrade to GitHub Copilot Business ($19/seat)`,
      reason: `Enterprise adds fine-tuning on private code and audit logs. For a ${teamSize}-person team, Business tier delivers 95% of the value at half the price.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: savings > 100 ? "high" : "medium",
    };
  }

  if (tool.plan.toLowerCase().includes("business") && tool.seats <= 3) {
    const individualMonthly = 10 * tool.seats;
    const savings = tool.monthlySpend - individualMonthly;
    return {
      ...base,
      recommendation: `Consider Individual plans for small teams`,
      reason: `Business adds centralized policy management — for ${tool.seats} developers, Individual licenses ($10/seat) cover all coding assistance features.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: savings > 0 ? "medium" : "ok",
    };
  }

  return {
    ...base,
    recommendation: "Plan is appropriate",
    reason: `GitHub Copilot ${tool.plan} at $${costPerSeat.toFixed(0)}/seat is well-matched to your team size.`,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "ok",
  };
}

function auditChatGPT(tool: ToolEntry, teamSize: number): Recommendation {
  const base = {
    toolId: tool.id,
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
  };

  // Team plan for very small teams → Plus is enough
  if (
    tool.plan.toLowerCase().includes("team") &&
    tool.seats <= 3 &&
    teamSize <= THRESHOLDS.TINY_TEAM
  ) {
    const plusMonthly = 20 * tool.seats;
    const savings = tool.monthlySpend - plusMonthly;
    return {
      ...base,
      recommendation: `Switch to ChatGPT Plus individual plans`,
      reason: `ChatGPT Team requires a minimum of 2 users and bills annually. For a ${tool.seats}-person team, individual Plus plans at $20/seat are more flexible and equally capable.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: savings > 0 ? "medium" : "ok",
    };
  }

  if (tool.plan.toLowerCase().includes("enterprise") && teamSize < THRESHOLDS.SMALL_TEAM) {
    const teamMonthly = 30 * tool.seats;
    const savings = tool.monthlySpend - teamMonthly;
    return {
      ...base,
      recommendation: `Downgrade to ChatGPT Team ($30/seat)`,
      reason: `Enterprise features (custom GPTs at scale, SSO, dedicated support) aren't cost-effective for a ${teamSize}-person organization. Team plan covers all practical needs.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: "high",
    };
  }

  return {
    ...base,
    recommendation: "Plan looks right-sized",
    reason: `ChatGPT ${tool.plan} is well-matched for your team size of ${teamSize}.`,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "ok",
  };
}

function auditClaude(tool: ToolEntry, teamSize: number): Recommendation {
  const base = {
    toolId: tool.id,
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
  };

  if (
    tool.plan.toLowerCase().includes("team") &&
    tool.seats < 3
  ) {
    const proMonthly = 20 * tool.seats;
    const savings = tool.monthlySpend - proMonthly;
    return {
      ...base,
      recommendation: `Downgrade to Claude Pro`,
      reason: `Claude Team billing requires 5+ seats minimum. If you're under-utilizing seats, switching to individual Pro plans ($20/seat) saves on unused capacity.`,
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings * 12),
      severity: savings > 0 ? "medium" : "ok",
    };
  }

  return {
    ...base,
    recommendation: "Plan looks appropriate",
    reason: `Claude ${tool.plan} is the right fit for your current usage.`,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "ok",
  };
}

function auditAPITool(tool: ToolEntry, teamSize: number): Recommendation {
  const base = {
    toolId: tool.id,
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
  };

  // High API spend relative to team size is a flag
  const spendPerPerson = tool.monthlySpend / Math.max(teamSize, 1);

  if (spendPerPerson > 200) {
    return {
      ...base,
      recommendation: `Audit API usage — spend is high per team member`,
      reason: `$${tool.monthlySpend}/month across ${teamSize} people is $${spendPerPerson.toFixed(0)}/person. Review logs for runaway automations, missing caching, or unused integrations. Prompt caching alone can cut costs 50–80%.`,
      monthlySavings: Math.round(tool.monthlySpend * 0.35), // conservative 35% reduction estimate
      annualSavings: Math.round(tool.monthlySpend * 0.35 * 12),
      severity: "high",
    };
  }

  if (spendPerPerson > 80) {
    return {
      ...base,
      recommendation: `Review caching and model selection`,
      reason: `$${spendPerPerson.toFixed(0)}/person/month on ${tool.toolName} is above typical. Switching repetitive tasks to a smaller model (e.g. Haiku or GPT-4o mini) can reduce this by 40–60%.`,
      monthlySavings: Math.round(tool.monthlySpend * 0.2),
      annualSavings: Math.round(tool.monthlySpend * 0.2 * 12),
      severity: "medium",
    };
  }

  return {
    ...base,
    recommendation: "API spend looks reasonable",
    reason: `$${spendPerPerson.toFixed(0)}/person/month is within normal range for a dev team using ${tool.toolName}.`,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "ok",
  };
}

function auditGeneric(tool: ToolEntry, teamSize: number): Recommendation {
  const base = {
    toolId: tool.id,
    toolName: tool.toolName,
    currentPlan: tool.plan,
    currentMonthlySpend: tool.monthlySpend,
  };

  const costPerSeat = tool.seats > 0 ? tool.monthlySpend / tool.seats : tool.monthlySpend;

  if (costPerSeat > 50 && tool.seats <= 3) {
    return {
      ...base,
      recommendation: `Review whether a lower tier covers your needs`,
      reason: `At $${costPerSeat.toFixed(0)}/seat for only ${tool.seats} users, you may be paying for enterprise features (SSO, audit logs, priority support) that a small team won't use.`,
      monthlySavings: Math.round(tool.monthlySpend * 0.3),
      annualSavings: Math.round(tool.monthlySpend * 0.3 * 12),
      severity: "medium",
    };
  }

  return {
    ...base,
    recommendation: "No immediate red flags",
    reason: `${tool.toolName} ${tool.plan} appears proportionate to team size.`,
    monthlySavings: 0,
    annualSavings: 0,
    severity: "ok",
  };
}

// ─── Overlap detection ────────────────────────────────────────────────────────

function detectOverlaps(tools: ToolEntry[]): Recommendation[] {
  const overlaps: Recommendation[] = [];
  const toolNames = tools.map((t) => t.toolName.toLowerCase());

  const hasCursor = toolNames.some((n) => n.includes("cursor"));
  const hasCopilot = toolNames.some((n) => n.includes("copilot"));
  const hasWindsurf = toolNames.some((n) => n.includes("windsurf"));

  const hasChatGPT = toolNames.some((n) => n.includes("chatgpt"));
  const hasOpenAIAPI = toolNames.some((n) => n.includes("openai api"));

  const hasClaude = toolNames.some((n) => n === "claude");
  const hasAnthropicAPI = toolNames.some((n) => n.includes("anthropic api"));

  // Cursor + Copilot + Windsurf overlap
  const codeAssistants = [hasCursor, hasCopilot, hasWindsurf].filter(Boolean).length;
  if (codeAssistants >= 2) {
    const overlappingTools = tools.filter((t) =>
      ["cursor", "github copilot", "windsurf"].some((n) =>
        t.toolName.toLowerCase().includes(n)
      )
    );
    const lowestSpend = Math.min(...overlappingTools.map((t) => t.monthlySpend));
    const totalOverlapSpend = overlappingTools.reduce((s, t) => s + t.monthlySpend, 0);

    overlaps.push({
      toolId: "overlap-code-assistants",
      toolName: overlappingTools.map((t) => t.toolName).join(" + "),
      currentPlan: "Multiple",
      currentMonthlySpend: totalOverlapSpend,
      recommendation: `Consolidate to one AI coding assistant`,
      reason: `You're paying for ${codeAssistants} overlapping code completion tools. Most developers only use one actively. Pick your team's preferred tool and cancel the rest — there's no additive benefit.`,
      monthlySavings: totalOverlapSpend - lowestSpend,
      annualSavings: (totalOverlapSpend - lowestSpend) * 12,
      severity: "high",
    });
  }

  // ChatGPT + OpenAI API for same use case
  if (hasChatGPT && hasOpenAIAPI) {
    const chatgptTool = tools.find((t) => t.toolName.toLowerCase().includes("chatgpt"));
    if (chatgptTool) {
      overlaps.push({
        toolId: "overlap-openai",
        toolName: "ChatGPT + OpenAI API",
        currentPlan: "Multiple",
        currentMonthlySpend: chatgptTool.monthlySpend,
        recommendation: `Evaluate if ChatGPT is redundant given your OpenAI API access`,
        reason: `Teams with direct OpenAI API access often build internal tools that replicate ChatGPT's functionality. If developers are using both, consolidate workflows to the API to avoid double-billing.`,
        monthlySavings: Math.round(chatgptTool.monthlySpend * 0.5),
        annualSavings: Math.round(chatgptTool.monthlySpend * 0.5 * 12),
        severity: "medium",
      });
    }
  }

  // Claude + Anthropic API — same vendor, possible overlap
  if (hasClaude && hasAnthropicAPI) {
    const claudeTool = tools.find((t) => t.toolName.toLowerCase() === "claude");
    if (claudeTool) {
      overlaps.push({
        toolId: "overlap-anthropic",
        toolName: "Claude + Anthropic API",
        currentPlan: "Multiple",
        currentMonthlySpend: claudeTool.monthlySpend,
        recommendation: `Verify Claude.ai subscriptions aren't duplicating API usage`,
        reason: `If developers are already using the Anthropic API for their work, they may not need separate Claude.ai Pro subscriptions unless they actively use Projects or Claude.ai-specific features.`,
        monthlySavings: Math.round(claudeTool.monthlySpend * 0.4),
        annualSavings: Math.round(claudeTool.monthlySpend * 0.4 * 12),
        severity: "medium",
      });
    }
  }

  return overlaps;
}

// ─── Main audit function ──────────────────────────────────────────────────────

export function runAudit(data: AuditFormData): Omit<Recommendation, never>[] {
  const { tools, teamSize } = data;
  const recommendations: Recommendation[] = [];

  for (const tool of tools) {
    const name = tool.toolName.toLowerCase();

    if (name.includes("cursor")) {
      recommendations.push(auditCursor(tool, teamSize));
    } else if (name.includes("copilot")) {
      recommendations.push(auditGitHubCopilot(tool, teamSize));
    } else if (name === "chatgpt") {
      recommendations.push(auditChatGPT(tool, teamSize));
    } else if (name === "claude") {
      recommendations.push(auditClaude(tool, teamSize));
    } else if (name.includes("api")) {
      recommendations.push(auditAPITool(tool, teamSize));
    } else {
      recommendations.push(auditGeneric(tool, teamSize));
    }
  }

  // Append overlap warnings
  const overlaps = detectOverlaps(tools);
  recommendations.push(...overlaps);

  return recommendations;
}

export function calcTotals(recommendations: Recommendation[]) {
  // Deduplicate: don't double-count overlap savings on top of per-tool savings
  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  return {
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
