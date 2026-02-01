export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="h-16 bg-black/95 border-b border-[#FFD700]/20" />

      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Title skeleton */}
          <div className="text-center mb-10">
            <div className="h-10 w-72 bg-zinc-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-80 max-w-full bg-zinc-800/50 rounded mx-auto animate-pulse" />
          </div>

          {/* Steps indicator skeleton */}
          <div className="flex justify-center gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-zinc-800/50 rounded animate-pulse hidden sm:block" />
              </div>
            ))}
          </div>

          {/* Content skeleton */}
          <div className="bg-zinc-900 border border-[#FFD700]/10 rounded-2xl p-8">
            <div className="h-6 w-48 bg-zinc-800 rounded mb-6 animate-pulse" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-zinc-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
