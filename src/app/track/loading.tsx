export default function TrackLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="h-16 bg-black/95 border-b border-[#FFD700]/20" />

      <main className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back link skeleton */}
          <div className="h-5 w-32 bg-zinc-800/50 rounded mb-8 animate-pulse" />

          {/* Title skeleton */}
          <div className="text-center mb-10">
            <div className="h-10 w-64 bg-zinc-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-80 max-w-full bg-zinc-800/50 rounded mx-auto animate-pulse" />
          </div>

          {/* Search form skeleton */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 h-14 bg-zinc-900 rounded-lg animate-pulse" />
            <div className="h-14 w-28 bg-zinc-800 rounded-lg animate-pulse" />
          </div>

          {/* Demo references skeleton */}
          <div className="bg-zinc-900/50 border border-[#FFD700]/10 rounded-lg p-4 mb-8">
            <div className="h-4 w-32 bg-zinc-800/50 rounded mb-3 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-28 bg-zinc-800 rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Help text skeleton */}
          <div className="text-center py-8">
            <div className="h-4 w-72 bg-zinc-800/30 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-zinc-800/30 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
