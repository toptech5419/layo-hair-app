export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="text-3xl font-bold text-[#FFD700] animate-pulse">LAYO</span>
          <span className="text-3xl font-light text-white animate-pulse">HAIR</span>
        </div>

        {/* Loading Spinner */}
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 border-4 border-[#FFD700]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#FFD700] rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/50 mt-4 text-sm">Loading...</p>
      </div>
    </div>
  );
}
