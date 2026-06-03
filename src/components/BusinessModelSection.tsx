import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Board data ────────────────────────────────────────────────────────────────
const ROWS = [
  {
    label:      "PLATFORM MODEL",
    fromText:   "MONETIZES  ATTENTION",
    toText:     "MONETIZES  OUTCOMES",
    fromStatus: "DELAYED",
    toStatus:   "ON TIME",
    badgeColor: "#C8E44A",
  },
  {
    label:      "REVENUE SOURCE",
    fromText:   "ADS  &  SPONSORED",
    toText:     "SUCCESSFUL BOOKINGS",
    fromStatus: "CANCELLED",
    toStatus:   "ON TIME",
    badgeColor: "#C8E44A",
  },
  {
    label:      "OPTIMISED FOR",
    fromText:   "CLICKS  &  SEARCHES",
    toText:     "ALIGNED INCENTIVES",
    fromStatus: "CANCELLED",
    toStatus:   "ON TIME",
    badgeColor: "#C8E44A",
  },
  {
    label:      "PASSENGER",
    fromText:   "KEEPS  SEARCHING",
    toText:     "KEEPS  MOVING",
    fromStatus: "SEARCHING",
    toStatus:   "BOARDING",
    badgeColor: "#7ECECA",
  },
] as const;

const ROW_H = 62;

