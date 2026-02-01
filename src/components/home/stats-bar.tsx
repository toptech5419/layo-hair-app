"use client";

import { useEffect, useState, useRef } from "react";
import { Star, Users, Calendar, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Clients",
    description: "Satisfied customers",
  },
  {
    icon: Calendar,
    value: 5,
    suffix: "+",
    label: "Years Experience",
    description: "In the industry",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    label: "Rating",
    description: "Client satisfaction",
  },
  {
    icon: Award,
    value: 1000,
    suffix: "+",
    label: "Styles Done",
    description: "And counting",
  },
];

function useCountUp(end: number, duration: number = 2000, startCounting: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(easeOutQuart * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  description,
  delay,
  isVisible,
}: {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay: number;
  isVisible: boolean;
}) {
  const count = useCountUp(value, 2000, isVisible);
  const displayValue = Number.isInteger(value)
    ? Math.floor(count)
    : count.toFixed(1);

  return (
    <div
      className="relative group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 text-center hover:bg-[#FFD700]/5 transition-colors duration-300">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FFD700]/10 mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-[#FFD700]" />
        </div>

        {/* Value */}
        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="text-[#FFD700]">{displayValue}</span>
          <span className="text-[#FFD700]">{suffix}</span>
        </div>

        {/* Label */}
        <h3 className="text-lg font-semibold text-white mb-1">{label}</h3>

        {/* Description */}
        <p className="text-white/50 text-sm">{description}</p>
      </div>
    </div>
  );
}

export function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-16 bg-gradient-to-r from-black via-zinc-900 to-black relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 150}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
