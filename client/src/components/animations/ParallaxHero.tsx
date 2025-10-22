import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  className?: string;
  height?: string;
}

export default function ParallaxHero({
  children,
  backgroundImage,
  className = "",
  height = "500px",
}: ParallaxHeroProps) {
  const ref = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background image - moves slower
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Scale and fade the entire hero as you scroll
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        scale: heroScale,
        opacity: heroOpacity,
      }}
    >
      {backgroundImage && (
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
          }}
        >
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-[120%] object-cover"
            data-testid="parallax-hero-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-800/60 to-blue-600/60" />
        </motion.div>
      )}
      {children}
    </motion.section>
  );
}
