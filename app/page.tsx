// app/page.tsx
import Link from "next/link";
import { ArrowRight, BarChart3, Zap, Shield, CheckCircle2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORTED_TOOLS = [
  "Cursor", "GitHub Copilot", "ChatGPT", "Claude",
  "Anthropic API", "OpenAI API", "Gemini", "Windsurf",
];

const STATS = [
  { value: "$840", label: "avg. monthly savings found", sublabel: "per team audit" },
  { value: "2 min", label: "to complete the audit", sublabel: "no signup needed" },
  { value: "100%", label: "free to run", sublabel: "no credit card" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter your AI tools",
    desc: "Add each tool your team pays for — plan, seats, and monthly cost. Takes about 2 minutes.",
  },
  {
    step: "02",
    title: "Our engine finds waste",
    desc: "Rule-based audit logic checks for plan mismatches, seat bloat, and tool overlaps specific to your team size.",
  },
  {
    step: "03",
    title: "Get your savings report",
    desc: "Receive a shareable report with per-tool recommendations and exact dollar savings — no fluff.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <TrendingDown className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Credex Audit</span>
          </div>
          <Link href="/audit">
            <Button size="sm">
              Start free audit <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-slate-50 to-white px-6 py-20 text-center">
        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(220 20% 8%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 20% 8%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Free for teams — no account required
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Your team is probably
            <br />
            <span className="text-slate-400">overpaying for AI tools.</span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
            The average startup wastes{" "}
            <strong className="text-foreground">$840/month</strong> on redundant
            AI subscriptions and wrong-sized plans. This audit tells you exactly
            where — in 2 minutes.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/audit">
              <Button size="lg" className="gap-2 px-8">
                Run my free audit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              No signup. No credit card. Shareable results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/50 bg-white px-6 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-4xl font-bold tracking-tight text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported tools */}
      <section className="border-b border-border/50 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Audits tools including
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUPPORTED_TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-foreground shadow-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border/50 bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-3 font-mono text-4xl font-bold text-border">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we check */}
      <section className="border-b border-border/50 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            What the audit checks
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Rule-based logic built on real vendor pricing — not guesswork.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: BarChart3,
                title: "Plan right-sizing",
                desc: "Flags when you're on Business/Enterprise tiers that don't justify the premium for your seat count.",
              },
              {
                icon: Zap,
                title: "Tool overlap detection",
                desc: "Catches paying for Cursor + Copilot + Windsurf simultaneously — common in fast-growing teams.",
              },
              {
                icon: Shield,
                title: "API spend analysis",
                desc: "Identifies runaway API costs and suggests caching strategies or model downgrades.",
              },
              {
                icon: CheckCircle2,
                title: "Seat utilization",
                desc: "Spots seat-to-team-size mismatches that inflate your bill without delivering value.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <item.icon className="h-4.5 w-4.5 text-foreground" />
                </div>
                <h3 className="mb-1.5 font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-background">
            Find out what you&apos;re leaving on the table
          </h2>
          <p className="mb-8 text-slate-400">
            Takes 2 minutes. Results are instant, shareable, and free.
          </p>
          <Link href="/audit">
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              Start your free audit <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
              <TrendingDown className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="text-sm font-semibold">Credex</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Credex. All pricing data is approximate and for estimation only.
          </p>
        </div>
      </footer>
    </div>
  );
}
