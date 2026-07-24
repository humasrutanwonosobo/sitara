"use client";

import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: "easeIn" as const,
    },
  },
};

function PageTransitionContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        style={{ transformOrigin: "top center" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransitionContent>{children}</PageTransitionContent>;
}

export function SkeletonShimmer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ transform: "translateZ(0)" }}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          transform: "translateX(-100%)",
        }}
      />
    </div>
  );
}

export function PulseDot({
  className,
  color = "bg-teal-500",
  size = "w-1.5 h-1.5",
}: {
  className?: string;
  color?: string;
  size?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span
        className={`${size} ${color} rounded-full ${className || ""}`}
        style={{ transform: "translateZ(0)" }}
      />
    );
  }

  return (
    <motion.span
      className={`${size} ${color} rounded-full ${className || ""}`}
      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transform: "translateZ(0)" }}
    />
  );
}

export function HoverScale({
  children,
  className,
  scale = 1.02,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={shouldReduceMotion ? {} : { scale }}
      whileTap={shouldReduceMotion ? {} : { scale: scale * 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{ transformOrigin: "center center" }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({
  children,
  className,
  yOffset = 10,
  duration = 3,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{ transform: "translateZ(0)" }}
    >
      {children}
    </motion.div>
  );
}