// lib/types.ts

export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API"
  | "OpenAI API"
  | "Gemini"
  | "Windsurf";

export interface ToolEntry {
  id: string;
  toolName: ToolName | string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: string;
}

export interface Recommendation {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendation: string;
  reason: string;
  monthlySavings: number;
  annualSavings: number;
  severity: "high" | "medium" | "low" | "ok";
}

export interface AuditResult {
  id: string;
  formData: AuditFormData;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  createdAt: string;
}

export interface LeadData {
  email: string;
  company?: string;
  role?: string;
  auditId: string;
}
