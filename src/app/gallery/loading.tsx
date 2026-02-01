export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="h-16 bg-black/95 border-b border-[#FFD700]/20" />

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Title skeleton */}
          <div className="text-center mb-10">
            <div className="h-10 w-48 bg-zinc-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-5 w-72 max-w-full bg-zinc-800/50 rounded mx-auto animate-pulse" />
          </div>

          {/* Category filter skeleton */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 bg-zinc-900 rounded-full animate-pulse" />
            ))}
          </div>

          {/* Gallery grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