export function BusinessModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  const head0      = useRef<HTMLDivElement>(null);
  const head1      = useRef<HTMLDivElement>(null);
  const boardRef   = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  const oldRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const newRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const oldStatusRefs = useRef<(HTMLDivElement | null)[]>([]);
  const newStatusRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([badgeRef.current, bottomRef.current], { opacity: 0, y: 24 });
      gsap.set([head0.current, head1.current], { opacity: 0, y: 32 });
      gsap.set(boardRef.current, { opacity: 0, y: 40 });

      gsap.set(newRefs.current.filter(Boolean), {
        rotateX: -90, transformPerspective: 800, transformOrigin: "center top",
      });
      gsap.set(newStatusRefs.current.filter(Boolean), {
        rotateX: -90, transformPerspective: 800, transformOrigin: "center top",
      });

      const tl = gsap.timeline({ paused: true });

      tl
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        .to(head0.current,    { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, 0.15)
        .to(head1.current,    { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, 0.32)
        .to(boardRef.current, { opacity: 1, y: 0, duration: 0.7,  ease: "power2.out" }, 0.45);

      ROWS.forEach((_, i) => {
        const offset = 1.1 + i * 0.38;
        tl.to(oldRefs.current[i],       { rotateX: 90, transformPerspective: 800, transformOrigin: "center bottom", duration: 0.22, ease: "power2.in"  }, offset);
        tl.to(oldStatusRefs.current[i], { rotateX: 90, transformPerspective: 800, transformOrigin: "center bottom", duration: 0.22, ease: "power2.in"  }, offset);
        tl.to(newRefs.current[i],       { rotateX: 0,  transformPerspective: 800, transformOrigin: "center top",    duration: 0.22, ease: "power2.out" }, offset + 0.18);
        tl.to(newStatusRefs.current[i], { rotateX: 0,  transformPerspective: 800, transformOrigin: "center top",    duration: 0.22, ease: "power2.out" }, offset + 0.18);
      });

      tl.to(bottomRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
        1.1 + ROWS.length * 0.38 + 0.3);

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
        background: "linear-gradient(160deg, #eef5f7 0%, #ffffff 38%, #edf8f8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(40px, 5vh, 60px) 0 clamp(60px, 8vh, 90px)",
      }}
    >

      {/* Subtle edge vignette */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(27,74,90,0.07) 100%)",
      }} />

      {/* Bottom gradient bridge to DelegationSection (dark) */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "220px",
        background: "linear-gradient(to bottom, transparent 0%, rgba(6,12,20,0.55) 70%, #070f16 100%)",
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
      }}>10</div>

      <div style={{
        maxWidth: "960px",
        width: "100%",
        padding: "0 clamp(20px, 4vw, 56px)",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "clamp(24px, 3.5vh, 38px)",
      }}>

        {/* ── Badge + Headline ─────────────────────────────────────────────── */}
        <div>
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(27,74,90,0.15)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "18px",
            opacity: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <rect x="1.5" y="2" width="9" height="8" rx="1" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2"/>
              <path d="M4 2V1M8 2V1" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M1.5 5H10.5" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2"/>
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
              color: "#1B4A5A", textTransform: "uppercase",
            }}>Business Model</span>
          </div>

          <div ref={head0} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(32px, 4.2vw, 58px)",
            color: "#1B4A5A", lineHeight: 1.0, letterSpacing: "-0.03em",
            opacity: 0,
          }}>
            Most platforms monetize attention.
          </div>
          <div ref={head1} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(32px, 4.2vw, 58px)",
            color: "#7ECECA", lineHeight: 1.0, letterSpacing: "-0.03em",
            opacity: 0,
          }}>
            Kaivo monetizes outcomes.
          </div>
        </div>

        {/* ── Departure board ──────────────────────────────────────────────── */}
        <div
          ref={boardRef}
          style={{
            background: "#0f2e3a",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(15,46,58,0.22), 0 4px 16px rgba(15,46,58,0.14)",
            opacity: 0,
          }}
        >
          {/* Board header */}
          <div style={{
            background: "#081e27",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 12L6 8.5L9 10.5L14 4" stroke="#7ECECA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 4H14V7"               stroke="#7ECECA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "11px", letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.8)",
              }}>KAIVO TRAVEL</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px", letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.28)",
              }}>PLATFORM COMPARISON</span>
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px", letterSpacing: "0.2em",
              color: "#E8622A",
            }}>● LIVE</span>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto",
            padding: "10px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {["Route", "Status"].map((h) => (
              <span key={h} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "8px", letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
              }}>{h}</span>
            ))}
          </div>

          {/* Flip rows */}
          {ROWS.map((row, i) => (
            <div key={i} style={{
              borderBottom: i < ROWS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
            }}>
              <div style={{
                padding: "6px 24px 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "7.5px", letterSpacing: "0.26em",
                color: "rgba(255,255,255,0.2)", textTransform: "uppercase",
              }}>{row.label}</div>

              <div className="board-row-area" style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                alignItems: "center",
                height: `${ROW_H}px`,
                padding: "0 24px",
              }}>
                {/* ROUTE flip cell */}
                <div style={{ position: "relative", height: `${ROW_H}px`, overflow: "hidden" }}>
                  <div ref={(el) => { oldRefs.current[i] = el; }} style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center",
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: "clamp(13px, 1.6vw, 19px)", letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.45)",
                  }}>{row.fromText}</div>
                  <div ref={(el) => { newRefs.current[i] = el; }} style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center",
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: "clamp(13px, 1.6vw, 19px)", letterSpacing: "0.08em",
                    color: "white",
                  }}>{row.toText}</div>
                </div>

                {/* STATUS flip cell */}
                <div className="board-status-cell" style={{ position: "relative", height: `${ROW_H}px`, overflow: "hidden", minWidth: "110px", display: "flex", justifyContent: "flex-end" }}>
                  <div ref={(el) => { oldStatusRefs.current[i] = el; }} style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end",
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: "10px", letterSpacing: "0.22em", color: "#E8622A",
                      padding: "4px 10px", border: "1px solid rgba(232,98,42,0.35)", borderRadius: "4px",
                    }}>{row.fromStatus}</span>
                  </div>
                  <div ref={(el) => { newStatusRefs.current[i] = el; }} style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end",
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: "10px", letterSpacing: "0.22em", color: row.badgeColor,
                      padding: "4px 10px", border: `1px solid ${row.badgeColor}55`, borderRadius: "4px",
                    }}>{row.toStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Board footer legend */}
          <div style={{
            background: "#081e27", padding: "10px 24px",
            display: "flex", alignItems: "center", gap: "20px",
          }}>
            {[
              { dot: "#C8E44A", label: "ON TIME" },
              { dot: "#7ECECA", label: "BOARDING" },
              { dot: "#E8622A", label: "DELAYED / CANCELLED" },
            ].map(({ dot, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "7.5px", letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.28)",
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>{/* end board */}

        {/* ── Two-column breakdown ─────────────────────────────────────────── */}
        <div
          ref={bottomRef}
          className="biz-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(16px, 2.5vw, 32px)",
            opacity: 0,
          }}
        >

          {/* LEFT — Traditional model (old) */}
          <div style={{
            background: "#fff5f1",
            border: "1.5px solid rgba(232,98,42,0.22)",
            borderRadius: "12px",
            padding: "clamp(18px, 2.4vw, 28px)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "11px", letterSpacing: "0.3em",
              color: "#E8622A", textTransform: "uppercase",
            }}>Traditional Platforms</div>

            <div style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
              fontSize: "clamp(15px, 1.4vw, 17px)",
              color: "rgba(27,74,90,0.88)", lineHeight: 1.5,
            }}>
              Traditional travel platforms make money from:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Ads", "Sponsored placements", "Click optimization"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "#E8622A", flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                    fontSize: "clamp(14px, 1.3vw, 16px)",
                    color: "rgba(27,74,90,0.82)",
                  }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Problem callout */}
            <div style={{
              marginTop: "4px",
              background: "rgba(232,98,42,0.08)",
              borderRadius: "8px",
              padding: "14px 16px",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "11px", letterSpacing: "0.26em",
                color: "#E8622A", textTransform: "uppercase",
                marginBottom: "8px",
              }}>Which creates a problem:</div>
              <div style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                fontSize: "clamp(15px, 1.4vw, 18px)",
                color: "#E8622A", lineHeight: 1.4,
              }}>
                They win when you keep searching.
              </div>
            </div>
          </div>

          {/* RIGHT — Kaivo model (new) */}
          <div style={{
            background: "#f0f8f8",
            border: "1.5px solid rgba(27,74,90,0.14)",
            borderRadius: "12px",
            padding: "clamp(18px, 2.4vw, 28px)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "11px", letterSpacing: "0.3em",
              color: "#1B4A5A", textTransform: "uppercase",
            }}>Kaivo</div>

            <div style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
              fontSize: "clamp(15px, 1.5vw, 20px)",
              color: "#1B4A5A", lineHeight: 1.2, letterSpacing: "-0.02em",
            }}>
              Kaivo is built differently.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { dot: "#5aaa44", text: "No ads" },
                { dot: "#5aaa44", text: "No hidden incentives" },
                { dot: "#5aaa44", text: "No pay-to-rank placements" },
                { dot: "#2a9d9d", text: "Revenue only when bookings happen" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: item.dot, flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                    fontSize: "clamp(14px, 1.3vw, 16px)",
                    color: "rgba(27,74,90,0.85)",
                  }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Incentive alignment */}
            <div style={{
              marginTop: "4px",
              background: "rgba(27,74,90,0.07)",
              borderRadius: "8px",
              padding: "14px 16px",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "11px", letterSpacing: "0.26em",
                color: "rgba(27,74,90,0.85)", textTransform: "uppercase",
                marginBottom: "10px",
              }}>Our incentives align with yours:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Help you choose well.", "Handle the work."].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#E8622A", flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                      fontSize: "clamp(14px, 1.3vw, 17px)",
                      color: "#1B4A5A",
                    }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* end two-column */}
      </div>
    </section>
  );
}
