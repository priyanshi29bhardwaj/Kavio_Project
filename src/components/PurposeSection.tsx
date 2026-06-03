import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PurposeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);

  // Each line sits inside overflow:hidden — clips up on reveal
  const line1 = useRef<HTMLDivElement>(null);
  const line2 = useRef<HTMLDivElement>(null);
  const line3 = useRef<HTMLDivElement>(null);
  const line4 = useRef<HTMLDivElement>(null);
  const line5 = useRef<HTMLDivElement>(null);
  const p2l1  = useRef<HTMLDivElement>(null);
  const p2l2  = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  // Colour-change targets
  const dim1 = useRef<HTMLSpanElement>(null); // "search better."
  const dim2 = useRef<HTMLSpanElement>(null); // "browsing."
  const hl1  = useRef<HTMLSpanElement>(null); // "get things done."  → aqua
  const hl2  = useRef<HTMLSpanElement>(null); // "outcomes."          → aqua
  const hl3  = useRef<HTMLSpanElement>(null); // "Better decisions."  → orange

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [line1.current, line2.current, line3.current,
         line4.current, line5.current, p2l1.current, p2l2.current],
        { y: "115%" }
      );
      gsap.set([badgeRef.current, subRef.current], { opacity: 0, y: 20 });

      const tl = gsap.timeline({ paused: true });

      // ── 1. Clip-reveal lines ─────────────────────────────────────────────
      tl
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0)
        .to(line1.current,    { y: "0%",          duration: 0.95, ease: "power4.out" }, 0.15)
        .to(line2.current,    { y: "0%",          duration: 0.95, ease: "power4.out" }, 0.28)
        .to(line3.current,    { y: "0%",          duration: 0.95, ease: "power4.out" }, 0.41)
        .to(line4.current,    { y: "0%",          duration: 0.95, ease: "power4.out" }, 0.54)
        .to(line5.current,    { y: "0%",          duration: 0.95, ease: "power4.out" }, 0.67)
        .to(p2l1.current,     { y: "0%",          duration: 0.8,  ease: "power3.out" }, 0.82)
        .to(p2l2.current,     { y: "0%",          duration: 0.8,  ease: "power3.out" }, 0.96)
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.6,  ease: "power2.out" }, 1.10)

      // ── 2. "search better." → yellow; "browsing." dims to grey ──────────
        .to(dim1.current,
          { color: "#E8E840", duration: 0.55, ease: "power1.inOut" }, 1.35)
        .to(dim2.current,
          { color: "#E8622A", duration: 0.55, ease: "power1.inOut" }, 1.35)

      // ── 3. "get things done." → yellow; "outcomes." → aqua; hl3 → orange ──
        .to(hl1.current,
          { color: "#E8E840", fontWeight: 900, duration: 0.5, ease: "power2.out" }, 1.55)
        .to(hl2.current,
          { color: "#7ECECA", fontWeight: 700, duration: 0.5, ease: "power2.out" }, 1.90)
        .to(hl3.current,
          { color: "#E8622A", fontWeight: 800, duration: 0.5, ease: "power2.out" }, 2.25);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 70%",
        once:    true,
        onEnter: () => tl.play(),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const LINE: React.CSSProperties = { overflow: "hidden", lineHeight: 1.12 };
  const INNER: React.CSSProperties = { display: "block" };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vh, 90px) 0 clamp(40px, 5vh, 60px)",
      }}
    >

      {/* Top gradient seam from WhyLoveSection */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "160px",
        background: "linear-gradient(to bottom, #D6EEEE 0%, #f0f9f9 50%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Watermark */}
      <div aria-hidden style={{
        position: "absolute", right: "-1%", top: "50%",
        transform: "translateY(-46%)",
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
        fontSize: "clamp(140px, 20vw, 300px)",
        color: "rgba(27,74,90,0.028)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        letterSpacing: "-0.05em",
      }}>09</div>

      <div style={{
        maxWidth: "820px",
        width: "100%",
        padding: "0 clamp(20px, 5vw, 60px)",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(6px, 1vh, 10px)",
        textAlign: "center",
      }}>

        {/* ── Badge ───────────────────────────────────────────────────────── */}
        <div ref={badgeRef} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          border: "1.5px solid rgba(27,74,90,0.15)",
          borderRadius: "100px",
          padding: "7px 18px",
          marginBottom: "clamp(18px, 2.8vh, 32px)",
          opacity: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="4.8" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2"/>
            <path d="M4 6L5.5 7.5L8.5 4" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
            color: "#1B4A5A", textTransform: "uppercase",
          }}>Our Purpose</span>
        </div>

        {/* ── Main headline — 5 clip lines ────────────────────────────────── */}
        <div style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
          fontSize: "clamp(30px, 4.0vw, 56px)",
          color: "#1B4A5A", letterSpacing: "-0.03em",
          marginBottom: "clamp(20px, 3vh, 32px)",
          width: "100%",
        }}>
          <div style={LINE}><div ref={line1} style={INNER}>We believe the next great</div></div>
          <div style={LINE}><div ref={line2} style={INNER}>consumer products won't</div></div>
          <div style={LINE}>
            <div ref={line3} style={INNER}>
              help people{" "}
              <span ref={dim1} style={{ display: "inline" }}>search better.</span>
            </div>
          </div>
          <div style={LINE}><div ref={line4} style={INNER}>They'll help people</div></div>
          <div style={LINE}>
            <div ref={line5} style={INNER}>
              <span ref={hl1} style={{ display: "inline" }}>get things done.</span>
            </div>
          </div>
        </div>

        {/* ── Para 2 — 2 clip lines ───────────────────────────────────────── */}
        <div style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
          fontSize: "clamp(15px, 1.8vw, 22px)",
          color: "rgba(27,74,90,0.85)", letterSpacing: "-0.01em",
          lineHeight: 1.55,
          marginBottom: "clamp(22px, 3.2vh, 36px)",
          width: "100%",
        }}>
          <div style={LINE}>
            <div ref={p2l1} style={INNER}>
              For years, software has optimized{" "}
              <span ref={dim2} style={{ display: "inline" }}>browsing.</span>
            </div>
          </div>
          <div style={LINE}>
            <div ref={p2l2} style={INNER}>
              Kaivo optimizes{" "}
              <span ref={hl2} style={{ display: "inline" }}>outcomes.</span>
            </div>
          </div>
        </div>

        {/* ── Sub-line ─────────────────────────────────────────────────────── */}
        <div
          ref={subRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(18px, 3vw, 36px)",
            flexWrap: "wrap",
            justifyContent: "center",
            paddingTop: "clamp(12px, 2vh, 22px)",
            borderTop: "1px solid rgba(27,74,90,0.08)",
            width: "100%",
            opacity: 0,
          }}
        >
          {(["Less browsing.", "Less admin."] as const).map((item) => (
            <span key={item} style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
              fontSize: "clamp(13px, 1.4vw, 18px)",
              color: "rgba(27,74,90,0.78)",
            }}>
              {item}
            </span>
          ))}
          <span ref={hl3} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
            fontSize: "clamp(13px, 1.4vw, 18px)",
            color: "#1B4A5A",
            display: "inline",
          }}>
            Better decisions.
          </span>
        </div>

      </div>
    </section>
  );
}
