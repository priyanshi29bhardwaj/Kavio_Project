import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function BridgeSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const line2Ref    = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const taglineRef  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: "top 68%" };

      // ── Big lines: clip-reveal (slide up from hidden edge) ───────────────
      gsap.fromTo(
        [line1Ref.current, line2Ref.current],
        { y: "108%"  },
        { y: "0%", stagger: 0.14, duration: 1.05, ease: "power4.out",
          scrollTrigger: st }
      );

      // ── Centre divider draws inward from both ends ────────────────────────
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: "center" },
        { scaleX: 1, duration: 0.55, ease: "power2.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" } }
      );

      // ── Tagline fades up ──────────────────────────────────────────────────
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 50%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "#04060c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow behind text */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw", height: "70vw",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(126,206,202,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", maxWidth: "860px", position: "relative" }}>

        {/* Line 1 */}
        <div style={{ overflow: "hidden" }}>
          <div
            ref={line1Ref}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(48px, 6.8vw, 108px)",
              color: "white",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
            }}
          >
            Travel should feel
          </div>
        </div>

        {/* Line 2 — accent colour */}
        <div style={{ overflow: "hidden", marginBottom: "60px" }}>
          <div
            ref={line2Ref}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(48px, 6.8vw, 108px)",
              color: "#7ECECA",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
            }}
          >
            this effortless.
          </div>
        </div>

        {/* Divider */}
        <div
          ref={dividerRef}
          style={{
            width: "48px",
            height: "1px",
            background: "rgba(255,255,255,0.18)",
            margin: "0 auto 40px",
          }}
        />

        {/* Pivot tagline */}
        <div
          ref={taglineRef}
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(15px, 1.6vw, 21px)",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.01em",
          }}
        >
          Right now, it doesn't.
        </div>
      </div>

      {/* ── Bottom fade to white — bleeds into ProblemSection ────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "220px",
          background: "linear-gradient(to bottom, transparent, white)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
