import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Plane icon ────────────────────────────────────────────────────────────────
function PlaneRight({ color = "#7ECECA", size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <g transform="rotate(90 12 12)">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </g>
    </svg>
  );
}

// ── Feature icons ─────────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke="#1B4A5A" strokeWidth="1.5" />
      <path d="M11 6.5V11L13.5 13.5" stroke="#1B4A5A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke="#1B4A5A" strokeWidth="1.5" />
      <path d="M7.5 11L10 13.5L14.5 8.5" stroke="#1B4A5A" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TrendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M3.5 15.5L8.5 9.5L12.5 12.5L18 6.5"
        stroke="#1B4A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 6.5H18V10"
        stroke="#1B4A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURES = [
  { title: "Saves hours",      body: "Less searching. Less comparing. Less admin." },
  { title: "Gets it right",   body: "Built around your timing, baggage, budget, airline preferences, and trade-offs." },
  { title: "Learns over time", body: "The more you use Kaivo, the less you have to explain." },
] as const;

const NO_ITEMS = [
  "No tabs.", "No repeated forms.", "No restarting searches.", "No second-guessing.",
] as const;

function FeatureIcon({ i }: { i: number }) {
  if (i === 0) return <ClockIcon />;
  if (i === 1) return <CheckCircleIcon />;
  return <TrendIcon />;
}

