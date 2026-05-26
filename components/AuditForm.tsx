// components/AuditForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAudit } from "@/lib/actions";
import { AuditFormData, ToolEntry, ToolName } from "@/lib/types";
import { TOOL_PRICING } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const TOOL_NAMES: ToolName[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
];

const USE_CASES = [
  "Software development",
  "Content & marketing",
  "Data & analytics",
  "Customer support",
  "Research",
  "Mixed / general",
];

const STORAGE_KEY = "credex-audit-form";

function getDefaultTool(): ToolEntry {
  return {
    id: uuidv4(),
    toolName: "",
    plan: "",
    monthlySpend: 0,
    seats: 1,
  };
}

function getPlansForTool(toolName: string): string[] {
  const pricing = TOOL_PRICING[toolName];
  if (!pricing) return ["Free", "Starter", "Pro", "Business", "Enterprise"];
  return pricing.map((p) => p.name);
}

// Native select styled to match design system — zero z-index issues
function NativeSelect({
  value,
  onChange,
  placeholder,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-9 text-sm",
          "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export default function AuditForm() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolEntry[]>([getDefaultTool()]);
  const [teamSize, setTeamSize] = useState<number>(5);
  const [primaryUseCase, setPrimaryUseCase] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AuditFormData = JSON.parse(saved);
        if (parsed.tools?.length > 0) setTools(parsed.tools);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.primaryUseCase) setPrimaryUseCase(parsed.primaryUseCase);
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((data: AuditFormData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    persist({ tools, teamSize, primaryUseCase });
  }, [tools, teamSize, primaryUseCase, persist]);

  function addTool() {
    setTools((prev) => [...prev, getDefaultTool()]);
  }

  function removeTool(id: string) {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTool(id: string, field: keyof ToolEntry, value: string | number) {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, [field]: value };
        if (field === "toolName") updated.plan = "";
        return updated;
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validTools = tools.filter((t) => t.toolName && t.monthlySpend >= 0);
    if (validTools.length === 0) {
      setError("Please add at least one tool with a name and spend.");
      return;
    }
    if (!primaryUseCase) {
      setError("Please select your primary use case.");
      return;
    }

    setIsSubmitting(true);

    const result = await submitAudit(
      { tools: validTools, teamSize, primaryUseCase },
      honeypot
    );

    if (result.success && result.auditId) {
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/audit/${result.auditId}`);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  const totalMonthly = tools.reduce((s, t) => s + (Number(t.monthlySpend) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          name="website"
        />
      </div>

      {/* Team context */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Team context</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team size (people)</Label>
            <Input
              id="teamSize"
              type="number"
              min={1}
              max={10000}
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="useCase">Primary use case</Label>
            <NativeSelect
              value={primaryUseCase}
              onChange={setPrimaryUseCase}
              placeholder="Select use case…"
              options={USE_CASES.map((uc) => ({ value: uc, label: uc }))}
            />
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Your AI tools</h2>
          {totalMonthly > 0 && (
            <span className="text-sm text-muted-foreground">
              Total:{" "}
              <strong className="text-foreground">
                ${totalMonthly.toLocaleString()}/mo
              </strong>
            </span>
          )}
        </div>

        {tools.map((tool, idx) => (
          <ToolRow
            key={tool.id}
            tool={tool}
            index={idx}
            onUpdate={updateTool}
            onRemove={removeTool}
            canRemove={tools.length > 1}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addTool}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4" /> Add another tool
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Running audit…
          </>
        ) : (
          "Run my audit →"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your data is used only to generate recommendations. We don&apos;t sell or share it.
      </p>
    </form>
  );
}

// ─── Tool row ─────────────────────────────────────────────────────────────────
interface ToolRowProps {
  tool: ToolEntry;
  index: number;
  onUpdate: (id: string, field: keyof ToolEntry, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

function ToolRow({ tool, index, onUpdate, onRemove, canRemove }: ToolRowProps) {
  const plans = tool.toolName ? getPlansForTool(tool.toolName) : [];

  return (
    <div className="rounded-xl border border-border bg-white p-5 transition-colors hover:border-slate-300">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tool {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(tool.id)}
            className="text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Remove tool"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tool name */}
        <div className="space-y-1.5">
          <Label className="text-xs">Tool name</Label>
          <NativeSelect
            value={tool.toolName}
            onChange={(v) => onUpdate(tool.id, "toolName", v)}
            placeholder="Select tool…"
            options={[
              ...TOOL_NAMES.map((n) => ({ value: n, label: n })),
              { value: "Other", label: "Other" },
            ]}
          />
        </div>

        {/* Plan */}
        <div className="space-y-1.5">
          <Label className="text-xs">Current plan</Label>
          {plans.length > 0 ? (
            <NativeSelect
              value={tool.plan}
              onChange={(v) => onUpdate(tool.id, "plan", v)}
              placeholder="Select plan…"
              options={plans.map((p) => ({ value: p, label: p }))}
            />
          ) : (
            <Input
              className="h-10 text-sm"
              placeholder="e.g. Pro"
              value={tool.plan}
              onChange={(e) => onUpdate(tool.id, "plan", e.target.value)}
            />
          )}
        </div>

        {/* Monthly spend */}
        <div className="space-y-1.5">
          <Label className="text-xs">Monthly spend ($)</Label>
          <Input
            className="h-10 text-sm"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={tool.monthlySpend || ""}
            onChange={(e) =>
              onUpdate(tool.id, "monthlySpend", parseFloat(e.target.value) || 0)
            }
          />
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label className="text-xs">Seats / licenses</Label>
          <Input
            className="h-10 text-sm"
            type="number"
            min={1}
            placeholder="1"
            value={tool.seats || ""}
            onChange={(e) =>
              onUpdate(tool.id, "seats", parseInt(e.target.value) || 1)
            }
          />
        </div>
      </div>
    </div>
  );
}
