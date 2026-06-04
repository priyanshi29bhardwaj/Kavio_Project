import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

// ─── Minimal dark-screen preloader ────────────────────────────────────────────
// Matches the Jesko Jets approach: page starts completely black, then the hero
// scene itself fades / brightens in underneath.  No logo, no bar — just the
// same dark colour as the hero's initial state so the transition is invisible.
export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Brief hold, then fade the overlay to transparent
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.inOut",
      onComplete,
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#04060c",
        pointerEvents: "none",
      }}
    />
  );
}
