import { useScroll, useTransform, MotionValue } from "framer-motion";
import { RefObject } from "react";

export function useParallax(
  ref: RefObject<HTMLElement>,
  distance: number = 300
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
}

export function useScaleOnScroll(
  ref: RefObject<HTMLElement>,
  scaleRange: [number, number] = [0.8, 1]
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  
  return useTransform(scrollYProgress, [0, 1], scaleRange);
}

export function useOpacityOnScroll(
  ref: RefObject<HTMLElement>,
  opacityRange: [number, number] = [0, 1]
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  
  return useTransform(scrollYProgress, [0, 1], opacityRange);
}
