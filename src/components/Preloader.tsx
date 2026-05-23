import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.set(logoRef.current, { opacity: 0, y: 28 });
    gsap.set(taglineRef.current, { opacity: 0, y: 14 });
    gsap.set(barFillRef.current, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline();

    tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" })
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .to(barFillRef.current, { scaleX: 1, duration: 1.5, ease: "power1.inOut" }, "-=0.2")
      .to({}, { duration: 0.2 })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "26px",
      }}
    >
      <div ref={logoRef} style={{ textAlign: "center" }}>
        <svg
          viewBox="0 0 100 100"
          width="54"
          height="54"
          fill="none"
          style={{ display: "block", margin: "0 auto 14px" }}
        >
          <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="1.8" />
          <circle cx="50" cy="50" r="27" stroke="white" strokeWidth="1.3" />
          <polygon
            points="50,37 63,50 50,63 37,50"
            fill="rgba(255,255,255,0.15)"
            stroke="white"
            strokeWidth="1.3"
          />
          <polygon points="50,44 56,50 50,56 44,50" fill="white" />
        </svg>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "white",
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.38em",
          }}
        >
          KAIVO
        </div>
      </div>

      <p
        ref={taglineRef}
        style={{
          fontFamily: "'Urbanist', sans-serif",
          color: "rgba(255,255,255,0.38)",
          fontSize: "10px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Stop Doing. Start Delegating.
      </p>

      <div
        style={{
          width: "90px",
          height: "1px",
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          ref={barFillRef}
          style={{ width: "100%", height: "100%", background: "#7ECECA" }}
        />
      </div>
    </div>
  );
}
