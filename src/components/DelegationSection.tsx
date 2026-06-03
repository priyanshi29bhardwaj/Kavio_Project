import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PAINS = [
  "Prices change constantly.",
  "Trade-offs are confusing.",
  "Every booking feels high-stakes.",
  "Too many tabs.",
  "Too many variables.",
  "Too much work.",
] as const;

const EXPANSION = [
  { label: "Flights",           active: true  },
  { label: "Trains",            active: false },
  { label: "Hotels",            active: false },
  { label: "Full Trips",        active: false },
  { label: "Repeat Purchases",  active: false },
  { label: "Life Admin",        active: false },
] as const;

export function DelegationSection() {
  const sectionRef   = useRef<HTMLElement>(null);

  // Left column
  const badgeRef  = useRef<HTMLDivElement>(null);
  const hl1Ref    = useRef<HTMLDivElement>(null);
  const hl2Ref    = useRef<HTMLDivElement>(null);
  const hl3Ref    = useRef<HTMLDivElement>(null);
  const divRef    = useRef<HTMLDivElement>(null);
  const bodyRef   = useRef<HTMLParagraphElement>(null);
  const pivotRef  = useRef<HTMLDivElement>(null);

  // Right column
  const painRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const cta2Ref   = useRef<HTMLDivElement>(null);

  // Track
  const labelRef     = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const trackLineRef = useRef<HTMLDivElement>(null);
  const nodeRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Initial states ─────────────────────────────────────────────────
      gsap.set(badgeRef.current,                { opacity: 0, y: 16 });
      gsap.set([hl1Ref.current, hl2Ref.current],{ y: "110%" });
      gsap.set(hl3Ref.current,                  { opacity: 0, y: 20 });
      gsap.set(divRef.current,                  { scaleX: 0, transformOrigin: "left center" });
      gsap.set(bodyRef.current,                 { opacity: 0, y: 16 });
      gsap.set(pivotRef.current,                { opacity: 0, y: 16 });
      gsap.set(painRefs.current.filter(Boolean),{ opacity: 0, x: -22 });
      gsap.set(cta2Ref.current,                 { opacity: 0, y: 12 });
      gsap.set(labelRef.current,                { opacity: 0, y: 12 });
      gsap.set(trackRef.current,                { opacity: 0, y: 18 });
      gsap.set(trackLineRef.current,            { clipPath: "inset(0 100% 0 0)" });
      gsap.set(nodeRefs.current.filter(Boolean),{ opacity: 0, scale: 0.4 });

      // ── Master timeline ────────────────────────────────────────────────
      const tl = gsap.timeline({ paused: true });
      tl
        // badge
        .to(badgeRef.current,  { opacity: 1, y: 0,  duration: 0.5,  ease: "power2.out" }, 0)
        // headline clip-reveal
        .to(hl1Ref.current,    { y: "0%",           duration: 0.85, ease: "power4.out" }, 0.14)
        .to(hl2Ref.current,    { y: "0%",           duration: 0.85, ease: "power4.out" }, 0.28)
        .to(hl3Ref.current,    { opacity: 1, y: 0,  duration: 0.6,  ease: "power3.out" }, 0.50)
        // divider draws in
        .to(divRef.current,    { scaleX: 1,          duration: 0.45, ease: "power2.inOut" }, 0.68)
        // body text
        .to(bodyRef.current,   { opacity: 1, y: 0,  duration: 0.6,  ease: "power2.out" }, 0.78)
        .to(pivotRef.current,  { opacity: 1, y: 0,  duration: 0.6,  ease: "power2.out" }, 0.96)
        // pain points stagger in from left (starts alongside headline)
        .to(painRefs.current,  { opacity: 1, x: 0,  duration: 0.5,  stagger: 0.09, ease: "power2.out" }, 0.32)
        .to(cta2Ref.current,   { opacity: 1, y: 0,  duration: 0.5,  ease: "power2.out" }, 0.95)
        // track
        .to(labelRef.current,  { opacity: 1, y: 0,  duration: 0.5,  ease: "power2.out" }, 1.10)
        .to(trackRef.current,  { opacity: 1, y: 0,  duration: 0.55, ease: "power2.out" }, 1.18)
        // line draws across
        .to(trackLineRef.current, { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power2.inOut" }, 1.28)
        // nodes pop in as line sweeps past
        .to(nodeRefs.current,  { opacity: 1, scale: 1, duration: 0.38, stagger: 0.26, ease: "back.out(2.2)" }, 1.34);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 68%",
        once:    true,
        onEnter: () => tl.play(),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight:      "100vh",
        background:     "linear-gradient(160deg, #070f16 0%, #0c1e2c 55%, #071018 100%)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        position:       "relative",
        overflow:       "hidden",
        overflowX:      "hidden",
        padding:        "clamp(56px, 8vh, 88px) 0",
      }}
    >

      {/* Top gradient seam — blends in from BusinessModelSection */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "160px",
        background: "linear-gradient(to bottom, #07111a 0%, rgba(7,15,22,0.55) 55%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Ambient teal radial glow */}
      <div aria-hidden style={{
        position: "absolute", top: "42%", left: "32%",
        transform: "translate(-50%,-50%)",
        width: "65vw", height: "65vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(126,206,202,0.07) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />

      {/* Lime glow — top right */}
      <div aria-hidden style={{
        position: "absolute", top: "-10%", right: "5%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(200,228,74,0.05) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />


      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:      "1160px",
        width:         "100%",
        padding:       "0 clamp(20px, 4vw, 60px)",
        position:      "relative",
        zIndex:        1,
        display:       "flex",
        flexDirection: "column",
        gap:           "clamp(44px, 6vh, 72px)",
      }}>

        {/* ── Top two-column ──────────────────────────────────────────── */}
        <div
          className="deleg-top"
          style={{
            display:    "flex",
            gap:        "clamp(40px, 6vw, 88px)",
            alignItems: "flex-start",
          }}
        >

          {/* ── LEFT: Manifesto ─────────────────────────────────────── */}
          <div className="deleg-left" style={{ flex: "0 0 46%", display: "flex", flexDirection: "column", gap: "clamp(18px, 2.5vh, 28px)" }}>

            {/* Badge */}
            <div ref={badgeRef} style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              border: "1px solid rgba(200,228,74,0.28)",
              borderRadius: "100px",
              padding: "6px 18px", alignSelf: "flex-start", opacity: 0,
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C8E44A", boxShadow: "0 0 8px rgba(200,228,74,0.6)" }} />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
                color: "#C8E44A", textTransform: "uppercase",
              }}>Delegation Thesis</span>
            </div>

            {/* Headline — clip reveal */}
            <div>
              <div style={{ overflow: "hidden", lineHeight: 1.06, marginBottom: "3px" }}>
                <div ref={hl1Ref} style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
                  fontSize: "clamp(34px, 4.2vw, 62px)",
                  color: "white", letterSpacing: "-0.03em",
                }}>Travel is the</div>
              </div>
              <div style={{ overflow: "hidden", lineHeight: 1.06, marginBottom: "10px" }}>
                <div ref={hl2Ref} style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
                  fontSize: "clamp(34px, 4.2vw, 62px)",
                  color: "white", letterSpacing: "-0.03em",
                }}>starting point.</div>
              </div>
              {/* Sub-headline fades in */}
              <div ref={hl3Ref} style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
                fontSize: "clamp(22px, 2.6vw, 38px)",
                color: "#7ECECA", letterSpacing: "-0.025em",
                opacity: 0,
              }}>Delegation is the future.</div>
            </div>

            {/* Lime divider */}
            <div ref={divRef} style={{
              width: "44px", height: "2px",
              background: "linear-gradient(to right, #C8E44A, rgba(200,228,74,0.3))",
              borderRadius: "1px",
            }} />

            {/* Body */}
            <p ref={bodyRef} style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
              fontSize: "clamp(15px, 1.4vw, 18px)",
              color: "rgba(255,255,255,0.92)", lineHeight: 1.8,
              margin: 0, opacity: 0,
            }}>
              Flights are one of the most frustrating<br />
              digital workflows in modern life.
            </p>

            {/* Pivot quote */}
            <div ref={pivotRef} style={{
              borderLeft: "2px solid #7ECECA",
              paddingLeft: "18px",
              opacity: 0,
            }}>
              <p style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                fontSize: "clamp(14px, 1.3vw, 17px)",
                color: "rgba(255,255,255,0.90)", lineHeight: 1.7,
                margin: 0,
              }}>
                That makes travel the perfect place<br />
                to prove a better model.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Pain points ──────────────────────────────────── */}
          <div className="deleg-right" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>

            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
              color: "rgba(232,98,42,0.75)", textTransform: "uppercase",
              marginBottom: "6px",
            }}>The frustration with flights:</div>

            {PAINS.map((pain, i) => (
              <div
                key={i}
                ref={(el) => { painRefs.current[i] = el; }}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "13px 18px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  opacity: 0,
                }}
              >
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#E8622A", flexShrink: 0,
                  boxShadow: "0 0 8px rgba(232,98,42,0.45)",
                }} />
                <span style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600, fontSize: "clamp(14px, 1.25vw, 16px)",
                  color: "rgba(255,255,255,0.82)", lineHeight: 1.4,
                }}>{pain}</span>
              </div>
            ))}

            {/* Resolution chip */}
            <div ref={cta2Ref} style={{
              marginTop: "6px",
              padding: "14px 18px",
              background: "rgba(200,228,74,0.08)",
              border: "1px solid rgba(200,228,74,0.22)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", gap: "12px",
              opacity: 0,
            }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#C8E44A", flexShrink: 0,
                boxShadow: "0 0 8px rgba(200,228,74,0.55)",
              }} />
              <span style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                fontSize: "clamp(14px, 1.25vw, 16px)",
                color: "#C8E44A", lineHeight: 1.4,
              }}>
                So we're starting here — and building from it.
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom: Expansion roadmap track ─────────────────────────── */}
        <div>
          <div ref={labelRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700, fontSize: "clamp(15px, 1.4vw, 18px)",
            color: "rgba(255,255,255,0.90)",
            marginBottom: "24px", opacity: 0,
          }}>
            Starting with flights. Then everything that should feel effortless:
          </div>

          <div className="deleg-track" style={{ overflowX: "auto" }}>
          <div ref={trackRef} className="deleg-track-inner" style={{
            position: "relative",
            display: "flex", alignItems: "flex-start",
            padding: "0 0 8px",
            opacity: 0,
          }}>
            {/* Connecting line */}
            <div ref={trackLineRef} style={{
              position: "absolute",
              top: "10px", left: "8px", right: "8px",
              height: "1.5px",
              background: "linear-gradient(to right, #C8E44A 0%, rgba(126,206,202,0.5) 20%, rgba(255,255,255,0.1) 100%)",
              zIndex: 0,
            }} />

            {/* Stop nodes */}
            {EXPANSION.map((stop, i) => (
              <div
                key={i}
                ref={(el) => { nodeRefs.current[i] = el; }}
                style={{
                  flex: 1,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "12px", position: "relative", zIndex: 1,
                  opacity: 0,
                }}
              >
                {/* Circle node */}
                <div style={{
                  width:        stop.active ? "20px" : "12px",
                  height:       stop.active ? "20px" : "12px",
                  borderRadius: "50%",
                  background:   stop.active ? "#C8E44A" : "rgba(255,255,255,0.08)",
                  border:       stop.active ? "none" : "1.5px solid rgba(126,206,202,0.25)",
                  boxShadow:    stop.active ? "0 0 20px rgba(200,228,74,0.7), 0 0 6px rgba(200,228,74,0.5)" : "none",
                  marginTop:    stop.active ? "0px" : "4px",
                  transition:   "all 0.3s",
                }} />

                {/* Label */}
                <div
                  className="deleg-node-label"
                  style={{
                    fontFamily:    "'Space Grotesk', sans-serif",
                    fontWeight:    stop.active ? 700 : 600,
                    fontSize:      "clamp(10px, 0.9vw, 13px)",
                    letterSpacing: "0.16em",
                    color:         stop.active ? "#C8E44A" : "rgba(255,255,255,0.78)",
                    textTransform: "uppercase",
                    textAlign:     "center",
                    whiteSpace:    "nowrap",
                  }}>{stop.label}</div>

                {/* "NOW" tag under Flights */}
                {stop.active && (
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: "8px", letterSpacing: "0.24em",
                    color: "rgba(200,228,74,0.65)", textTransform: "uppercase",
                    marginTop: "-6px",
                  }}>Now</div>
                )}
              </div>
            ))}
          </div>
          </div>{/* end deleg-track scroll wrapper */}
        </div>

      </div>
    </section>
  );
}
