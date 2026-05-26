// lib/pricing.ts
// Centralized pricing reference — update here when vendors change plans

export interface PlanInfo {
  name: string;
  monthlyPerSeat: number;
  minSeats?: number;
  notes?: string;
}

export const TOOL_PRICING: Record<string, PlanInfo[]> = {
  Cursor: [
    { name: "Hobby", monthlyPerSeat: 0, notes: "Free tier, limited usage" },
    { name: "Pro", monthlyPerSeat: 20, notes: "Unlimited completions" },
    {
      name: "Business",
      monthlyPerSeat: 40,
      minSeats: 1,
      notes: "SSO, admin controls, privacy mode",
    },
  ],
  "GitHub Copilot": [
    { name: "Individual", monthlyPerSeat: 10 },
    { name: "Business", monthlyPerSeat: 19 },
    { name: "Enterprise", monthlyPerSeat: 39 },
  ],
  Claude: [
    { name: "Free", monthlyPerSeat: 0 },
    { name: "Pro", monthlyPerSeat: 20 },
    { name: "Team", monthlyPerSeat: 30, minSeats: 5 },
  ],
  ChatGPT: [
    { name: "Free", monthlyPerSeat: 0 },
    { name: "Plus", monthlyPerSeat: 20 },
    { name: "Team", monthlyPerSeat: 30, minSeats: 2 },
    { name: "Enterprise", monthlyPerSeat: 60, notes: "Estimated average" },
  ],
  "Anthropic API": [
    { name: "Pay-as-you-go", monthlyPerSeat: 0, notes: "Usage-based billing" },
  ],
  "OpenAI API": [
    { name: "Pay-as-you-go", monthlyPerSeat: 0, notes: "Usage-based billing" },
  ],
  Gemini: [
    { name: "Free", monthlyPerSeat: 0 },
    { name: "Advanced", monthlyPerSeat: 20 },
    {
      name: "Business",
      monthlyPerSeat: 24,
      notes: "Google Workspace add-on",
    },
  ],
  Windsurf: [
    { name: "Free", monthlyPerSeat: 0 },
    { name: "Pro", monthlyPerSeat: 15 },
    { name: "Team", monthlyPerSeat: 35 },
  ],
};

// Thresholds for rule evaluation
export const THRESHOLDS = {
  TINY_TEAM: 5,
  SMALL_TEAM: 15,
  MEDIUM_TEAM: 30,
  HIGH_SAVINGS_THRESHOLD: 500, // monthly $ — show Credex CTA
  API_OVERSPEND_MULTIPLIER: 3, // flag if API spend looks > 3x reasonable usage
} as const;
