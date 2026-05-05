export default function Loading() {
  return (
    <div className="flex-1 animate-pulse">
      <div className="w-full aspect-21/9 max-h-[480px] bg-muted" />
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
            <div className="h-20 bg-muted rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${75 + Math.random() * 25}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded-xl" />
            <div className="h-48 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
