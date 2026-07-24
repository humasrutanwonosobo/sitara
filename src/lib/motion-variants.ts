import type { Variants } from "motion/react";

/**
 * Reusable spring transition config for consistent animations
 */
export const springConfig = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
  mass: 0.5,
};

export const strongSpring = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

/**
 * Page transition variants for route changes
 */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

/**
 * Container for staggered children animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual item in a stagger container
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springConfig,
  },
};

/**
 * Fade in with upward motion
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: strongSpring,
  },
};

/**
 * Fade in with scale effect
 */
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: strongSpring,
  },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig,
  },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig,
  },
};

export type { Variants } from "motion/react";
