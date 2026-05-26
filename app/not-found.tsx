// app/not-found.tsx
import Link from "next/link";
import { TrendingDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
        <TrendingDown className="h-6 w-6 text-background" />
      </div>
      <div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mt-2 text-muted-foreground">
          This audit wasn&apos;t found — it may have been deleted or the link is incorrect.
        </p>
      </div>
      <Link href="/">
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4" /> Go home
        </Button>
      </Link>
    </div>
  );
}
