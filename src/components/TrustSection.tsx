import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  {
    label:  "What was chosen",
    value:  "Window seat · Row 14A",
    detail: "BA127 · LHR → CDG · 06:45",
  },
  {
    label:  "Why it was chosen",
    value:  "Matched your preferences",
    detail: "Window preferred · Budget under £40",
  },
  {
    label:  "What it costs",
    value:  "£38 seat upgrade",
    detail: "Total with fare: £312 · No hidden fees",
  },
  {
    label:  "What happens next",
    value:  "Seat locked · Confirmation sent",
    detail: "Boarding pass updated automatically",
  },
] as const;

const FEATURES = [
  "Every decision is visible",
  "Every cost is clear",
  "Every action requires approval",
  "Your preferences improve over time",
] as const;

export function TrustSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const rowRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const btnRef        = useRef<HTMLDivElement>(null);
  const featRefs      = useRef<(HTMLDivElement | null)[]>([]);

  // Text refs
  const badgeRef   = useRef<HTMLDivElement>(null);
  const head0      = useRef<HTMLDivElement>(null);
  const head1      = useRef<HTMLDivElement>(null);
  const head2      = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text
      gsap.set(badgeRef.current,  { opacity: 0, y: 14 });
      gsap.set([head0.current, head1.current, head2.current], { opacity: 0, y: 30 });
      gsap.set(subRef.current,    { opacity: 0, y: 18 });
      gsap.set(taglineRef.current,{ opacity: 0, y: 14 });
      // Card
      gsap.set(cardRef.current,  { y: 48, opacity: 0 });
      gsap.set(rowRefs.current.filter(Boolean), { x: -22, opacity: 0 });
      gsap.set(btnRef.current,   { scale: 0.92, opacity: 0 });
      gsap.set(featRefs.current.filter(Boolean), { x: -14, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl
        // Text animates first
        .to(badgeRef.current,  { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        .to(head0.current,     { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.15)
        .to(head1.current,     { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.28)
        .to(head2.current,     { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.41)
        .to(subRef.current,    { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.58)
        .to(featRefs.current,  { x: 0, opacity: 1, duration: 0.45, stagger: 0.12, ease: "power2.out" }, 0.70)
        .to(taglineRef.current,{ opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 1.00)
        // Card animates alongside
        .to(cardRef.current,
          { y: 0, opacity: 1, duration: 0.75, ease: "power2.out" }, 0.18)
        .to(rowRefs.current,
          { x: 0, opacity: 1, duration: 0.5,  stagger: 0.14, ease: "power2.out" }, 0.42)
        .to(btnRef.current,
          { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }, 1.05);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 78%",
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
        background: "white",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Teal → white gradient seam from ConversationalSection */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "200px",
        background: "linear-gradient(to bottom, #1B4A5A, white)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Watermark "07" */}
      <div aria-hidden style={{
        position: "absolute", right: "-1%", top: "50%",
        transform: "translateY(-46%)",
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
        fontSize: "clamp(140px, 20vw, 300px)",
        color: "rgba(27,74,90,0.032)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        letterSpacing: "-0.05em",
      }}>07</div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div
        className="trust-inner"
        style={{
          maxWidth: "1120px",
          width: "100%",
          padding: "clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: "clamp(32px, 6vw, 80px)",
          alignItems: "center",
        }}
      >

        {/* ── LEFT — text ──────────────────────────────────────────────────── */}
        <div className="trust-text" style={{ flex: "0 0 44%", minWidth: 0 }}>

          {/* Badge */}
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(27,74,90,0.15)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "26px",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 1L10 2.8V6.5C10 8.6 8.2 10.2 6 11C3.8 10.2 2 8.6 2 6.5V2.8L6 1Z"
                stroke="rgba(27,74,90,0.4)" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M4 6L5.5 7.5L8 4.5"
                stroke="rgba(27,74,90,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "10px", letterSpacing: "0.32em",
              color: "rgba(27,74,90,0.55)", textTransform: "uppercase",
            }}>Trust</span>
          </div>

          {/* Headline */}
          <div ref={head0} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(36px, 5.2vw, 70px)",
            color: "#1B4A5A", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: "4px",
          }}>
            Delegation only
          </div>
          <div ref={head1} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(36px, 5.2vw, 70px)",
            color: "#1B4A5A", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: "4px",
          }}>
            works if you
          </div>
          <div ref={head2} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(36px, 5.2vw, 70px)",
            color: "#7ECECA", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: "clamp(20px, 3vh, 34px)",
          }}>
            stay in control.
          </div>

          {/* Sub-headline */}
          <p ref={subRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700, fontSize: "clamp(16px, 1.6vw, 21px)",
            color: "rgba(27,74,90,0.88)",
            lineHeight: 1.55, margin: "0 0 clamp(24px, 3.5vh, 38px)",
            maxWidth: "360px",
          }}>
            Kaivo never turns trust into guesswork.
            You see everything. Then you approve.
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "clamp(24px, 3.5vh, 38px)" }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                ref={(el) => { featRefs.current[i] = el; }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  opacity: 0,
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#C8E44A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                    <path d="M1 4L3.8 7L9 1" stroke="#1B4A5A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600, fontSize: "clamp(13px, 1.3vw, 16px)",
                  color: "#1B4A5A",
                }}>
                  {f}
                </span>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div ref={taglineRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontStyle: "italic", fontWeight: 700,
            fontSize: "clamp(15px, 1.4vw, 18px)",
            color: "rgba(27,74,90,0.82)",
            borderLeft: "3px solid #C8E44A",
            paddingLeft: "14px",
            lineHeight: 1.6,
          }}>
            Always asks first.<br />Never hides the logic.
          </div>
        </div>

        {/* ── RIGHT — decision approval card ───────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={cardRef}
            style={{
              background: "white",
              border: "1.5px solid rgba(27,74,90,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow:
                "0 24px 64px rgba(27,74,90,0.1), 0 4px 16px rgba(27,74,90,0.06)",
              opacity: 0,
            }}
          >

            {/* Card header */}
            <div style={{
              background: "#1B4A5A",
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              {/* Pulse dot */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#E8622A",
                }} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: "13px", letterSpacing: "0.28em",
                  color: "#E8622A", textTransform: "uppercase",
                  marginBottom: "4px",
                }}>
                  Awaiting Your Approval
                </div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600, fontSize: "15px",
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Kaivo has made a selection for you to review
                </div>
              </div>
            </div>

            {/* Decision rows */}
            {ROWS.map((row, i) => (
              <div
                key={i}
                ref={(el) => { rowRefs.current[i] = el; }}
                style={{
                  padding: "16px 22px",
                  borderBottom: i < ROWS.length - 1
                    ? "1px solid rgba(27,74,90,0.07)"
                    : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  opacity: 0,
                }}
              >
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: "8px", letterSpacing: "0.32em",
                  color: "rgba(27,74,90,0.68)", textTransform: "uppercase",
                }}>
                  {row.label}
                </div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700, fontSize: "clamp(14px, 1.5vw, 17px)",
                  color: "#1B4A5A", lineHeight: 1.2,
                }}>
                  {row.value}
                </div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 600, fontSize: "clamp(12px, 1.05vw, 14px)",
                  color: "rgba(27,74,90,0.72)",
                }}>
                  {row.detail}
                </div>
              </div>
            ))}

            {/* Perforated divider */}
            <div style={{
              margin: "0 22px",
              borderTop: "1.5px dashed rgba(27,74,90,0.12)",
            }} />

            {/* Approve / Review buttons */}
            <div
              ref={btnRef}
              style={{
                padding: "18px 22px",
                display: "flex",
                gap: "12px",
                opacity: 0,
              }}
            >
              <button style={{
                flex: 1,
                background: "#E8622A",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "13px 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "11px", letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Approve
              </button>
              <button style={{
                flex: "0 0 auto",
                background: "transparent",
                color: "#1B4A5A",
                border: "1.5px solid rgba(27,74,90,0.2)",
                borderRadius: "8px",
                padding: "13px 24px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: "11px", letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1B4A5A";
                e.currentTarget.style.background = "rgba(27,74,90,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(27,74,90,0.2)";
                e.currentTarget.style.background = "transparent";
              }}
              >
                Review
              </button>
            </div>

          </div>{/* end card */}
        </div>
      </div>
    </section>
  );
}