export function WhyLoveSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Flight path refs
  const lineContRef = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const planeRef    = useRef<HTMLDivElement>(null);

  // Content refs
  const badgeRef  = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Banner inner refs
  const bannerLineRef   = useRef<HTMLDivElement>(null);
  const bannerText1Ref  = useRef<HTMLDivElement>(null);
  const bannerText2Ref  = useRef<HTMLDivElement>(null);
  const bannerAccentRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Flight path scrub ──────────────────────────────────────────────
      const cont  = lineContRef.current;
      const line  = lineRef.current;
      const plane = planeRef.current;
      if (cont && line && plane) {
        gsap.set(line,  { clipPath: "inset(0 100% 0 0)" });
        gsap.set(plane, { x: 0 });
        const endX = cont.offsetWidth - (plane.offsetWidth || 28);
        gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 25%", scrub: 1 },
        })
          .to(line,  { clipPath: "inset(0 0% 0 0)", ease: "none" })
          .to(plane, { x: endX,                      ease: "none" }, 0);
      }

      // ── Content entrance ──────────────────────────────────────────────
      gsap.set(badgeRef.current,                 { opacity: 0, y: 14 });
      gsap.set(headRef.current,                  { opacity: 0, y: 28 });
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 28 });
      gsap.set(bannerRef.current,                { opacity: 0, y: 18 });
      gsap.set(bottomRef.current,                { opacity: 0, y: 14 });
      gsap.set(bannerLineRef.current,                            { scaleX: 0, transformOrigin: "left center" });
      gsap.set([bannerText1Ref.current, bannerText2Ref.current], { y: "108%" });

      const tl = gsap.timeline({ paused: true });
      tl
        .to(badgeRef.current,       { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        .to(headRef.current,        { opacity: 1, y: 0, duration: 0.7,  ease: "power3.out" }, 0.18)
        .to(cardRefs.current,       { opacity: 1, y: 0, duration: 0.6,  stagger: 0.15, ease: "power2.out" }, 0.40)
        .to(bannerRef.current,      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.82)
        .to(bannerLineRef.current,  { scaleX: 1,        duration: 0.45, ease: "power2.inOut" }, 0.92)
        .to(bannerText1Ref.current, { y: "0%",          duration: 0.72, ease: "power4.out"  }, 0.99)
        .to(bannerText2Ref.current, { y: "0%",          duration: 0.72, ease: "power4.out"  }, 1.14)
        .to(bottomRef.current,      { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 1.30);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 70%",
        once:    true,
        onEnter: () => {
          tl.play();
          gsap.to(bannerAccentRef.current, {
            textShadow: "0 0 24px rgba(200,228,74,0.85), 0 0 8px rgba(200,228,74,0.55)",
            repeat: -1, yoyo: true, duration: 2.2, ease: "sine.inOut", delay: 1.6,
          });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background:    "white",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        position:      "relative",
        overflow:      "hidden",
        padding:       "0 0 clamp(32px, 4vh, 52px)",
      }}
    >
      {/* Bottom gradient seam → PurposeSection */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "200px",
        background: "linear-gradient(to bottom, transparent 0%, #f0f9f9 55%, #D6EEEE 100%)",
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
      }}>08</div>

      {/* ── Full-width dashed flight path ─────────────────────────────── */}
      <div ref={lineContRef} style={{ position: "relative", height: "36px", width: "100%", flexShrink: 0 }}>
        <div ref={lineRef} style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 0, borderTop: "1.5px dashed #7ECECA",
          transform: "translateY(-50%)",
        }} />
        <div ref={planeRef} style={{
          position: "absolute", top: "50%", left: 0,
          transform: "translateY(-50%)", lineHeight: 0,
        }}>
          <PlaneRight color="#7ECECA" size={28} />
        </div>
      </div>

      {/* ── Centred content stack ─────────────────────────────────────── */}
      <div style={{
        maxWidth:      "1120px",
        width:         "100%",
        padding:       "clamp(22px, 3vh, 36px) clamp(20px, 4vw, 60px) 0",
        position:      "relative",
        zIndex:        1,
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           "clamp(20px, 2.8vh, 32px)",
      }}>

        {/* ── Badge + Headline (centred) ────────────────────────────── */}
        <div style={{ textAlign: "center", maxWidth: "820px" }}>
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(27,74,90,0.15)", borderRadius: "100px",
            padding: "7px 18px", marginBottom: "16px",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 12.5C7 12.5 1.5 9 1.5 5C1.5 3.07 3.07 1.5 5 1.5C5.97 1.5 6.84 1.9 7 2C7.16 1.9 8.03 1.5 9 1.5C10.93 1.5 12.5 3.07 12.5 5C12.5 9 7 12.5 7 12.5Z"
                stroke="#E8622A" strokeWidth="1.2" fill="rgba(232,98,42,0.1)" />
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
              color: "#1B4A5A", textTransform: "uppercase",
            }}>Why People Will Love It</span>
          </div>

          <div ref={headRef} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(30px, 3.6vw, 52px)",
            color: "#1B4A5A", lineHeight: 1.12, letterSpacing: "-0.03em",
          }}>
            The best travel product isn't the one with{" "}
            <span style={{ color: "#7ECECA" }}>the most options.</span>
            {" "}It's the one that gives you{" "}
            <span style={{ color: "#7ECECA" }}>your time back.</span>
          </div>
        </div>

        {/* ── Feature cards (3-col) ─────────────────────────────────── */}
        <div className="why-cards" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(12px, 1.5vw, 20px)", width: "100%",
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                background: "white", border: "1.5px solid rgba(27,74,90,0.08)",
                borderRadius: "16px", padding: "clamp(18px, 1.9vw, 26px)",
                boxShadow: "0 2px 20px rgba(27,74,90,0.06)",
                display: "flex", gap: "16px", alignItems: "flex-start", opacity: 0,
              }}
            >
              <div style={{
                width: "44px", height: "44px", flexShrink: 0, borderRadius: "50%",
                background: "rgba(126,206,202,0.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FeatureIcon i={i} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                  fontSize: "clamp(15px, 1.5vw, 19px)",
                  color: "#1B4A5A", lineHeight: 1.2, marginBottom: "6px",
                }}>{f.title}</div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  color: "rgba(27,74,90,0.82)", lineHeight: 1.65,
                }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Banner ────────────────────────────────────────────────── */}
        <div
          ref={bannerRef}
          style={{
            width: "100%", borderRadius: "16px", overflow: "hidden",
            position: "relative", minHeight: "clamp(82px, 11vh, 114px)",
            background: "linear-gradient(135deg, #1B4A5A 0%, #0b3244 55%, #1B4A5A 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", opacity: 0,
          }}
        >
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 72% 50%, rgba(126,206,202,0.16) 0%, transparent 62%)",
            pointerEvents: "none",
          }} />
          <div aria-hidden style={{
            position: "absolute", top: "12px", right: "20px",
            display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px",
            opacity: 0.2, pointerEvents: "none",
          }}>
            {Array.from({ length: 21 }).map((_, k) => (
              <div key={k} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#7ECECA" }} />
            ))}
          </div>
          <div ref={bannerLineRef} style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(to right, #C8E44A, rgba(200,228,74,0.3))",
          }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(16px, 2.2vh, 24px) 32px" }}>
            <div style={{ overflow: "hidden", lineHeight: 1.2, marginBottom: "2px" }}>
              <div ref={bannerText1Ref} style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
                fontSize: "clamp(16px, 1.8vw, 26px)", color: "white", letterSpacing: "-0.02em",
              }}>Your next trip, booked in under</div>
            </div>
            <div style={{ overflow: "hidden", lineHeight: 1.2 }}>
              <div ref={bannerText2Ref} style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
                fontSize: "clamp(16px, 1.8vw, 26px)", letterSpacing: "-0.02em",
              }}>
                <span ref={bannerAccentRef} style={{ color: "#C8E44A" }}>60 seconds.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom strip ──────────────────────────────────────────── */}
        <div
          ref={bottomRef}
          className="why-bottom"
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
            paddingTop: "clamp(10px, 1.4vh, 18px)",
            borderTop: "1px solid rgba(27,74,90,0.08)", opacity: 0,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", alignItems: "center" }}>
            {NO_ITEMS.map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                  fontSize: "clamp(13px, 1.2vw, 16px)", color: "rgba(27,74,90,0.80)",
                }}>
                  <span style={{ color: "#E8622A", fontWeight: 800 }}>No </span>
                  {item.replace("No ", "")}
                </span>
                {i < NO_ITEMS.length - 1 && (
                  <span style={{ margin: "0 12px", color: "rgba(27,74,90,0.28)", fontSize: "14px" }}>·</span>
                )}
              </span>
            ))}
          </div>
          <div style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
            fontSize: "clamp(13px, 1.2vw, 16px)", color: "#1B4A5A", whiteSpace: "nowrap",
          }}>
            Just say what you need.{" "}
            <span style={{ color: "rgba(27,74,90,0.72)", fontWeight: 700 }}>Kaivo handles the rest.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
