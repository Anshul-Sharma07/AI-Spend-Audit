// __tests__/audit-engine.test.ts
import { describe, it, expect } from "vitest";
import { runAudit, calcTotals } from "@/lib/audit-engine";
import { AuditFormData, ToolEntry } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

function makeTool(overrides: Partial<ToolEntry>): ToolEntry {
  return {
    id: uuidv4(),
    toolName: "Cursor",
    plan: "Pro",
    monthlySpend: 20,
    seats: 1,
    ...overrides,
  };
}

function makeFormData(tools: ToolEntry[], teamSize = 5): AuditFormData {
  return { tools, teamSize, primaryUseCase: "Software development" };
}

// ─── Cursor rules ─────────────────────────────────────────────────────────────

describe("Cursor audit rules", () => {
  it("flags Business plan with 1 seat as high priority", () => {
    const tool = makeTool({ toolName: "Cursor", plan: "Business", monthlySpend: 40, seats: 1 });
    const recs = runAudit(makeFormData([tool]));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("high");
    expect(rec.monthlySavings).toBe(20); // 40 - (20 * 1)
    expect(rec.annualSavings).toBe(240);
    expect(rec.recommendation).toContain("Pro");
  });

  it("flags Business plan with 2 seats — saves $40/mo", () => {
    const tool = makeTool({ toolName: "Cursor", plan: "Business", monthlySpend: 80, seats: 2 });
    const recs = runAudit(makeFormData([tool]));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("high");
    expect(rec.monthlySavings).toBe(40); // 80 - (20 * 2)
  });

  it("does not flag Cursor Pro at correct pricing", () => {
    const tool = makeTool({ toolName: "Cursor", plan: "Pro", monthlySpend: 100, seats: 5 });
    const recs = runAudit(makeFormData([tool], 10));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("ok");
    expect(rec.monthlySavings).toBe(0);
  });
});

// ─── ChatGPT rules ────────────────────────────────────────────────────────────

describe("ChatGPT audit rules", () => {
  it("recommends Plus over Team for tiny team with ≤3 seats", () => {
    const tool = makeTool({
      toolName: "ChatGPT",
      plan: "Team",
      monthlySpend: 90,
      seats: 3,
    });
    const recs = runAudit(makeFormData([tool], 3));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("medium");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.recommendation).toContain("Plus");
  });

  it("flags ChatGPT Enterprise for small team", () => {
    const tool = makeTool({
      toolName: "ChatGPT",
      plan: "Enterprise",
      monthlySpend: 600,
      seats: 10,
    });
    const recs = runAudit(makeFormData([tool], 10));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("high");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.recommendation).toContain("Team");
  });

  it("does not flag ChatGPT Plus — it's the minimal plan", () => {
    const tool = makeTool({ toolName: "ChatGPT", plan: "Plus", monthlySpend: 20, seats: 1 });
    const recs = runAudit(makeFormData([tool], 5));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("ok");
    expect(rec.monthlySavings).toBe(0);
  });
});

// ─── GitHub Copilot rules ─────────────────────────────────────────────────────

describe("GitHub Copilot audit rules", () => {
  it("flags Enterprise plan for small team — recommends Business", () => {
    const tool = makeTool({
      toolName: "GitHub Copilot",
      plan: "Enterprise",
      monthlySpend: 390,
      seats: 10,
    });
    const recs = runAudit(makeFormData([tool], 10));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toMatch(/high|medium/);
    expect(rec.recommendation).toContain("Business");
    expect(rec.monthlySavings).toBe(200); // 390 - (19 * 10)
  });

  it("flags Business plan for 2 seats — Individual is cheaper", () => {
    const tool = makeTool({
      toolName: "GitHub Copilot",
      plan: "Business",
      monthlySpend: 38,
      seats: 2,
    });
    const recs = runAudit(makeFormData([tool], 3));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("medium");
    expect(rec.monthlySavings).toBe(18); // 38 - (10 * 2)
  });
});

// ─── API spend rules ──────────────────────────────────────────────────────────

