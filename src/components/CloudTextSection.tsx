import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CloudTextSectionProps {
  onJoinWaitlist: () => void;
}

export function CloudTextSection({ onJoinWaitlist }: CloudTextSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = [taglineRef.current, headRef.current, subRef.current, ctaRef.current];

      // Each element fades + rises in staggered as section enters viewport
      gsap.fromTo(
        items,
        { opacity: 0, y: 48, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        // Transparent — global fixed sky (App.tsx) shows through.
        // No sky image needed here; HeroScene ends on the same sky, so
        // scrolling into this section creates zero visible transition.
        background: "transparent",
        zIndex: 1,
      }}
    >
      {/* Soft overlay for text legibility — NOT the sky itself */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,8,16,0.28) 0%, rgba(5,8,16,0.10) 35%, rgba(5,8,16,0.08) 65%, rgba(5,8,16,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "120px 28px",
          maxWidth: "780px",
          margin: "0 auto",
        }}
      >
        {/* Eyebrow tag */}
        <div
          ref={taglineRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "9px",
            letterSpacing: "0.42em",
            color: "#C8E44A",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          Stop Doing. Start Delegating.
        </div>

        {/* Hero headline */}
        <div ref={headRef}>
          <h1
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5.5vw, 76px)",
              lineHeight: 1.06,
              color: "white",
              margin: "0 0 16px",
              textShadow: "0 4px 32px rgba(0,0,0,0.45)",
            }}
          >
            Your perfect flight,{" "}
            <span style={{ color: "#7ECECA" }}>matched by AI.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(15px, 2vw, 22px)",
              color: "#C8E44A",
              margin: "0 0 10px",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            Found and booked in under 60 seconds.
          </p>
        </div>

        {/* Supporting copy */}
        <div ref={subRef}>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(13px, 1.4vw, 17px)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.8,
              margin: "18px auto 10px",
              maxWidth: "520px",
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            No endless searching. No second-guessing. No admin overload.
          </p>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(13px, 1.4vw, 17px)",
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.8,
              margin: "0 auto 36px",
              maxWidth: "520px",
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            Just better travel decisions — handled for you.
          </p>
        </div>

        {/* CTA */}
        <div ref={ctaRef}>
          <button
            onClick={onJoinWaitlist}
            style={{
              background: "#C8E44A",
              color: "#1B4A5A",
              border: "none",
              padding: "15px 36px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 24px rgba(200,228,74,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(200,228,74,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(200,228,74,0.35)";
            }}
          >
            Join Waitlist →
          </button>
        </div>
      </div>
    </section>
  );
}
