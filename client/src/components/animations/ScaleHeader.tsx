import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScaleHeaderProps {
  children: ReactNode;
  className?: string;
  scaleFrom?: number;
  scaleTo?: number;
  duration?: number;
}

export default function ScaleHeader({
  children,
  className = "",
  scaleFrom = 0.75,
  scaleTo = 1.05,
  duration = 0.5,
}: ScaleHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Transform scroll progress to scale
  const scale = useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        className={className}
        style={{
          scale,
          opacity,
        }}
        transition={{
          duration,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