describe("API spend rules", () => {
  it("flags high OpenAI API spend per person", () => {
    const tool = makeTool({
      toolName: "OpenAI API",
      plan: "Pay-as-you-go",
      monthlySpend: 2000,
      seats: 1,
    });
    const recs = runAudit(makeFormData([tool], 5));
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("high");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.reason).toContain("cach");
  });

  it("flags moderate Anthropic API spend with medium severity", () => {
    const tool = makeTool({
      toolName: "Anthropic API",
      plan: "Pay-as-you-go",
      monthlySpend: 500,
      seats: 1,
    });
    const recs = runAudit(makeFormData([tool], 5)); // $100/person
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("medium");
  });

  it("does not flag low API spend", () => {
    const tool = makeTool({
      toolName: "OpenAI API",
      plan: "Pay-as-you-go",
      monthlySpend: 100,
      seats: 1,
    });
    const recs = runAudit(makeFormData([tool], 10)); // $10/person
    const rec = recs.find((r) => r.toolId === tool.id)!;

    expect(rec.severity).toBe("ok");
    expect(rec.monthlySavings).toBe(0);
  });
});

// ─── Overlap detection ────────────────────────────────────────────────────────

describe("Tool overlap detection", () => {
  it("detects Cursor + GitHub Copilot overlap as high priority", () => {
    const cursor = makeTool({ toolName: "Cursor", plan: "Pro", monthlySpend: 100, seats: 5 });
    const copilot = makeTool({
      toolName: "GitHub Copilot",
      plan: "Business",
      monthlySpend: 95,
      seats: 5,
    });
    const recs = runAudit(makeFormData([cursor, copilot], 5));
    const overlapRec = recs.find((r) => r.toolId === "overlap-code-assistants");

    expect(overlapRec).toBeDefined();
    expect(overlapRec!.severity).toBe("high");
    // Savings = total (195) - lowest (95) = 100
    expect(overlapRec!.monthlySavings).toBe(100);
  });

  it("detects triple code assistant overlap", () => {
    const cursor = makeTool({ toolName: "Cursor", plan: "Pro", monthlySpend: 100, seats: 5 });
    const copilot = makeTool({ toolName: "GitHub Copilot", plan: "Business", monthlySpend: 95, seats: 5 });
    const windsurf = makeTool({ toolName: "Windsurf", plan: "Pro", monthlySpend: 75, seats: 5 });
    const recs = runAudit(makeFormData([cursor, copilot, windsurf], 5));
    const overlapRec = recs.find((r) => r.toolId === "overlap-code-assistants");

    expect(overlapRec).toBeDefined();
    // Total 270, min 75, savings = 195
    expect(overlapRec!.monthlySavings).toBe(195);
  });

  it("does not flag a single code assistant", () => {
    const cursor = makeTool({ toolName: "Cursor", plan: "Pro", monthlySpend: 100, seats: 5 });
    const recs = runAudit(makeFormData([cursor], 5));
    const overlapRec = recs.find((r) => r.toolId === "overlap-code-assistants");

    expect(overlapRec).toBeUndefined();
  });

  it("detects ChatGPT + OpenAI API overlap", () => {
    const chatgpt = makeTool({ toolName: "ChatGPT", plan: "Team", monthlySpend: 150, seats: 5 });
    const api = makeTool({ toolName: "OpenAI API", plan: "Pay-as-you-go", monthlySpend: 300, seats: 1 });
    const recs = runAudit(makeFormData([chatgpt, api], 5));
    const overlapRec = recs.find((r) => r.toolId === "overlap-openai");

    expect(overlapRec).toBeDefined();
    expect(overlapRec!.severity).toBe("medium");
  });
});

// ─── calcTotals ───────────────────────────────────────────────────────────────

describe("calcTotals", () => {
  it("sums monthly savings correctly", () => {
    const recs = [
      { monthlySavings: 100, annualSavings: 1200 } as any,
      { monthlySavings: 50, annualSavings: 600 } as any,
      { monthlySavings: 0, annualSavings: 0 } as any,
    ];
    const { totalMonthlySavings, totalAnnualSavings } = calcTotals(recs);

    expect(totalMonthlySavings).toBe(150);
    expect(totalAnnualSavings).toBe(1800);
  });

  it("returns zeros when no savings exist", () => {
    const recs = [{ monthlySavings: 0, annualSavings: 0 } as any];
    const { totalMonthlySavings, totalAnnualSavings } = calcTotals(recs);

    expect(totalMonthlySavings).toBe(0);
    expect(totalAnnualSavings).toBe(0);
  });
});
