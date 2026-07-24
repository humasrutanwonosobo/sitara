"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const tailwindToVariants: Record<string, Variants> = {
  "fade-in": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "slide-in-from-bottom-4": { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } },
  "slide-in-from-bottom-3": { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } },
  "slide-in-from-bottom-5": { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  "slide-in-from-bottom-8": { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  "slide-in-from-left-6": { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  "zoom-in-95": { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
};

const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
  mass: 0.5,
};

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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (shouldReduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
  }, [threshold, once, shouldReduceMotion]);

  const animationClass = animation.split(" ").find((cls) =>
    cls.startsWith("fade-in") ||
    cls.startsWith("slide-in-from-") ||
    cls.startsWith("zoom-in-")
  ) || "fade-in";

  const durationMatch = animation.match(/duration-(\d+)/);
  const duration = durationMatch ? parseInt(durationMatch[1]) / 1000 : 0.7;

  const delayMatch = animation.match(/delay-(\d+)/);
  const animationDelay = delayMatch ? parseInt(delayMatch[1]) / 1000 : delay / 1000;

  const baseVariant = tailwindToVariants[animationClass] || tailwindToVariants["fade-in"];

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        ...baseVariant,
        visible: {
          ...baseVariant.visible,
          transition: {
            ...springTransition,
            delay: animationDelay,
            duration,
          },
        },
      }}
      style={{ transform: "translateZ(0)", willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
