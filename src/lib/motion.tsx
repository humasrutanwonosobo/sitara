"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { fadeInUp } from "./motion-variants";

/**
 * Animated div that respects user's motion preferences
 * Triggers animation when element enters viewport
 */
export function MotionDiv({
  children,
  className,
  variants = fadeInUp,
  viewportOnce = true,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  viewportOnce?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? undefined : variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated section that respects user's motion preferences
 * Triggers animation when element enters viewport
 */
export function MotionSection({
  children,
  className,
  variants = fadeInUp,
  viewportOnce = true,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  viewportOnce?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      variants={shouldReduceMotion ? undefined : variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: "-50px" }}
    >
      {children}
    </motion.section>
  );
}
