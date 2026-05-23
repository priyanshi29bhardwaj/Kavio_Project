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

  // Individual word refs for "matched by AI."
  const w1 = useRef<HTMLSpanElement>(null); // "matched"
  const w2 = useRef<HTMLSpanElement>(null); // "by"
  const w3 = useRef<HTMLSpanElement>(null); // "AI."

  // Subtitle ref
  const sublineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Phase 1: whole block fades + rises in — text starts neutral white ──
      gsap.fromTo(
        [taglineRef.current, headRef.current, subRef.current, ctaRef.current],
        { opacity: 0, y: 52, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
          },
        }
      );

      // ── Phase 2: colour lights up word-by-word once section is centred ────
      // Words start dim; GSAP transitions each one to its colour.
      gsap.set([w1.current, w2.current, w3.current], {
        color: "rgba(255,255,255,0.45)",
      });
      gsap.set(sublineRef.current, {
        color: "rgba(255,255,255,0.45)",
      });

      const hl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
        },
      });

      // "matched" → "by" → "AI." stagger into teal
      hl.to([w1.current, w2.current, w3.current], {
        color: "#7ECECA",
        duration: 0.55,
        stagger: 0.14,
        ease: "power2.out",
      }, 0);

      // subtitle fades to lime slightly after
      hl.to(sublineRef.current, {
        color: "#C8E44A",
        duration: 0.7,
        ease: "power2.out",
      }, 0.42);

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
        background: "transparent",
        zIndex: 1,
      }}
    >
      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "120px 28px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Eyebrow */}
        <div
          ref={taglineRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(12px, 1.1vw, 15px)",
            letterSpacing: "0.32em",
            color: "#C8E44A",
            textTransform: "uppercase",
            marginBottom: "32px",
            textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 0 32px rgba(0,0,0,0.6)",
          }}
        >
          Stop Doing. Start Delegating.
        </div>

        {/* Headline */}
        <div ref={headRef}>
          <h1
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 5.5vw, 76px)",
              lineHeight: 1.06,
              color: "white",
              margin: "0 0 18px",
              textShadow: "0 2px 20px rgba(0,0,0,0.75), 0 4px 48px rgba(0,0,0,0.45)",
            }}
          >
            Your perfect flight,{" "}
            {/* Each word lights up individually */}
            <span ref={w1}>matched</span>
            {" "}
            <span ref={w2}>by</span>
            {" "}
            <span ref={w3}>AI.</span>
          </h1>

          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(15px, 2vw, 22px)",
              margin: "0 0 10px",
              textShadow: "0 2px 14px rgba(0,0,0,0.75)",
            }}
          >
            <span ref={sublineRef}>
              Found and booked in under 60 seconds.
            </span>
          </p>
        </div>

        {/* Supporting copy */}
        <div ref={subRef}>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(15px, 1.6vw, 19px)",
              color: "rgba(255,255,255,0.96)",
              lineHeight: 1.8,
              margin: "22px auto 10px",
              maxWidth: "520px",
              textShadow: "0 1px 14px rgba(0,0,0,0.9), 0 2px 28px rgba(0,0,0,0.65)",
            }}
          >
            No endless searching. No second-guessing. No admin overload.
          </p>
          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(15px, 1.6vw, 19px)",
              color: "rgba(255,255,255,0.90)",
              lineHeight: 1.8,
              margin: "0 auto 40px",
              maxWidth: "520px",
              textShadow: "0 1px 14px rgba(0,0,0,0.9), 0 2px 28px rgba(0,0,0,0.65)",
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
              padding: "15px 38px",
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
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(200,228,74,0.55)";
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
