import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KaivoMark } from "./KaivoLogo";

gsap.registerPlugin(ScrollTrigger);

// ── Biometric chip icon ───────────────────────────────────────────────────────
function ChipIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden>
      <rect x="5"  y="0" width="1.2" height="18" fill="rgba(200,228,74,0.55)" />
      <rect x="10" y="0" width="1.2" height="18" fill="rgba(200,228,74,0.55)" />
      <rect x="15" y="0" width="1.2" height="18" fill="rgba(200,228,74,0.55)" />
      <rect x="0" y="6"  width="22" height="1.2" fill="rgba(200,228,74,0.55)" />
      <rect x="0" y="11" width="22" height="1.2" fill="rgba(200,228,74,0.55)" />
    </svg>
  );
}

const BUBBLES = [
  "Book me a window seat if it's under £40 extra.",
  "Anything with a brutal layover? Skip it.",
  "My meeting in central Paris ends at 3pm — I need to be back in London before 8.",
] as const;

export function ConversationalSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const insidePageRef = useRef<HTMLDivElement>(null);
  const bubbleRefs    = useRef<(HTMLDivElement | null)[]>([]);

  // Text refs
  const badgeRef   = useRef<HTMLDivElement>(null);
  const head0      = useRef<HTMLDivElement>(null);
  const head1      = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Text — hidden initially
      gsap.set([badgeRef.current, subRef.current, bodyRef.current, taglineRef.current],
        { opacity: 0, y: 18 });
      gsap.set([head0.current, head1.current], { opacity: 0, y: 28 });

      // Passport
      gsap.set(insidePageRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(bubbleRefs.current.filter(Boolean), { opacity: 0, x: 10, y: 4 });

      const tl = gsap.timeline({ paused: true });

      tl
        // Badge
        .to(badgeRef.current,  { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        // Headline lines
        .to(head0.current,     { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.15)
        .to(head1.current,     { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.32)
        // Sub + body
        .to(subRef.current,    { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.50)
        .to(bodyRef.current,   { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.65)
        .to(taglineRef.current,{ opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0.80)
        // Passport flips open
        .to(insidePageRef.current, {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.75, ease: "power2.inOut",
        }, 0.45)
        // Bubbles
        .to(bubbleRefs.current[0], { opacity: 1, x: 0, y: 0, duration: 0.45, ease: "power2.out" }, 1.25)
        .to(bubbleRefs.current[1], { opacity: 1, x: 0, y: 0, duration: 0.45, ease: "power2.out" }, 1.75)
        .to(bubbleRefs.current[2], { opacity: 1, x: 0, y: 0, duration: 0.45, ease: "power2.out" }, 2.25);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 70%",
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
        background: "#1B4A5A",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* White → teal bleed from ProductSection */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "160px",
        background: "linear-gradient(to bottom, white, #1B4A5A)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Subtle diagonal stripe overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "repeating-linear-gradient(55deg, transparent 0px, transparent 30px, rgba(126,206,202,0.022) 30px, rgba(126,206,202,0.022) 31px)",
        pointerEvents: "none",
      }} />

      {/* Watermark "06" */}
      <div aria-hidden style={{
        position: "absolute", right: "-1%", top: "50%",
        transform: "translateY(-46%)",
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
        fontSize: "clamp(140px, 20vw, 300px)",
        color: "rgba(126,206,202,0.04)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        letterSpacing: "-0.05em",
      }}>06</div>

      {/* ── Content wrapper ──────────────────────────────────────────────────── */}
      <div
        className="conv-inner"
        style={{
          maxWidth: "1120px",
          width: "100%",
          padding: "clamp(20px, 4vw, 60px)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: "clamp(32px, 6vw, 72px)",
          alignItems: "center",
        }}
      >

        {/* ── LEFT — text ──────────────────────────────────────────────────── */}
        <div className="conv-text" style={{ flex: "0 0 42%", minWidth: 0 }}>

          {/* Badge */}
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(255,255,255,0.2)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "26px",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 2.5C2 1.95 2.45 1.5 3 1.5H9C9.55 1.5 10 1.95 10 2.5V7C10 7.55 9.55 8 9 8H6.5L4 10V8H3C2.45 8 2 7.55 2 7V2.5Z"
                stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "10px", letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
            }}>Conversational Control</span>
          </div>

          {/* Headline */}
          <div ref={head0} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(42px, 5.8vw, 76px)",
            color: "white", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: "4px",
          }}>
            It doesn't feel
          </div>
          <div ref={head1} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(42px, 5.8vw, 76px)",
            color: "#7ECECA", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: "clamp(22px, 3.5vh, 40px)",
          }}>
            like software.
          </div>

          {/* Sub-headline */}
          <div ref={subRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700, fontSize: "clamp(16px, 1.8vw, 22px)",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.4, marginBottom: "14px",
          }}>
            Kaivo isn't a better search bar.
            It's a conversational travel operator.
          </div>

          {/* Body */}
          <p ref={bodyRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 600, fontSize: "clamp(15px, 1.35vw, 18px)",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.75, margin: "0 0 clamp(24px, 4vh, 44px)",
            maxWidth: "380px",
          }}>
            You describe what you need in plain language.
            Kaivo handles the complexity behind the scenes.
          </p>

          {/* Tagline */}
          <div ref={taglineRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700, fontSize: "clamp(15px, 1.5vw, 20px)",
            color: "rgba(255,255,255,0.82)",
          }}>
            Natural language in.{" "}
            <strong style={{
              color: "white", fontWeight: 900,
              position: "relative",
              display: "inline-block",
            }}>
              Real-world action out.
              <span aria-hidden style={{
                position: "absolute",
                bottom: "-2px", left: 0, right: 0,
                height: "5px",
                background: "#C8E44A",
                opacity: 0.70,
                borderRadius: "2px",
                zIndex: -1,
              }} />
            </strong>
          </div>
        </div>

        {/* ── RIGHT — passport (scroll-animated) ──────────────────────────── */}
        <div
          className="conv-passport"
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
        >
          <div style={{
            display: "flex",
            width: "100%",
            maxWidth: "530px",
            height: "clamp(290px, 42vh, 400px)",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow:
              "0 36px 80px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(126,206,202,0.12)",
          }}>

            {/* Cover page */}
            <div style={{
              width: "44%",
              background: "linear-gradient(155deg, #0e3040 0%, #071f29 100%)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "18px 14px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: "8px",
                border: "1px solid rgba(126,206,202,0.18)",
                borderRadius: "3px", pointerEvents: "none",
              }} />
              <div aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(55deg, transparent 0px, transparent 18px, rgba(126,206,202,0.03) 18px, rgba(126,206,202,0.03) 19px)",
                pointerEvents: "none",
              }} />

              <KaivoMark size={64} color="rgba(200,228,74,0.90)" />
              <div style={{ height: "10px" }} />
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: "clamp(13px, 1.6vw, 20px)",
                letterSpacing: "0.28em", color: "rgba(255,255,255,0.9)",
              }}>KAIVO</div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, fontSize: "7px", letterSpacing: "0.44em",
                color: "rgba(255,255,255,0.32)", marginTop: "3px",
              }}>TRAVEL</div>
              <div style={{ height: "10px" }} />
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "8px", letterSpacing: "0.28em",
                color: "rgba(126,206,202,0.65)",
                borderTop: "1px solid rgba(126,206,202,0.18)",
                paddingTop: "8px",
              }}>PASSPORT</div>

              <div style={{ position: "absolute", bottom: "14px", right: "12px" }}>
                <ChipIcon />
              </div>
            </div>

            {/* Spine */}
            <div style={{
              width: "7px", flexShrink: 0,
              background: "linear-gradient(to right, #06171f, #0c2a36, #06171f)",
            }} />

            {/* Inside page — clips open via GSAP */}
            <div
              ref={insidePageRef}
              style={{
                flex: 1,
                background: "#faf7f2",
                padding: "16px 14px",
                overflow: "hidden",
                clipPath: "inset(0 100% 0 0)",
                position: "relative",
              }}
            >
              {/* Lined paper */}
              <div aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 22px, rgba(27,74,90,0.06) 22px, rgba(27,74,90,0.06) 23px)",
                pointerEvents: "none",
              }} />

              {/* KAIVO watermark */}
              <div aria-hidden style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%) rotate(-18deg)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: "32px",
                color: "rgba(27,74,90,0.04)",
                letterSpacing: "0.2em",
                userSelect: "none", pointerEvents: "none",
                whiteSpace: "nowrap",
              }}>KAIVO</div>

              {/* Label */}
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "6.5px", letterSpacing: "0.26em",
                color: "rgba(27,74,90,0.28)", textTransform: "uppercase",
                marginBottom: "10px", position: "relative",
              }}>
                Travel Instructions
              </div>

              {/* Conversation bubbles */}
              {BUBBLES.map((text, i) => (
                <div
                  key={i}
                  ref={(el) => { bubbleRefs.current[i] = el; }}
                  style={{
                    background: "rgba(27,74,90,0.07)",
                    border: "1px solid rgba(27,74,90,0.1)",
                    borderRadius: "8px 8px 8px 2px",
                    padding: "9px 28px 9px 11px",
                    marginBottom: i < 2 ? "8px" : 0,
                    opacity: 0,
                    position: "relative",
                  }}
                >
                  <div style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontStyle: "italic", fontWeight: 500,
                    fontSize: "clamp(9px, 0.95vw, 11.5px)",
                    color: "#1B4A5A", lineHeight: 1.5,
                  }}>
                    "{text}"
                  </div>
                  <div style={{
                    position: "absolute", bottom: "5px", right: "7px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "7px", color: "rgba(27,74,90,0.3)",
                  }}>✓✓</div>
                </div>
              ))}

              {/* Stamp */}
              <div style={{
                position: "absolute", bottom: "12px", right: "12px",
                width: "38px", height: "38px",
                border: "2px solid rgba(232,98,42,0.25)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: "rotate(-14deg)",
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "5.5px", fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "rgba(232,98,42,0.45)",
                  textAlign: "center", lineHeight: 1.3,
                }}>ENTRY<br />GRANTED</div>
              </div>
            </div>

          </div>{/* end passport */}
        </div>
      </div>
    </section>
  );
}
