"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({
  label = "Back",
  className = "inline-flex items-center gap-2 text-white/60 hover:text-[#FFD700] transition-colors",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className={className}>
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
