"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpinnerLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SpinnerLoader({ size = "md", className }: SpinnerLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={cn(
        "border-2 border-muted border-t-primary rounded-full",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
}
