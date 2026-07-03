"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function AnimateOnScroll({
  children,
  className = "",
  animation = "animate-in fade-in slide-in-from-bottom-4 duration-700",
  delay = 0,
  threshold = 0.05,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-300 ${isVisible ? animation : "opacity-0 will-change-[opacity,transform]"} ${className} transform-gpu`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}
