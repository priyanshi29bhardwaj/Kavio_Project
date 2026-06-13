import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Plane pointing up-right (takeoff, used in KAIVO row) ─────────────────────
function PlaneTakeoff({ color = "#C8E44A", size = 13 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

const rows = [
  { tool: "Search",               desc: "Browse and filter everything yourself.",            status: "DELAYED",  isKaivo: false },
  { tool: "Online Travel Agents", desc: "Compare endlessly, then book manually.",            status: "DELAYED",  isKaivo: false },
  { tool: "AI Chat",              desc: "Get answers — then start booking from scratch.",    status: "DELAYED",  isKaivo: false },
  { tool: "Kaivo",                desc: "Get matched, approve once, and move on.",           status: "BOARDING", isKaivo: true  },
];

/* ────────────────────────────────────────────────────────────────────────────
   CHAOS CARDS — the booking-junk storm. Each is a small fake UI fragment.
   Shared styling helpers keep them on-palette.                              */

const NAVY  = "#1B4A5A";
const LIME  = "#C8E44A";
const ORANGE = "#E8622A";
const TEAL  = "#7ECECA";

const chipStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "3px 8px",
  borderRadius: "100px",
  border: `1px solid rgba(27,74,90,0.25)`,
  color: NAVY,
  whiteSpace: "nowrap",
};

const cardBase: React.CSSProperties = {
  position: "absolute",
  background: "white",
  border: "1px solid rgba(27,74,90,0.14)",
  borderRadius: "8px",
  boxShadow: "0 14px 38px rgba(27,74,90,0.16)",
  fontFamily: "'Urbanist', sans-serif",
  color: NAVY,
  pointerEvents: "none",
  userSelect: "none",
  zIndex: 20,
  willChange: "transform, opacity",
};

const cardTitle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(27,74,90,0.55)",
  marginBottom: "8px",
};

function FakeTabBar() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
      {[ORANGE, LIME, TEAL].map((c) => (
        <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.8 }} />
      ))}
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(27,74,90,0.08)" }} />
    </div>
  );
}

/* Card definitions: pos in % of section, rotation deg, width px */
const CHAOS = [
  {
    top: "6%", left: "4%", rot: -7, w: 230,
    node: (
      <>
        <FakeTabBar />
        <div style={{ fontWeight: 800, fontSize: "12.5px", marginBottom: 4 }}>23 tabs open</div>
        <div style={{ fontSize: "11px", color: "rgba(27,74,90,0.65)", fontWeight: 600 }}>
          cheap-flights-NYC-final-v2 …
        </div>
      </>
    ),
  },
  {
    top: "10%", left: "70%", rot: 5, w: 240,
    node: (
      <>
        <div style={cardTitle}>Price comparison</div>
        <div style={{ display: "flex", gap: "10px", fontWeight: 800, fontSize: "14px" }}>
          <span>$432</span>
          <span style={{ color: ORANGE }}>$429</span>
          <span>$431</span>
        </div>
        <div style={{ fontSize: "10.5px", fontWeight: 600, color: "rgba(27,74,90,0.6)", marginTop: 4 }}>
          …same flight, three sites
        </div>
      </>
    ),
  },
  {
    top: "30%", left: "12%", rot: 4, w: 215,
    node: (
      <>
        <div style={cardTitle}>Filters</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          <span style={chipStyle}>Nonstop</span>
          <span style={chipStyle}>1 stop</span>
          <span style={{ ...chipStyle, borderColor: ORANGE, color: ORANGE }}>2+ stops?</span>
          <span style={chipStyle}>Morning</span>
          <span style={chipStyle}>Red-eye</span>
        </div>
      </>
    ),
  },
  {
    top: "55%", left: "5%", rot: -5, w: 235,
    node: (
      <>
        <div style={{ fontWeight: 800, fontSize: "12.5px", marginBottom: 6 }}>⚠ Session expired</div>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(27,74,90,0.65)" }}>
          Please re-enter passenger details to continue.
        </div>
      </>
    ),
  },
  {
    top: "72%", left: "22%", rot: 6, w: 220,
    node: (
      <>
        <div style={cardTitle}>Baggage rules</div>
        <div style={{ fontSize: "11.5px", fontWeight: 700 }}>
          Carry-on: 7kg? 8kg? 10kg?
        </div>
        <div style={{ fontSize: "10.5px", fontWeight: 600, color: ORANGE, marginTop: 4 }}>
          Depends on fare class…
        </div>
      </>
    ),
  },
  {
    top: "48%", left: "76%", rot: -6, w: 225,
    node: (
      <>
        <div style={{ fontWeight: 800, fontSize: "12px", marginBottom: 6 }}>We value your privacy 🍪</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{ ...chipStyle, background: NAVY, color: "white", border: "none" }}>Accept all</span>
          <span style={chipStyle}>Manage 312 partners</span>
        </div>
      </>
    ),
  },
  {
    top: "70%", left: "66%", rot: 8, w: 230,
    node: (
      <>
        <div style={cardTitle}>Price alert</div>
        <div style={{ fontWeight: 800, fontSize: "12.5px", color: ORANGE }}>
          Prices went up 12% ↑
        </div>
        <div style={{ fontSize: "10.5px", fontWeight: 600, color: "rgba(27,74,90,0.6)", marginTop: 4 }}>
          Book now to avoid further increases
        </div>
      </>
    ),
  },
  {
    top: "26%", left: "44%", rot: -3, w: 250,
    node: (
      <>
        <div style={cardTitle}>AI Chat</div>
        <div style={{
          background: "rgba(126,206,202,0.14)",
          borderRadius: "8px 8px 8px 2px",
          padding: "8px 10px",
          fontSize: "11px",
          fontWeight: 600,
          lineHeight: 1.5,
        }}>
          Here are 15 options you could consider! Would you like me to list 15 more?
        </div>
      </>
    ),
  },
  {
    top: "58%", left: "42%", rot: 3, w: 210,
    node: (
      <>
        <div style={cardTitle}>Verify you're human</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              height: 22,
              borderRadius: 3,
              background: i === 4 ? "rgba(200,228,74,0.45)" : "rgba(27,74,90,0.08)",
            }} />
          ))}
        </div>
        <div style={{ fontSize: "10px", fontWeight: 600, color: "rgba(27,74,90,0.55)", marginTop: 5 }}>
          Select all squares with traffic lights
        </div>
      </>
    ),
  },
  {
    top: "8%", left: "33%", rot: 9, w: 200,
    node: (
      <>
        <div style={cardTitle}>Seat map</div>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{
              width: 13, height: 13, borderRadius: 3,
              background: i % 5 === 0 ? "rgba(232,98,42,0.5)" : "rgba(27,74,90,0.10)",
            }} />
          ))}
        </div>
        <div style={{ fontSize: "10px", fontWeight: 700, color: ORANGE, marginTop: 5 }}>
          Window seats: +$47
        </div>
      </>
    ),
  },
] as const;

