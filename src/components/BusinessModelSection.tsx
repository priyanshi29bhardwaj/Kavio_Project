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

  const handleBoardHover = () => {
    gsap.set(oldRefs.current.filter(Boolean),       { rotateX: 0,   transformPerspective: 800, transformOrigin: "center bottom" });
    gsap.set(newRefs.current.filter(Boolean),       { rotateX: -90, transformPerspective: 800, transformOrigin: "center top" });
    gsap.set(oldStatusRefs.current.filter(Boolean), { rotateX: 0,   transformPerspective: 800, transformOrigin: "center bottom" });
    gsap.set(newStatusRefs.current.filter(Boolean), { rotateX: -90, transformPerspective: 800, transformOrigin: "center top" });
    const ht = gsap.timeline();
    ROWS.forEach((_, i) => {
      const at = i * 0.38;
      ht.to(oldRefs.current[i],       { rotateX: 90, transformPerspective: 800, transformOrigin: "center bottom", duration: 0.22, ease: "power2.in"  }, at);
      ht.to(oldStatusRefs.current[i], { rotateX: 90, transformPerspective: 800, transformOrigin: "center bottom", duration: 0.22, ease: "power2.in"  }, at);
      ht.to(newRefs.current[i],       { rotateX: 0,  transformPerspective: 800, transformOrigin: "center top",    duration: 0.22, ease: "power2.out" }, at + 0.18);
      ht.to(newStatusRefs.current[i], { rotateX: 0,  transformPerspective: 800, transformOrigin: "center top",    duration: 0.22, ease: "power2.out" }, at + 0.18);
    });
  };

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
          onMouseEnter={handleBoardHover}
          style={{
            background: "#0f2e3a",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(15,46,58,0.22), 0 4px 16px rgba(15,46,58,0.14)",
            opacity: 0,
            cursor: "default",
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

        {/* ── Receipt / Paper Trail ─────────────────────────────────────────── */}
        <style>{`
          .receipt-lines {
            background-image: repeating-linear-gradient(
              transparent, transparent 27px,
              rgba(160,120,50,0.07) 27px, rgba(160,120,50,0.07) 28px
            );
          }
          .invoice-lines {
            background-image: repeating-linear-gradient(
              transparent, transparent 27px,
              rgba(27,74,90,0.07) 27px, rgba(27,74,90,0.07) 28px
            );
          }
          .receipt-tear {
            height: 18px;
            background:
              radial-gradient(circle at 9px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 27px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 45px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 63px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 81px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 99px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 117px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 135px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 153px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 171px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 189px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 207px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 225px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 243px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 261px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 279px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 297px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 315px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 333px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 351px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 369px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 387px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 405px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 423px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 441px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 459px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 477px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 495px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 513px 0, #FDF8EC 8px, transparent 9px),
              radial-gradient(circle at 531px 0, #FDF8EC 8px, transparent 9px);
            background-color: white;
            background-repeat: no-repeat;
          }
          @media (max-width: 680px) {
            .biz-cols { grid-template-columns: 1fr !important; }
          }
        `}</style>

        <div
          ref={bottomRef}
          className="biz-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(16px, 2.5vw, 32px)",
            opacity: 0,
            alignItems: "stretch",
          }}
        >

          {/* LEFT — old thermal receipt */}
          <div style={{
            background: "#FDF8EC",
            borderRadius: "4px 4px 0 0",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10), 2px 2px 0 rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}>
            {/* Receipt header */}
            <div style={{
              background: "#1B4A5A",
              padding: "16px 22px 14px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: "bold", fontSize: "11px", letterSpacing: "0.36em",
                color: "rgba(255,255,255,0.92)", textTransform: "uppercase",
                marginBottom: "5px",
              }}>Traditional Platforms</div>
            </div>

            {/* Paper body */}
            <div className="receipt-lines" style={{ flex: 1, padding: "20px 22px 0" }}>
              <div style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontWeight: "bold",
                fontSize: "clamp(10px, 1.0vw, 12px)",
                color: "rgba(60,38,16,0.68)",
                lineHeight: 1.7,
                marginBottom: "16px",
                letterSpacing: "0.01em",
              }}>
                Traditional travel platforms<br />make money from:
              </div>

              {/* Dashed rule */}
              <div style={{ borderTop: "1.5px dashed rgba(27,74,90,0.22)", marginBottom: "16px" }} />

              {/* Line items */}
              {["Ads", "Sponsored placements", "Click optimization"].map((item, i) => (
                <div key={item} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: i < 2 ? "12px" : "0",
                  gap: "8px",
                }}>
                  <span style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontWeight: "bold",
                    fontSize: "clamp(12px, 1.15vw, 14px)",
                    color: "rgba(27,74,90,0.85)",
                    letterSpacing: "0.02em",
                  }}>{item}</span>
                  <span style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: "13px", fontWeight: "bold",
                    color: "#1B4A5A", flexShrink: 0,
                  }}>✗</span>
                </div>
              ))}

              {/* Double dashed rule (subtotal) */}
              <div style={{ borderTop: "1.5px dashed rgba(27,74,90,0.22)", margin: "16px 0 5px" }} />
              <div style={{ borderTop: "1.5px dashed rgba(27,74,90,0.22)", marginBottom: "16px" }} />

              {/* Problem callout — receipt total block */}
              <div style={{
                background: "#1B4A5A",
                border: "none",
                borderRadius: "3px",
                padding: "16px 18px",
                marginBottom: "0",
              }}>
                <div style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontWeight: "bold", fontSize: "9px", letterSpacing: "0.28em",
                  color: "rgba(126,206,202,0.85)", textTransform: "uppercase",
                  marginBottom: "8px",
                }}>⚠ WHICH CREATES A PROBLEM:</div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                  fontSize: "clamp(14px, 1.3vw, 17px)",
                  color: "#ffffff", lineHeight: 1.4,
                }}>
                  They win when you keep searching.
                </div>
              </div>
            </div>

            {/* Perforated tear edge */}
            <div className="receipt-tear" style={{ marginTop: "16px" }} />

            {/* Corner fold */}
            <div aria-hidden style={{
              position: "absolute", bottom: 18, right: 0,
              width: 0, height: 0,
              borderStyle: "solid",
              borderWidth: "0 0 24px 24px",
              borderColor: "transparent transparent rgba(150,110,50,0.16) transparent",
            }} />
          </div>

          {/* RIGHT — clean Kaivo invoice */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(27,74,90,0.10), 0 1px 4px rgba(27,74,90,0.06)",
            border: "1px solid rgba(27,74,90,0.09)",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Invoice header */}
            <div style={{
              background: "#1B4A5A",
              padding: "16px 22px 14px",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "11px", letterSpacing: "0.40em",
                color: "#7ECECA", textTransform: "uppercase",
                marginBottom: "5px",
              }}>Kaivo</div>
            </div>

            {/* Invoice body */}
            <div className="invoice-lines" style={{ flex: 1, padding: "20px 22px 0" }}>
              <div style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                fontSize: "clamp(15px, 1.45vw, 19px)",
                color: "#1B4A5A", lineHeight: 1.25, letterSpacing: "-0.01em",
                marginBottom: "16px",
              }}>
                Kaivo is built differently.
              </div>

              {/* Rule */}
              <div style={{ borderTop: "1px solid rgba(27,74,90,0.10)", marginBottom: "16px" }} />

              {/* Line items */}
              {[
                { dot: "#5aaa44", text: "No ads" },
                { dot: "#5aaa44", text: "No hidden incentives" },
                { dot: "#5aaa44", text: "No pay-to-rank placements" },
                { dot: "#2a9d9d", text: "Revenue only when bookings happen" },
              ].map((item, i) => (
                <div key={item.text} style={{
                  display: "flex", alignItems: "center",
                  gap: "10px",
                  marginBottom: i < 3 ? "12px" : "0",
                }}>
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: item.dot, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
                      <path d="M1 3.5L3.3 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{
                    fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
                    fontSize: "clamp(13px, 1.2vw, 15px)",
                    color: "rgba(27,74,90,0.85)",
                  }}>{item.text}</span>
                </div>
              ))}

              {/* Rule */}
              <div style={{ borderTop: "1px solid rgba(27,74,90,0.10)", margin: "16px 0" }} />

              {/* Incentive alignment — invoice totals style */}
              <div style={{
                background: "rgba(27,74,90,0.05)",
                borderRadius: "6px",
                padding: "14px 16px",
                marginBottom: "0",
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: "9px", letterSpacing: "0.30em",
                  color: "rgba(27,74,90,0.55)", textTransform: "uppercase",
                  marginBottom: "10px",
                }}>Our incentives align with yours:</div>
                {["Help you choose well.", "Handle the work."].map((item, i) => (
                  <div key={item} style={{
                    display: "flex", alignItems: "center",
                    gap: "10px",
                    marginBottom: i < 1 ? "9px" : "0",
                  }}>
                    <div style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#E8622A", flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                      fontSize: "clamp(13px, 1.25vw, 16px)",
                      color: "#1B4A5A",
                    }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean footer */}
            <div style={{
              padding: "14px 22px 16px",
              textAlign: "right",
              marginTop: "auto",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "8px", letterSpacing: "0.22em",
                color: "rgba(27,74,90,0.22)",
              }}>TERMS CLEAR · NO HIDDEN FEES</div>
            </div>
          </div>

        </div>{/* end two-column */}
      </div>
    </section>
  );
}
