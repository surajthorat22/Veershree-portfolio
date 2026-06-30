import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function QueryLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

export function QueryError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-card border border-destructive/30 p-8 text-center">
      <AlertCircle className="mx-auto text-destructive mb-4" size={28} strokeWidth={1.4} />
      <p className="text-coffee-deep font-serif text-xl">Unable to load data</p>
      <p className="text-sm text-coffee mt-2">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 bg-coffee-deep text-cream px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee transition"
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}

export function QueryEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card border border-border p-16 text-center">
      <h3 className="font-serif text-2xl text-coffee-deep">{title}</h3>
      <p className="text-coffee mt-2 text-sm">{description}</p>
    </div>
  );
}
