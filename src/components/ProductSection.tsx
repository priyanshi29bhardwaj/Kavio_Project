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

// ── Plane icon ─────────────────────────────────────────────────────────────────
function PlaneRight({ size = 16 }: { color?: string; size?: number }) {
  return <img src="/aeroplane.png" alt="plane" width={size} height={size} style={{ objectFit: "contain" }} />;
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
  const oldRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const newRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const perfRef     = useRef<HTMLDivElement>(null);
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
      gsap.set(cardRef.current,               { opacity: 0, y: 44, scale: 0.98 });
      gsap.set(oldRefs.current.filter(Boolean),{ opacity: 0, x: -16 });
      gsap.set(newRefs.current.filter(Boolean),{ opacity: 0, x: 16 });
      gsap.set(perfRef.current,               { scaleX: 0, transformOrigin: "left center" });
      gsap.set(stubRef.current,               { opacity: 0, y: 14 });

      const entryTl = gsap.timeline({ paused: true });
      entryTl
        .to(badgeRef.current,  { opacity: 1, y: 0,  duration: 0.5,  ease: "power2.out" }, 0)
        .to(head0.current,     { y: "0%",            duration: 0.85, ease: "power4.out" }, 0.15)
        .to(head1.current,     { y: "0%",            duration: 0.85, ease: "power4.out" }, 0.30)
        .to(bodyRef.current,   { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.65, ease: "power2.out" }, 0.52)
        .to(cardRef.current,   { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" }, 0.42)
        .to(oldRefs.current.filter(Boolean), { opacity: 1, x: 0, stagger: 0.12, duration: 0.6,  ease: "power2.out" }, 0.80)
        .to(newRefs.current.filter(Boolean), { opacity: 1, x: 0, stagger: 0.12, duration: 0.6,  ease: "power2.out" }, 0.80)
        .to(perfRef.current,   { scaleX: 1,          duration: 2.0,  ease: "power1.inOut" }, 1.10)
        .to(stubRef.current,   { opacity: 1, y: 0,  duration: 0.7,  ease: "power2.out" }, 2.60);

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
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 18px 56px rgba(27,74,90,0.11), 0 3px 12px rgba(27,74,90,0.06)",
            border: "1px solid rgba(27,74,90,0.09)",
            opacity: 0,
          }}
        >

          {/* ── HEADER — dark teal ─────────────────────────────────────────── */}
          <div style={{ background: "#1B4A5A", padding: "18px 24px 16px" }}>

            {/* Top row: brand · title · flight no */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "14px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "10px", letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.80)", textTransform: "uppercase",
              }}>
                Kaivo Travel
              </span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: "9px", letterSpacing: "0.32em",
                color: "rgba(255,255,255,0.65)", textTransform: "uppercase",
              }}>
                Boarding Pass
              </span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em",
                color: "#C8E44A",
              }}>
                KV — 001
              </span>
            </div>

            {/* FROM ✈ TO */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

              {/* FROM */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "7px", letterSpacing: "0.26em",
                  color: "rgba(255,255,255,0.65)", textTransform: "uppercase",
                  marginBottom: "2px",
                }}>From</div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900, fontSize: "clamp(22px, 3.2vw, 44px)",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1, letterSpacing: "-0.02em",
                }}>TWS</div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 800, fontSize: "12px",
                  color: "rgba(255,255,255,0.90)", marginTop: "2px",
                }}>The Old Way</div>
              </div>

              {/* Flight path */}
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: "8px",
                paddingBottom: "8px",
              }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                <PlaneRight color="rgba(126,206,202,0.65)" size={24} />
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </div>

              {/* TO */}
              <div style={{ textAlign: "right", minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "9px", letterSpacing: "0.26em",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.75)", textTransform: "uppercase",
                  marginBottom: "2px",
                }}>To</div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900, fontSize: "clamp(22px, 3.2vw, 44px)",
                  color: "white",
                  lineHeight: 1, letterSpacing: "-0.02em",
                }}>KVO</div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 800, fontSize: "12px",
                  color: "rgba(255,255,255,0.90)", marginTop: "2px",
                }}>Better Outcomes</div>
              </div>
            </div>

            {/* Flight details row */}
            <div style={{
              display: "flex", gap: "28px",
              marginTop: "14px", paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}>
              {[
                { label: "Passenger", value: "You" },
                { label: "Class",     value: "First" },
                { label: "Seat",      value: "1A" },
                { label: "Date",      value: "Anytime" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "6.5px", letterSpacing: "0.24em",
                    color: "rgba(255,255,255,0.60)", textTransform: "uppercase",
                    marginBottom: "3px",
                  }}>{label}</div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: "13px",
                    color: "rgba(255,255,255,0.92)", letterSpacing: "0.04em",
                  }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BODY — two-column comparison ───────────────────────────────── */}
          <div className="product-card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

            {/* Left: old way */}
            <div style={{
              padding: "20px 22px",
              background: "rgba(27,74,90,0.025)",
              borderRight: "1px solid rgba(27,74,90,0.07)",
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

            {/* Right: with Kaivo */}
            <div style={{ padding: "20px 22px", background: "#1B4A5A" }}>
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
          </div>

          {/* ── PERFORATED TEAR LINE ─────────────────────────────────────────── */}
          <div style={{
            background: "white",
            display: "flex", alignItems: "center",
            padding: "10px 0",
            position: "relative",
          }}>
            {/* Left semicircle notch (white circle over card border) */}
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "white",
              border: "1px solid rgba(27,74,90,0.09)",
              flexShrink: 0,
              marginLeft: -10, zIndex: 2,
            }} />
            {/* Dashed line */}
            <div
              ref={perfRef}
              style={{
                flex: 1,
                height: 0,
                borderTop: "2px dashed rgba(27,74,90,0.40)",
                transform: "scaleX(0)",
                transformOrigin: "left center",
                margin: "0 4px",
              }}
            />
            {/* Scissors label */}
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px", letterSpacing: "0.22em",
              color: "rgba(27,74,90,0.65)", textTransform: "uppercase",
              flexShrink: 0, padding: "0 10px",
              fontWeight: 700,
            }}>
              ✂ Tear Here
            </span>
            <div style={{
              flex: 1, height: 0,
              borderTop: "2px dashed rgba(27,74,90,0.40)",
            }} />
            {/* Right semicircle notch */}
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "white",
              border: "1px solid rgba(27,74,90,0.09)",
              flexShrink: 0,
              marginRight: -10, zIndex: 2,
            }} />
          </div>

          {/* ── STUB ─────────────────────────────────────────────────────────── */}
          <div
            ref={stubRef}
            className="product-stub"
            style={{
              background: "#1B4A5A",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              opacity: 0,
            }}
          >
            <div>
              <div style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700, fontSize: "clamp(12px, 1.2vw, 15px)",
                color: "white", marginBottom: "5px", lineHeight: 1.3,
              }}>
                We exist to help you make better decisions, faster.
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.92)",
              }}>
                Natural-language booking&nbsp;&nbsp;·&nbsp;&nbsp;One review&nbsp;&nbsp;·&nbsp;&nbsp;One approval
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Barcode />
            </div>
          </div>

        </div>{/* end boarding pass card */}
      </div>
    </section>
  );
}
