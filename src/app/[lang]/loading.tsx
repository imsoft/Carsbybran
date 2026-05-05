export default function Loading() {
  return (
    <div className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 py-10 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded-md mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
