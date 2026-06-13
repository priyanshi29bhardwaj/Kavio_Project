import { useEffect, useRef } from "react";
import gsap from "gsap";
import { KaivoMark } from "./KaivoLogo";

interface PreloaderProps {
  onComplete: () => void;
}

// ─── Preloader (frame 0) ──────────────────────────────────────────────────────
// Dark screen: Kaivo logo mark + "Kaivo" + tagline revealed through a
// blur/fade, then the overlay dissolves and hands off to the hero
// (the window blind opens).
export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    window.scrollTo(0, 0);

    const tl = gsap.timeline();
    tl.to(innerRef.current, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      delay: 0.25,
      ease: "power3.out",
    })
      .to(innerRef.current, {
        opacity: 0,
        filter: "blur(14px)",
        duration: 0.6,
        delay: 0.5,
        ease: "power2.in",
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onStart: () => onCompleteRef.current(),
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        },
      });

    return () => {
      tl.kill();
    };
  }, []); // run once only — onComplete captured via ref to avoid re-triggering

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "radial-gradient(120% 120% at 50% 40%, #221a12 0%, #0b0805 65%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        ref={innerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.4rem",
          opacity: 0,
          filter: "blur(20px)",
          willChange: "filter, opacity",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#f3efe9" }}>
          <KaivoMark size={44} color="#f3efe9" />
          <span
            style={{
              fontFamily: "'Archivo', 'Urbanist', sans-serif",
              fontStretch: "118%",
              fontWeight: 560,
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            Kaivo
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#c9b9a6",
          }}
        >
          Stop doing. Start delegating.
        </p>
      </div>
    </div>
  );
}
