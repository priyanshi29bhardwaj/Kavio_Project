import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PlaneIcon } from "./PlaneIcon";

gsap.registerPlugin(ScrollTrigger);

export function PurposeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Entrance targets
  const badgeRef = useRef<HTMLDivElement>(null);
  const heroRef  = useRef<HTMLDivElement>(null);
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // "The shift" flight path
  const laneRef  = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  // Colour-reveal targets (same words / beats as the original manifesto)
  const dim1 = useRef<HTMLSpanElement>(null); // "search better."
  const hl1  = useRef<HTMLSpanElement>(null); // "get things done."  → yellow
  const dim2 = useRef<HTMLSpanElement>(null); // "browsing."          → orange
  const hl2  = useRef<HTMLSpanElement>(null); // "outcomes."          → teal
  const hl3  = useRef<HTMLSpanElement>(null); // "Better decisions."  → orange

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Entrance ────────────────────────────────────────────────────────
      gsap.set(badgeRef.current, { opacity: 0, y: 16 });
      gsap.set(heroRef.current,  { opacity: 0, y: 28 });
      gsap.set([leftRef.current, rightRef.current], { opacity: 0, y: 34 });

      const tl = gsap.timeline({ paused: true });
      tl
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(heroRef.current,  { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.12)
        .to(leftRef.current,  { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.34)
        .to(rightRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.46)
        // colour reveals
        .to(dim2.current, { color: "#E8622A", duration: 0.55, ease: "power1.inOut" }, 0.7)
        .to(hl2.current,  { color: "#7ECECA", fontWeight: 800, duration: 0.5, ease: "power2.out" }, 1.25)
        .to(hl3.current,  { color: "#FF7A4D", fontWeight: 900, duration: 0.5, ease: "power2.out" }, 1.5);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 68%",
        once:    true,
        onEnter: () => tl.play(),
      });

      // ── "The shift" plane flies old → new on scroll ─────────────────────
      const lane  = laneRef.current;
      const line  = lineRef.current;
      const plane = planeRef.current;
      if (lane && line && plane) {
        gsap.set(line,  { clipPath: "inset(0 100% 0 0)" });
        gsap.set(plane, { x: 0 });
        const endX = () => lane.offsetWidth - (plane.offsetWidth || 48);
        gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%", end: "bottom 70%", scrub: 1 },
        })
          .to(line,  { clipPath: "inset(0 0% 0 0)", ease: "none" })
          .to(plane, { x: endX, ease: "none" }, 0);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "white",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(64px, 9vh, 110px) 0 clamp(56px, 7vh, 88px)",
      }}
    >
      {/* Top gradient seam from WhyLoveSection */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "160px",
        background: "linear-gradient(to bottom, #D6EEEE 0%, #f0f9f9 50%, transparent 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <style>{`
        .purpose-shift {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(16px, 2.2vw, 26px);
          margin-top: clamp(34px, 5vh, 60px);
        }
        @media (max-width: 760px) {
          .purpose-shift { grid-template-columns: 1fr; }
          .purpose-lane  { display: none !important; }
        }
      `}</style>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "1080px", margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 56px)",
      }}>

        {/* ── Badge ─────────────────────────────────────────────────────── */}
        <div ref={badgeRef} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          border: "1.5px solid rgba(27,74,90,0.15)", borderRadius: "100px",
          padding: "9px 20px", marginBottom: "clamp(22px, 3vh, 34px)",
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

        {/* ── Hero manifesto ────────────────────────────────────────────── */}
        <div ref={heroRef} style={{ display: "flex", gap: "clamp(18px, 2.4vw, 32px)" }}>
          {/* teal accent bar */}
          <div aria-hidden style={{
            flexShrink: 0, width: "4px", borderRadius: "4px",
            background: "linear-gradient(to bottom, #7ECECA, rgba(126,206,202,0.15))",
          }} />
          <div style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(28px, 3.6vw, 52px)",
            color: "#1B4A5A", letterSpacing: "-0.032em", lineHeight: 1.12,
            maxWidth: "960px",
          }}>
            We believe the next great consumer products won't help people{" "}
            <span ref={dim1}>search better.</span>{" "}
            They'll help people{" "}
            <span ref={hl1}>get things done.</span>
          </div>
        </div>

        {/* ── "The shift" labels + flight path ──────────────────────────── */}
        <div className="purpose-lane" style={{
          marginTop: "clamp(40px, 6vh, 72px)",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: "11px", letterSpacing: "0.26em", color: "rgba(27,74,90,0.45)",
            textTransform: "uppercase", flexShrink: 0,
          }}>The Old Way</span>

          {/* animated flight lane */}
          <div ref={laneRef} style={{ position: "relative", flex: 1, height: "30px" }}>
            <div aria-hidden style={{
              position: "absolute", top: "50%", left: 0, right: 0, height: 0,
              borderTop: "1.5px dashed rgba(27,74,90,0.18)", transform: "translateY(-50%)",
            }} />
            <div ref={lineRef} style={{
              position: "absolute", top: "50%", left: 0, right: 0, height: 0,
              borderTop: "1.5px dashed #7ECECA", transform: "translateY(-50%)",
            }} />
            <div ref={planeRef} style={{
              position: "absolute", top: "50%", left: 0,
              transform: "translateY(-50%)", lineHeight: 0,
            }}>
              <PlaneIcon size={48} color="#1B4A5A" />
            </div>
          </div>

          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: "11px", letterSpacing: "0.26em", color: "#7ECECA",
            textTransform: "uppercase", flexShrink: 0,
          }}>The Kaivo Way</span>
        </div>

        {/* ── Before → After panels ─────────────────────────────────────── */}
        <div className="purpose-shift">

          {/* OLD WAY — muted paper */}
          <div ref={leftRef} style={{
            background: "#F4F3EE",
            border: "1px solid rgba(27,74,90,0.07)",
            borderRadius: "22px",
            padding: "clamp(26px, 3vw, 40px)",
            display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
              fontSize: "10px", letterSpacing: "0.28em", color: "rgba(27,74,90,0.40)",
              textTransform: "uppercase", marginBottom: "18px",
            }}>Optimized for</span>

            <div style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
              fontSize: "clamp(20px, 2.2vw, 30px)",
              color: "rgba(27,74,90,0.55)", lineHeight: 1.3, letterSpacing: "-0.02em",
            }}>
              For years, software has optimized{" "}
              <span ref={dim2}>browsing.</span>
            </div>

            <div style={{ flex: 1, minHeight: "20px" }} />

            <div style={{
              borderTop: "1px solid rgba(27,74,90,0.10)",
              paddingTop: "20px", marginTop: "24px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              {["Less browsing.", "Less admin."].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span aria-hidden style={{
                    width: "18px", height: "1.5px", background: "rgba(27,74,90,0.30)", flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                    fontSize: "clamp(14px, 1.4vw, 17px)", color: "rgba(27,74,90,0.55)",
                  }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KAIVO WAY — vibrant navy */}
          <div ref={rightRef} style={{
            background: "#163C49",
            borderRadius: "22px",
            padding: "clamp(26px, 3vw, 40px)",
            display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
          }}>
            {/* soft teal glow */}
            <div aria-hidden style={{
              position: "absolute", top: "-30%", right: "-20%",
              width: "70%", height: "80%", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(126,206,202,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
              fontSize: "10px", letterSpacing: "0.28em", color: "rgba(126,206,202,0.75)",
              textTransform: "uppercase", marginBottom: "18px", position: "relative",
            }}>Optimized for</span>

            <div style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
              fontSize: "clamp(20px, 2.2vw, 30px)",
              color: "rgba(255,255,255,0.92)", lineHeight: 1.3, letterSpacing: "-0.02em",
              position: "relative",
            }}>
              Kaivo optimizes{" "}
              <span ref={hl2} style={{ color: "rgba(126,206,202,0.45)" }}>outcomes.</span>
            </div>

            <div style={{ flex: 1, minHeight: "20px" }} />

            <div style={{
              borderTop: "1px solid rgba(126,206,202,0.20)",
              paddingTop: "22px", marginTop: "24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "16px", position: "relative",
            }}>
              <span ref={hl3} style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
                fontSize: "clamp(20px, 2.2vw, 30px)", letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.85)",
              }}>Better decisions.</span>
              <PlaneIcon size={48} color="#7ECECA" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