export function ProblemSection() {
  const sectionRef      = useRef<HTMLElement>(null);

  // left-column text
  const badgeRef        = useRef<HTMLDivElement>(null);
  const headlineInners  = useRef<(HTMLHeadingElement | null)[]>([]);  // h2s inside clip wrappers
  const dividerLineRef  = useRef<HTMLDivElement>(null);               // orange line
  const subheadRef      = useRef<HTMLSpanElement>(null);
  const bodyRef         = useRef<HTMLParagraphElement>(null);

  // table + chaos
  const rowRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const chaosRefs       = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    // noop — isMobile fixed at mount; resize across breakpoint requires reload,
    // same trade-off the rest of the site makes.
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      const headlines = headlineInners.current.filter(Boolean);
      const rowEls    = rowRefs.current.filter((el): el is HTMLDivElement => el !== null);

      /* ════════════════ MOBILE: original simple reveals ════════════════ */
      if (isMobile) {
        const trigger = { trigger: sectionRef.current, start: "top 65%" };

        gsap.fromTo(badgeRef.current, { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", scrollTrigger: trigger });

        gsap.fromTo(headlines, { y: "110%" },
          { y: "0%", stagger: 0.09, duration: 0.85, ease: "power4.out", scrollTrigger: trigger });

        gsap.fromTo(subheadRef.current, { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%" } });

        gsap.fromTo(bodyRef.current, { opacity: 0, filter: "blur(7px)", y: 18 },
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.1, ease: "power2.out",
            scrollTrigger: { trigger: bodyRef.current, start: "top 88%" } });

        gsap.fromTo(rowEls, { opacity: 0, x: 28 },
          { opacity: 1, x: 0, stagger: 0.13, duration: 0.65, ease: "power2.out",
            scrollTrigger: { trigger: rowRefs.current[0], start: "top 85%" } });
        return;
      }

      /* ════════════════ DESKTOP: pinned tab-storm timeline ════════════════ */
      const section = sectionRef.current!;
      const chaos   = chaosRefs.current.filter(Boolean) as HTMLDivElement[];

      // Idle drift — floats the card's inner wrapper so it never fights the
      // storm timeline (which transforms the outer card element).
      chaos.forEach((card, i) => {
        const inner = card.firstElementChild;
        if (!inner) return;
        gsap.to(inner, {
          y: `+=${10 + (i % 3) * 5}`,
          rotation: `+=${i % 2 === 0 ? 2 : -2}`,
          duration: 2.2 + (i % 4) * 0.45,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

      // Real content starts hidden
      gsap.set(badgeRef.current, { opacity: 0, y: 18 });
      gsap.set(headlines, { y: "110%" });
      gsap.set(subheadRef.current, { opacity: 0, y: 14 });
      gsap.set(bodyRef.current, { opacity: 0, filter: "blur(7px)", y: 18 });
      gsap.set(rowEls, { opacity: 0, x: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Phase 1 — the storm tidies itself: every junk card glides to the
      // comparison table, straightens out, and stacks onto its row slot —
      // chaos physically reorganizing into the clean answer.
      gsap.set(rowEls, { opacity: 0, x: 0 }); // rows wait in place (no slide)

      chaos.forEach((card, i) => {
        const slot = i % rowEls.length; // 10 cards distributed over 4 rows
        tl.to(card, {
          x: () => {
            const tr = rowEls[slot].getBoundingClientRect();
            const cr = card.getBoundingClientRect();
            return tr.left + tr.width / 2 - (cr.left + cr.width / 2);
          },
          y: () => {
            const tr = rowEls[slot].getBoundingClientRect();
            const cr = card.getBoundingClientRect();
            return tr.top + tr.height / 2 - (cr.top + cr.height / 2);
          },
          rotation: 0,
          scaleX: () => rowEls[slot].getBoundingClientRect().width / card.offsetWidth,
          scaleY: () => rowEls[slot].getBoundingClientRect().height / card.offsetHeight,
          duration: 0.5,
          ease: "power3.inOut",
        }, i * 0.03);
      });

      // Cards have fused into row-shaped slabs — crossfade them into the
      // real table rows in the exact same spot.
      tl.to(chaos, { opacity: 0, duration: 0.14, ease: "power1.inOut" }, 0.62)
        .to(rowEls, { opacity: 1, stagger: 0.035, duration: 0.14, ease: "power1.inOut" }, 0.62);

      // Phase 2 — left column rises alongside the table forming
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.42)
        .to(headlines, { y: "0%", stagger: 0.05, duration: 0.25, ease: "power4.out" }, 0.46)
        .to(subheadRef.current, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.62)
        .to(bodyRef.current, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.2, ease: "power2.out" }, 0.68)
        .to({}, { duration: 0.14 }); // brief hold once settled

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="problem-section"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 120% 90% at 50% 0%, #14333F 0%, #0B222C 60%, #081A22 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes kaivo-boarding-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,228,74,0.45); }
          50%      { box-shadow: 0 0 18px 2px rgba(200,228,74,0.25); }
        }
        @keyframes kaivo-dot-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>
      {/* ── Chaos storm (desktop only) ────────────────────────────────────── */}
      {!isMobile && CHAOS.map((c, i) => (
        <div
          key={i}
          ref={(el) => { chaosRefs.current[i] = el; }}
          style={{
            ...cardBase,
            top: c.top,
            left: c.left,
            width: c.w,
            padding: "14px 16px",
            transform: `rotate(${c.rot}deg)`,
          }}
        >
          <div>{c.node}</div>
        </div>
      ))}

      <div className="problem-inner" style={{ maxWidth: "1160px", margin: "0 auto", width: "100%" }}>
        {/* ── Two-column grid ───────────────────────────────────────────────── */}
        <div className="problem-grid">

          {/* ── Left: text ──────────────────────────────────────────────────── */}
          <div>

            {/* Badge */}
            <div
              ref={badgeRef}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                border: "1.5px solid rgba(126,206,202,0.35)",
                borderRadius: "100px",
                padding: "7px 18px",
                marginBottom: "34px",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="4.8" stroke="rgba(126,206,202,0.7)" strokeWidth="1.2"/>
                <path d="M6 3.8V6.2" stroke="rgba(126,206,202,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="6" cy="8.2" r="0.55" fill="rgba(126,206,202,0.7)"/>
              </svg>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
                color: "#7ECECA", textTransform: "uppercase",
              }}>
                The Problem
              </span>
            </div>

            {/* Clip-reveal headlines — each h2 sits inside overflow:hidden */}
            {(["You were", "promised", "convenience."] as const).map((text, i) => (
              <div
                key={text}
                style={{
                  overflow: "hidden",
                  lineHeight: 1,
                  marginBottom: i < 2 ? "6px" : "0",
                }}
              >
                <h2
                  ref={(el) => { headlineInners.current[i] = el; }}
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(40px, 4.8vw, 74px)",
                    color: i === 2 ? "#C8E44A" : "white",
                    lineHeight: 1.0,
                    margin: 0,
                    letterSpacing: "-0.025em",
                    display: "block",
                  }}
                >
                  {text}
                </h2>
              </div>
            ))}

            {/* Divider + sub-headline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                margin: "36px 0 24px",
              }}
            >
              <div ref={dividerLineRef} style={{ display: "none" }} />
              {/* Animated sub-headline */}
              <span
                ref={subheadRef}
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(15px, 1.6vw, 22px)",
                  color: "#E8622A",
                  display: "block",
                }}
              >
                Instead, you got work.
              </span>
            </div>

            {/* Body — blur reveal */}
            <p
              ref={bodyRef}
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(14px, 1.35vw, 17px)",
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.85,
                margin: 0,
                maxWidth: "420px",
              }}
            >
              <strong style={{ fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>
                Tabs. Filters. Re-entering details. Comparing policies.
                Checking baggage rules. Wondering if there's a better option.
              </strong>
              <br /><br />
              <strong style={{ fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>
                Search gave access. Comparison sites multiplied decisions.
                AI sped up answers.
              </strong>{" "}
              <strong style={{ color: "#C8E44A", fontWeight: 900 }}>
                But you still do the work.
              </strong>
            </p>
          </div>

          {/* ── Right: departures board ─────────────────────────────────────── */}
          <div>
            <div
              className="problem-card"
              style={{
                background: "rgba(4,16,22,0.6)",
                border: "1px solid rgba(126,206,202,0.18)",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(126,206,202,0.12)",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* Board header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  borderBottom: "1px dashed rgba(126,206,202,0.25)",
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: "11px", letterSpacing: "0.34em",
                  color: "#C8E44A", textTransform: "uppercase",
                }}>
                  <PlaneTakeoff color="#C8E44A" size={12} />
                  Departures
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: "10px", letterSpacing: "0.22em",
                  color: "rgba(126,206,202,0.6)", textTransform: "uppercase",
                }}>
                  Terminal K
                </div>
              </div>

              {rows.map(({ tool, desc, status, isKaivo }, i) => (
                <div
                  key={tool}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className="problem-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: isKaivo ? "rgba(200,228,74,0.10)" : "transparent",
                    borderBottom: i < rows.length - 1 ? "1px solid rgba(126,206,202,0.10)" : "none",
                    borderLeft: isKaivo ? "3px solid #C8E44A" : "3px solid transparent",
                    gap: "18px",
                    minHeight: "72px",
                    padding: "12px 22px 12px 19px",
                  }}
                >
                  {/* Status dot */}
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      flexShrink: 0,
                      background: isKaivo ? "#C8E44A" : "#E8622A",
                      animation: isKaivo ? "kaivo-dot-blink 1.6s ease-in-out infinite" : "none",
                      boxShadow: isKaivo ? "0 0 8px rgba(200,228,74,0.7)" : "none",
                    }}
                  />

                  {/* Tool name */}
                  <div
                    className="problem-row-tool"
                    style={{
                      flexShrink: 0,
                      width: "clamp(90px, 11vw, 150px)",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(10px, 1.05vw, 12.5px)",
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: isKaivo ? "#C8E44A" : "rgba(255,255,255,0.85)",
                      lineHeight: 1.4,
                    }}
                  >
                    {tool}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      flex: 1,
                      fontFamily: "'Urbanist', sans-serif",
                      fontSize: "clamp(13px, 1.2vw, 15.5px)",
                      fontWeight: 600,
                      color: isKaivo ? "white" : "rgba(255,255,255,0.62)",
                      lineHeight: 1.5,
                    }}
                  >
                    {isKaivo ? (
                      <>
                        Get matched, approve once, and{" "}
                        <span style={{ color: "#C8E44A", fontWeight: 800 }}>
                          move on.
                        </span>
                      </>
                    ) : (
                      desc
                    )}
                  </div>

                  {/* Status stamp */}
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "9.5px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: "4px",
                      color: isKaivo ? "#0B222C" : "#E8622A",
                      background: isKaivo ? "#C8E44A" : "rgba(232,98,42,0.12)",
                      border: isKaivo ? "none" : "1px solid rgba(232,98,42,0.4)",
                      animation: isKaivo ? "kaivo-boarding-pulse 2s ease-in-out infinite" : "none",
                    }}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
