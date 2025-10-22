import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export default function ParallaxText({
  children,
  className = "",
  speed = 0.5,
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Text moves up faster than normal scroll, creating depth
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  
  // Scale up dramatically as you scroll into view
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  
  // Fade out as you scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        scale,
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
}
