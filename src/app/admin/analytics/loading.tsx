export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="bg-zinc-900 border-b border-[#FFD700]/20 px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse" />
          <div>
            <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse mb-1" />
            <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg animate-pulse" />
                <div className="w-10 h-4 bg-zinc-800/50 rounded animate-pulse" />
              </div>
              <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse mb-1" />
              <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse mb-2" />
                  <div className="h-4 w-24 bg-zinc-800/50 rounded animate-pulse" />
                </div>
                <div className="text-right">
                  <div className="h-7 w-28 bg-zinc-800 rounded animate-pulse mb-1" />
                  <div className="h-4 w-20 bg-zinc-800/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-[300px] bg-zinc-800/30 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        {/* More charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
            <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
            <div className="h-[300px] bg-zinc-800/30 rounded-lg animate-pulse" />
          </div>
          <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
            <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-4" />
            <div className="h-[300px] bg-zinc-800/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
