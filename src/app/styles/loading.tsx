export default function StylesLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="h-16 bg-black/95 border-b border-[#FFD700]/20" />

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Title skeleton */}
          <div className="text-center mb-10">
            <div className="h-10 w-64 bg-zinc-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-96 max-w-full bg-zinc-800/50 rounded mx-auto animate-pulse" />
          </div>

          {/* Search and filter skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 h-12 bg-zinc-900 rounded-lg animate-pulse" />
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-24 bg-zinc-900 rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 rounded-xl overflow-hidden border border-[#FFD700]/10"
              >
                <div className="aspect-[3/4] bg-zinc-800 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-zinc-800 rounded animate-pulse w-3/4" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
