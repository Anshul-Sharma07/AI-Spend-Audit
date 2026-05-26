// app/audit/layout.tsx
import Link from "next/link";
import { TrendingDown } from "lucide-react";

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <TrendingDown className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Credex Audit</span>
          </Link>
          <span className="text-sm text-muted-foreground">Free · No signup</span>
        </div>
      </nav>
      {children}
    </div>
  );
}
