import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OLD_ITEMS = [
  "Search across tabs",
  "Compare manually",
  "Re-enter details repeatedly",
  "Hope you picked the right option",
];

const NEW_ITEMS = [
  "Tell Kaivo what you need",
  "Review a curated shortlist",
  "Approve once",
  "Relax while Kaivo handles the rest",
];

// ── Decorative barcode SVG ─────────────────────────────────────────────────────
function Barcode() {
  const allW = [3,1,2,1,1,3,2,1,2,1,1,3,1,2,2,1,3,1,2,1,1,3,2,1,2,1,1,2,3,1];
  const bars: [number, number][] = [];
  let x = 0;
  allW.forEach((w, i) => {
    if (i % 2 === 0) bars.push([x, w]);
    x += w + 0.6;
  });
  return (
    <svg width={x} height={38} viewBox={`0 0 ${x} 38`} aria-hidden>
      {bars.map(([bx, bw], i) => (
        <rect key={i} x={bx} y={0} width={bw} height={38}
          fill="rgba(255,255,255,0.5)" rx="0.4" />
      ))}
    </svg>
  );
}

// ── Plane icon — minimal navy glyph ───────────────────────────────────────────
function PlaneRight({ color = "#1B4A5A", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"
      style={{ transform: "rotate(90deg)" }}>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

export function ProductSection() {
  const sectionRef  = useRef<HTMLElement>(null);

  // strip
  const wipeLineRef  = useRef<HTMLDivElement>(null);
  const wipePlaneRef = useRef<HTMLDivElement>(null);

  // above-card
  const badgeRef    = useRef<HTMLDivElement>(null);
  const head0       = useRef<HTMLDivElement>(null);
  const head1       = useRef<HTMLDivElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);

  // card
  const cardRef     = useRef<HTMLDivElement>(null);
  const sheenRef    = useRef<HTMLDivElement>(null);
  const routeRef    = useRef<HTMLDivElement>(null);
  const specRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const oldRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const newRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const chipOldRef  = useRef<HTMLDivElement>(null);
  const chipNewRef  = useRef<HTMLDivElement>(null);
  const stubRef     = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Transition strip ─────────────────────────────────────────────────
      const stripW = wipeLineRef.current?.parentElement?.offsetWidth ?? window.innerWidth;
      gsap.set(wipeLineRef.current,  { scaleX: 0, transformOrigin: "left center" });
      gsap.set(wipePlaneRef.current, { x: 0 });
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 50%", scrub: 1 },
      })
        .to(wipeLineRef.current,  { scaleX: 1, ease: "none" })
        .to(wipePlaneRef.current, { x: stripW - 28, ease: "none" }, 0);

      // ── Text + card entrance — single timeline, fires once ───────────────
      gsap.set(badgeRef.current,              { opacity: 0, y: 14 });
      gsap.set([head0.current, head1.current],{ y: "110%" });
      gsap.set(bodyRef.current,               { opacity: 0, filter: "blur(6px)", y: 14 });
      // Card is dealt in like a physical pass: 3-D tilt from below + sheen sweep
      gsap.set(cardRef.current, {
        opacity: 0, y: 110, scale: 0.94, rotateX: -38,
        transformPerspective: 1100, transformOrigin: "50% 100%",
      });
      gsap.set(sheenRef.current, { xPercent: -140 });
      gsap.set(routeRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(specRefs.current.filter(Boolean), { opacity: 0, y: 12 });
      gsap.set([chipOldRef.current, chipNewRef.current], { opacity: 0, y: 36 });
      gsap.set(oldRefs.current.filter(Boolean),{ opacity: 0, x: -14 });
      gsap.set(newRefs.current.filter(Boolean),{ opacity: 0, x: 14 });
      gsap.set(stubRef.current, { opacity: 0, y: 12 });

      const entryTl = gsap.timeline({ paused: true });
      entryTl
        .to(badgeRef.current,  { opacity: 1, y: 0,  duration: 0.5,  ease: "power2.out" }, 0)
        .to(head0.current,     { y: "0%",            duration: 0.85, ease: "power4.out" }, 0.15)
        .to(head1.current,     { y: "0%",            duration: 0.85, ease: "power4.out" }, 0.30)
        .to(bodyRef.current,   { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.65, ease: "power2.out" }, 0.52)
        // the pass lands
        .to(cardRef.current,   { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.05, ease: "power4.out" }, 0.42)
        // route line draws across, specs tick in
        .to(routeRef.current,  { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 1.0)
        .to(specRefs.current.filter(Boolean), { opacity: 1, y: 0, stagger: 0.09, duration: 0.45, ease: "power2.out" }, 1.15)
        // glossy sheen sweeps over the settled pass
        .to(sheenRef.current,  { xPercent: 140, duration: 0.9, ease: "power2.inOut" }, 1.30)
        .to(stubRef.current,   { opacity: 1, y: 0,  duration: 0.6,  ease: "power2.out" }, 1.45)
        // comparison chips rise underneath
        .to([chipOldRef.current, chipNewRef.current], { opacity: 1, y: 0, stagger: 0.14, duration: 0.7, ease: "back.out(1.4)" }, 1.55)
        .to(oldRefs.current.filter(Boolean), { opacity: 1, x: 0, stagger: 0.10, duration: 0.5, ease: "power2.out" }, 1.85)
        .to(newRefs.current.filter(Boolean), { opacity: 1, x: 0, stagger: 0.10, duration: 0.5, ease: "power2.out" }, 1.95);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 75%",
        once:    true,
        onEnter: () => entryTl.play(),
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "white", position: "relative", overflow: "hidden" }}
    >

      {/* ── Transition strip ─────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", height: "56px", background: "white",
        borderTop: "1px solid rgba(27,74,90,0.06)", overflow: "hidden",
      }}>
        <div ref={wipeLineRef} style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 0, borderTop: "1.5px dashed #1B4A5A",
          transform: "scaleX(0)", transformOrigin: "left center",
        }} />
        <div ref={wipePlaneRef} style={{
          position: "absolute", top: "50%", left: 0,
          transform: "translateY(-50%)", lineHeight: 0, zIndex: 2,
        }}>
          <PlaneRight color="#1B4A5A" size={30} />
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: "clamp(28px, 4vh, 52px) clamp(20px, 5vw, 60px) clamp(36px, 6vh, 72px)",
        maxWidth: "960px",
        margin: "0 auto",
        position: "relative",
      }}>

        {/* Watermark */}
        <div aria-hidden style={{
          position: "absolute", right: "-1%", top: "50%",
          transform: "translateY(-46%)",
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
          fontSize: "clamp(130px, 19vw, 290px)",
          color: "rgba(27,74,90,0.025)",
          lineHeight: 1, pointerEvents: "none", userSelect: "none",
          letterSpacing: "-0.05em",
        }}>05</div>

        {/* Badge */}
        <div ref={badgeRef} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          border: "1.5px solid rgba(27,74,90,0.15)",
          borderRadius: "100px",
          padding: "7px 18px",
          marginBottom: "18px", opacity: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="1.5" y="3" width="9" height="6" rx="1"
              stroke="rgba(27,74,90,0.4)" strokeWidth="1.2"/>
            <path d="M1.5 5.5H10.5" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2"/>
            <path d="M4.5 7.5H7.5" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
            color: "#1B4A5A", textTransform: "uppercase",
          }}>Product</span>
        </div>

        {/* Headline */}
        <div style={{ overflow: "hidden", lineHeight: 1, marginBottom: "3px" }}>
          <div ref={head0} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(32px, 4.2vw, 62px)",
            color: "#1B4A5A", lineHeight: 1.0, letterSpacing: "-0.028em",
          }}>
            From tabs and forms
          </div>
        </div>
        <div style={{ overflow: "hidden", lineHeight: 1, marginBottom: "16px" }}>
          <div ref={head1} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(32px, 4.2vw, 62px)",
            color: "#7ECECA", lineHeight: 1.0, letterSpacing: "-0.028em",
          }}>
            to one clear decision.
          </div>
        </div>

        {/* Body */}
        <p ref={bodyRef} style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800, fontSize: "clamp(14px, 1.2vw, 16px)",
          color: "rgba(27,74,90,0.90)", lineHeight: 1.7,
          margin: "0 0 24px", maxWidth: "540px", opacity: 0,
        }}>
          Instead of forcing you through endless search flows, Kaivo prepares a shortlist
          built around your preferences, priorities, timing, and trade-offs.
        </p>

        {/* ══════════════════════ BOARDING PASS CARD ══════════════════════════ */}
        <div
          ref={cardRef}
          style={{
            position: "relative",
            borderRadius: "28px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #20454E 0%, #14333D 45%, #0C2129 100%)",
            boxShadow: "0 34px 80px rgba(12,33,41,0.38), 0 6px 18px rgba(12,33,41,0.18)",
            border: "1px solid rgba(255,255,255,0.07)",
            opacity: 0,
            willChange: "transform",
          }}
        >
          {/* Side notches — physical ticket cutouts */}
          <div aria-hidden style={{
            position: "absolute", left: -12, top: "46%",
            width: 24, height: 24, borderRadius: "50%",
            background: "white", zIndex: 3,
          }} />
          <div aria-hidden style={{
            position: "absolute", right: -12, top: "46%",
            width: 24, height: 24, borderRadius: "50%",
            background: "white", zIndex: 3,
          }} />

          {/* Glossy sheen — swept across by GSAP (sits behind content) */}
          <div ref={sheenRef} aria-hidden style={{
            position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
            background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.10) 50%, transparent 62%)",
            pointerEvents: "none", zIndex: 1,
          }} />

          {/* ── Header row: brand mark · boarding pass · ref ───────────────── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "22px 28px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                width: 30, height: 30, borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.25)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" aria-hidden>
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "10px", letterSpacing: "0.26em",
                color: "rgba(255,255,255,0.70)", textTransform: "uppercase",
              }}>
                Kaivo Travel&nbsp;&nbsp;·&nbsp;&nbsp;Boarding Pass
              </span>
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "11px", letterSpacing: "0.22em",
              color: "#C8E44A", textTransform: "uppercase",
            }}>
              KV — 001
            </span>
          </div>

          {/* ── Route: TWS ——————▶ KVO ─────────────────────────────────────── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 40px)",
            padding: "26px 28px 8px",
          }}>
            {/* FROM */}
            <div style={{ minWidth: 0, flexShrink: 0 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: "clamp(34px, 4.6vw, 64px)",
                color: "white", lineHeight: 1, letterSpacing: "-0.02em",
              }}>TWS</div>
              <div style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700, fontSize: "13px",
                color: "rgba(255,255,255,0.55)", marginTop: "6px",
              }}>The Old Way</div>
            </div>

            {/* Route line — drawn by GSAP, arrowhead at destination */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", minWidth: "60px" }}>
              <div ref={routeRef} style={{
                flex: 1, height: "1.5px",
                background: "rgba(255,255,255,0.30)",
                transform: "scaleX(0)", transformOrigin: "left center",
              }} />
              <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0, marginLeft: "-1px" }} aria-hidden>
                <path d="M1 1L11 6L1 11V1Z" fill="rgba(255,255,255,0.75)" />
              </svg>
            </div>

            {/* TO */}
            <div style={{ textAlign: "right", minWidth: 0, flexShrink: 0 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: "clamp(34px, 4.6vw, 64px)",
                color: "white", lineHeight: 1, letterSpacing: "-0.02em",
              }}>KVO</div>
              <div style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700, fontSize: "13px",
                color: "rgba(255,255,255,0.55)", marginTop: "6px",
              }}>Better Outcomes</div>
            </div>
          </div>

          {/* ── Specs row (below the notch line) ───────────────────────────── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center",
            gap: "clamp(24px, 4vw, 64px)",
            padding: "20px 28px",
            marginTop: "12px",
            borderTop: "1px dashed rgba(255,255,255,0.14)",
          }}>
            {[
              { label: "Passenger", value: "You" },
              { label: "Class",     value: "First" },
              { label: "Seat",      value: "1A" },
              { label: "Date",      value: "Anytime" },
            ].map(({ label, value }, i) => (
              <div key={label} ref={(el) => { specRefs.current[i] = el; }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "8.5px", letterSpacing: "0.24em",
                  color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
                  marginBottom: "5px", fontWeight: 700,
                }}>{label}</div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: "15px",
                  color: "rgba(255,255,255,0.95)", letterSpacing: "0.03em",
                }}>{value}</div>
              </div>
            ))}
            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Barcode />
            </div>
          </div>

          {/* ── Bottom row: tagline pill + lime pill ───────────────────────── */}
          <div
            ref={stubRef}
            className="product-stub"
            style={{
              position: "relative", zIndex: 2,
              display: "flex", alignItems: "center", gap: "14px",
              flexWrap: "wrap",
              padding: "4px 28px 28px",
              opacity: 0,
            }}
          >
            <div style={{
              flex: "1 1 260px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "16px",
              padding: "13px 22px",
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 700, fontSize: "clamp(12px, 1.15vw, 14.5px)",
              color: "rgba(255,255,255,0.92)",
              textAlign: "center",
              lineHeight: 1.4,
            }}>
              We exist to help you make better decisions, faster.
            </div>
            <div style={{
              flex: "1 1 260px",
              background: "#C8E44A",
              borderRadius: "16px",
              padding: "13px 22px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "clamp(10px, 1vw, 12px)",
              letterSpacing: "0.06em",
              color: "#0C2129",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.5,
              boxShadow: "0 10px 28px rgba(200,228,74,0.25)",
            }}>
              ✓ Natural-language booking · One review · One approval
            </div>
          </div>

        </div>{/* end boarding pass card */}

        {/* ── Comparison chips — rise underneath the pass ─────────────────────── */}
        <div className="product-card-body" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "18px", marginTop: "20px",
        }}>
          {/* The Old Way */}
          <div ref={chipOldRef} style={{
            background: "white",
            border: "1px solid rgba(27,74,90,0.10)",
            borderRadius: "18px",
            boxShadow: "0 16px 44px rgba(12,33,41,0.10)",
            padding: "20px 24px",
            opacity: 0,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.25em",
              color: "rgba(27,74,90,0.88)", textTransform: "uppercase",
              marginBottom: "14px",
            }}>The Old Way</div>

            {OLD_ITEMS.map((item, i) => (
              <div
                key={item}
                ref={(el) => { oldRefs.current[i] = el; }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "9px",
                  marginBottom: i < OLD_ITEMS.length - 1 ? "11px" : 0,
                  opacity: 0,
                }}
              >
                <span style={{
                  color: "rgba(27,74,90,0.55)", fontSize: "13px",
                  lineHeight: "1.4", flexShrink: 0, fontWeight: 700,
                }}>×</span>
                <span style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700, fontSize: "clamp(12px, 1.05vw, 14px)",
                  color: "rgba(27,74,90,0.78)", lineHeight: 1.45,
                }}>{item}</span>
              </div>
            ))}
          </div>

          {/* With Kaivo */}
          <div ref={chipNewRef} style={{
            background: "linear-gradient(135deg, #1E4049 0%, #12303A 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "18px",
            boxShadow: "0 16px 44px rgba(12,33,41,0.22)",
            padding: "20px 24px",
            opacity: 0,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.25em",
              color: "#C8E44A", textTransform: "uppercase",
              marginBottom: "14px",
            }}>With Kaivo</div>

            {NEW_ITEMS.map((item, i) => (
              <div
                key={item}
                ref={(el) => { newRefs.current[i] = el; }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "9px",
                  marginBottom: i < NEW_ITEMS.length - 1 ? "11px" : 0,
                  opacity: 0,
                }}
              >
                <span style={{
                  color: "#C8E44A", fontSize: "12px",
                  lineHeight: "1.4", flexShrink: 0, fontWeight: 700,
                }}>✓</span>
                <span style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700, fontSize: "clamp(12px, 1.05vw, 14px)",
                  color: "rgba(255,255,255,0.95)", lineHeight: 1.45,
                }}>{item}</span>
              </div>
            ))}
          </div>
        </div>{/* end comparison chips */}
      </div>
    </section>
  );
}
