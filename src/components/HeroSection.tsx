import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";


interface HeroSectionProps {
  triggerReveal: boolean;
  onJoinWaitlist: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ triggerReveal, onJoinWaitlist }) => {
  const headingRefs = useRef<HTMLDivElement[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!triggerReveal) return;

    // Reset initial state before animate
    gsap.set(headingRefs.current, {
      opacity: 0,
      y: 30,
      filter: "blur(12px)"
    });

    // Stagger reveal of the landing page text lines
    gsap.to(headingRefs.current, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.8 // Wait for the window shade to start opening
    });
  }, [triggerReveal]);

  // Framer Motion Magnetic Button Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate relative mouse coordinates from center of button
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Apply magnetic pull strength factor (e.g. 0.3)
    x.set(mouseX * 0.35);
    y.set(mouseY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col justify-center py-8 md:py-16 px-4 md:px-8 text-left h-full select-none">
      {/* Upper tag / details */}
      <div
        ref={(el) => { if (el) headingRefs.current[0] = el; }}
        className="flex items-center gap-3 mb-6 opacity-0"
      >
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-brand-teal bg-brand-teal/5 px-3 py-1 rounded border border-brand-teal/10">
          Flight Agent v1.0
        </span>
        <div className="h-[1px] w-12 bg-brand-teal/20" />
        <span className="text-[10px] md:text-xs tracking-wider text-brand-teal/60 font-space-grotesk">
          IATA: AI-KAV
        </span>
      </div>

      {/* Main bold statements with color accent pop */}
      <div className="space-y-6 md:space-y-8 font-urbanist max-w-2xl">
        <h1
          ref={(el) => { if (el) headingRefs.current[1] = el; }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-brand-teal opacity-0"
        >
          Your perfect flight, matched by{" "}
          <span className="text-brand-potato drop-shadow-sm font-extrabold relative inline-block">
            AI.
            <span className="absolute bottom-1 left-0 w-full h-[3px] bg-brand-potato" />
          </span>
        </h1>

        <h2
          ref={(el) => { if (el) headingRefs.current[2] = el; }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-brand-teal/90 opacity-0"
        >
          Found and booked in under{" "}
          <span className="font-space-grotesk text-brand-aqua drop-shadow-sm relative inline-block px-1">
            60 seconds.
            <span className="absolute bottom-1 left-0 w-full h-[3px] bg-brand-aqua" />
          </span>
        </h2>

        {/* Separator Line */}
        <div
          ref={(el) => { if (el) headingRefs.current[3] = el; }}
          className="h-[1px] w-full bg-brand-teal/10 my-4 opacity-0"
        />

        {/* Sub-copy features */}
        <div
          ref={(el) => { if (el) headingRefs.current[4] = el; }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm md:text-base font-medium text-brand-teal/70 opacity-0 font-space-grotesk"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-potato rotate-45" />
            No endless searching.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-aqua rotate-45" />
            No second-guessing.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-lime rotate-45" />
            No admin overload.
          </div>
        </div>

        <p
          ref={(el) => { if (el) headingRefs.current[5] = el; }}
          className="text-lg md:text-xl font-light leading-relaxed text-brand-teal/80 opacity-0"
        >
          Just better travel decisions{" "}
          <span className="text-brand-potato font-semibold">handled for you</span>.
        </p>

        <p
          ref={(el) => { if (el) headingRefs.current[6] = el; }}
          className="text-2xl md:text-3xl font-extrabold text-brand-teal/90 uppercase tracking-wide opacity-0"
        >
          Stop doing.{" "}
          <span className="text-brand-lime font-black underline decoration-brand-lime decoration-[4px] underline-offset-4">
            Start delegating.
          </span>
        </p>
      </div>

      {/* Yellow Ask -> CTA waitlist button with magnetic bounce */}
      <div
        ref={(el) => { if (el) headingRefs.current[7] = el; }}
        className="mt-10 md:mt-12 opacity-0"
      >
        <motion.button
          ref={buttonRef}
          style={{ x: dx, y: dy }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={onJoinWaitlist}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center justify-between gap-6 bg-brand-yellow hover:bg-[#F2E555] active:bg-[#ECE030] text-brand-teal text-lg md:text-xl font-bold font-space-grotesk px-8 py-5 rounded-full shadow-[0_8px_30px_rgb(240,224,64,0.3)] border-2 border-brand-teal/10 transition-colors cursor-pointer select-none"
        >
          <span>Join waitlist</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity">
              Ask
            </span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" />
          </div>

          {/* Micro accent lines around button (geometric styling) */}
          <div className="absolute -inset-1.5 rounded-full border border-brand-yellow/30 scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
        </motion.button>
      </div>
    </div>
  );
};
