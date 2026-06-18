import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KaivoMark } from "./KaivoLogo";
import "./conversational.css";

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

// ── Orbiting travel objects ───────────────────────────────────────────────────
// Small frosted cards in the brand palette. Rendered ABOVE the passport so they
// are always visible as they circle it, like electrons around a nucleus.
function StampChip() {
  return (
    <div className="travel-card" style={{
      width: 64, height: 64, borderRadius: "50%",
      border: "2px dashed rgba(232,98,42,0.75)",
      background: "radial-gradient(circle, rgba(26,70,86,0.97), rgba(9,30,38,0.97))",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#f4b48f" }}>PAR</span>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="#f4b48f" style={{ opacity: 0.95 }} aria-hidden>
        <path d="M2 8l20-6-7 9-3-2-3 2-1-3-3 1z" />
      </svg>
      <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(244,180,143,0.9)" }}>ENTRY</span>
    </div>
  );
}

function BoardingPassChip() {
  return (
    <div className="travel-card" style={{ width: 96, height: 54, display: "flex" }}>
      <div style={{ flex: 1, padding: "8px 10px", borderRight: "1.5px dashed rgba(126,206,202,0.5)" }}>
        <div style={{ fontSize: 7, letterSpacing: "0.14em", color: "rgba(126,206,202,0.85)" }}>BOARDING</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>LHR→JFK</div>
        <div style={{ fontSize: 7, color: "rgba(234,246,244,0.7)", marginTop: 3 }}>SEAT 14A</div>
      </div>
      <div style={{
        width: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        background: "rgba(200,228,74,0.16)",
      }}>
        <span style={{ fontSize: 8, color: "rgba(200,228,74,0.95)", fontWeight: 800 }}>✈</span>
        <span style={{ fontSize: 6, color: "rgba(234,246,244,0.65)", writingMode: "vertical-rl" }}>KV06</span>
      </div>
    </div>
  );
}

function VisaChip() {
  return (
    <div className="travel-card" style={{ width: 76, height: 56, padding: "9px 10px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: "#7ECECA" }}>VISA</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 2.5, marginTop: 5, width: `${82 - i * 18}%`, background: "rgba(234,246,244,0.35)", borderRadius: 2 }} />
      ))}
    </div>
  );
}

function LuggageTagChip() {
  return (
    <div style={{ position: "relative", transform: "rotate(-6deg)" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2.5px solid rgba(200,228,74,0.85)", margin: "0 auto 3px" }} />
      <div className="travel-card" style={{
        width: 54, height: 68, borderRadius: 8,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        background: "linear-gradient(150deg, rgba(200,228,74,0.22), rgba(9,30,38,0.97))",
      }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: "#C8E44A", letterSpacing: "0.06em" }}>LHR</span>
        <span style={{ fontSize: 6.5, color: "rgba(234,246,244,0.7)", letterSpacing: "0.14em" }}>PRIORITY</span>
      </div>
    </div>
  );
}

function TicketChip() {
  return (
    <div className="travel-card" style={{ width: 90, height: 48, padding: "8px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: -6, top: "50%", width: 12, height: 12, borderRadius: "50%", background: "#143A47", transform: "translateY(-50%)" }} />
      <div style={{ position: "absolute", right: -6, top: "50%", width: 12, height: 12, borderRadius: "50%", background: "#143A47", transform: "translateY(-50%)" }} />
      <div style={{ fontSize: 7, letterSpacing: "0.16em", color: "rgba(126,206,202,0.85)" }}>E-TICKET</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>✈ 60 SEC</div>
    </div>
  );
}

function KeycardChip() {
  return (
    <div className="travel-card" style={{ width: 86, height: 54, padding: 0 }}>
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontSize: 7, letterSpacing: "0.16em", color: "rgba(126,206,202,0.85)" }}>HOTEL</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>ROOM KEY</div>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 11,
        background: "repeating-linear-gradient(90deg, rgba(200,228,74,0.6) 0 4px, rgba(200,228,74,0.25) 4px 8px)",
      }} />
    </div>
  );
}

function TrainChip() {
  return (
    <div className="travel-card" style={{ width: 88, height: 48, padding: "8px 12px" }}>
      <div style={{ fontSize: 7, letterSpacing: "0.16em", color: "rgba(126,206,202,0.85)" }}>RAIL</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>🚄 EUROSTAR</div>
    </div>
  );
}

// Three crossing ellipses (atom shells), 780×580 coordinate space, centred at
// (390,290). Sized to fully CIRCUMSCRIBE the passport so the objects float in
// the open space all the way around it — never across its face.
const ELLIPSE_A = "M775,290 a385,275 0 1 0 -770,0 a385,275 0 1 0 770,0";
const ELLIPSE_B = "M756.5,423.4 a390,265 20 1 0 -733,-266.8 a390,265 20 1 0 733,266.8";
const ELLIPSE_C = "M756.5,156.6 a390,265 -20 1 0 -733,266.8 a390,265 -20 1 0 733,-266.8";

interface OrbitObj {
  path: string;
  dur: number;
  delay: number;
  tilt: number;
  node: React.ReactNode;
}

const ORBIT_OBJECTS: OrbitObj[] = [
  { path: ELLIPSE_A, dur: 30, delay: 0,     tilt: -4, node: <StampChip /> },
  { path: ELLIPSE_A, dur: 30, delay: -10,   tilt: 5,  node: <BoardingPassChip /> },
  { path: ELLIPSE_A, dur: 30, delay: -20,   tilt: -3, node: <LuggageTagChip /> },
  { path: ELLIPSE_B, dur: 36, delay: 0,     tilt: 4,  node: <VisaChip /> },
  { path: ELLIPSE_B, dur: 36, delay: -18,   tilt: -5, node: <KeycardChip /> },
  { path: ELLIPSE_C, dur: 26, delay: 0,     tilt: 3,  node: <TicketChip /> },
  { path: ELLIPSE_C, dur: 26, delay: -13,   tilt: -4, node: <TrainChip /> },
];

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
        background:
          "radial-gradient(120% 90% at 70% 12%, #245A6C 0%, #1B4A5A 45%, #143A47 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      {/* Simple divider line from ProductSection — clean edge, no colour fade */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1px",
        background: "rgba(126,206,202,0.30)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Subtle diagonal stripe overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "repeating-linear-gradient(55deg, transparent 0px, transparent 30px, rgba(126,206,202,0.022) 30px, rgba(126,206,202,0.022) 31px)",
        pointerEvents: "none",
      }} />

      {/* Bottom fade — flatten the radial into a clean, uniform navy so the
          handoff into TrustSection's seam is seamless (no color mismatch) */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "320px",
        background:
          "linear-gradient(to bottom, rgba(20,58,71,0) 0%, #143A47 72%, #143A47 100%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />


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
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.32em",
              color: "rgba(255,255,255,0.92)", textTransform: "uppercase",
            }}>Conversational Control</span>
          </div>

          {/* Headline */}
          <div ref={head0} className="conv-headline" style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(36px, 6.0vw, 80px)",
            color: "white", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: "4px",
          }}>
            It doesn't feel
          </div>
          <div ref={head1} className="conv-headline" style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(36px, 6.0vw, 80px)",
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

        {/* ── RIGHT — passport at the nucleus of an orbiting travel system ── */}
        <div
          className="conv-passport"
          style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <div className="conv-stage">

            {/* faint guide ellipses behind everything */}
            <svg className="orbit-rings" viewBox="0 0 780 580" fill="none" aria-hidden>
              <path d={ELLIPSE_A} stroke="rgba(126,206,202,0.12)" strokeWidth="1" />
              <path d={ELLIPSE_B} stroke="rgba(126,206,202,0.10)" strokeWidth="1" />
              <path d={ELLIPSE_C} stroke="rgba(126,206,202,0.10)" strokeWidth="1" />
            </svg>

            {/* central glow (the nucleus) */}
            <div aria-hidden style={{
              position: "absolute", top: "50%", left: "50%",
              width: "300px", height: "300px", transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(126,206,202,0.16) 0%, transparent 68%)",
              zIndex: 1, pointerEvents: "none",
            }} />

          {/* ── Passport (the liked static version) ──────────────────────── */}
          <div className="passport-core">
          <div style={{
            display: "flex",
            width: "100%",
            height: "clamp(290px, 42vh, 400px)",
            borderRadius: "12px",
            overflow: "hidden",
            transform: "perspective(1600px) rotateY(-7deg) rotateX(1.5deg)",
            transformOrigin: "center left",
            boxShadow:
              "0 50px 100px rgba(0,0,0,0.40), 0 18px 40px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(126,206,202,0.14)",
          }}>

            {/* Cover page */}
            <div style={{
              width: "44%",
              background:
                "linear-gradient(155deg, #1a4d63 0%, #103747 38%, #0a2531 70%, #061a23 100%)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "18px 14px",
              position: "relative", overflow: "hidden",
            }}>
              {/* concentric guilloche security rings */}
              <div aria-hidden style={{
                position: "absolute", top: "38%", left: "50%",
                width: "150%", aspectRatio: "1",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background:
                  "repeating-radial-gradient(circle at center, transparent 0 9px, rgba(126,206,202,0.05) 9px 10px)",
                pointerEvents: "none",
              }} />
              {/* warm glow halo behind the emblem */}
              <div aria-hidden style={{
                position: "absolute", top: "34%", left: "50%",
                width: "120px", height: "120px",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(200,228,74,0.22) 0%, transparent 68%)",
                pointerEvents: "none",
              }} />
              {/* gold-foil double border */}
              <div style={{
                position: "absolute", inset: "7px",
                border: "1px solid rgba(200,228,74,0.32)",
                borderRadius: "4px", pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: "10px",
                border: "1px solid rgba(126,206,202,0.14)",
                borderRadius: "3px", pointerEvents: "none",
              }} />
              {/* gold corner brackets */}
              {[
                { top: "7px", left: "7px", borderWidth: "1.5px 0 0 1.5px" },
                { top: "7px", right: "7px", borderWidth: "1.5px 1.5px 0 0" },
                { bottom: "7px", left: "7px", borderWidth: "0 0 1.5px 1.5px" },
                { bottom: "7px", right: "7px", borderWidth: "0 1.5px 1.5px 0" },
              ].map((c, i) => (
                <div key={i} aria-hidden style={{
                  position: "absolute", width: "12px", height: "12px",
                  borderStyle: "solid", borderColor: "rgba(200,228,74,0.65)",
                  pointerEvents: "none", ...c,
                }} />
              ))}
              {/* soft sheen sweep across the cover */}
              <div aria-hidden style={{
                position: "absolute", inset: 0,
                background:
                  "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
                pointerEvents: "none",
              }} />

              <div aria-hidden style={{
                filter: "drop-shadow(0 0 10px rgba(200,228,74,0.45))",
                position: "relative",
              }}>
                <KaivoMark size={66} color="#d4ed5e" />
              </div>
              <div style={{ height: "12px" }} />
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: "clamp(13px, 1.6vw, 20px)",
                letterSpacing: "0.30em", color: "#ffffff",
                textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              }}>KAIVO</div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: "11px", letterSpacing: "0.46em",
                color: "rgba(255,255,255,0.78)", marginTop: "4px",
              }}>TRAVEL</div>
              <div style={{ height: "12px" }} />
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: "12px", letterSpacing: "0.30em",
                color: "#9fe0db",
                borderTop: "1px solid rgba(126,206,202,0.40)",
                paddingTop: "9px",
              }}>PASSPORT</div>

              <div style={{ position: "absolute", bottom: "14px", right: "12px", opacity: 0.85 }}>
                <ChipIcon />
              </div>
            </div>

            {/* Spine */}
            <div style={{
              width: "9px", flexShrink: 0,
              background:
                "linear-gradient(to right, #06171f, #0c2a36 45%, #02464f 50%, #0c2a36 55%, #06171f)",
              boxShadow: "inset 0 0 4px rgba(0,0,0,0.6)",
            }} />

            {/* Inside page — clips open via GSAP */}
            <div
              ref={insidePageRef}
              style={{
                flex: 1,
                background:
                  "linear-gradient(105deg, #f5efe4 0%, #faf7f2 12%, #faf7f2 100%)",
                padding: "16px 14px",
                overflow: "hidden",
                clipPath: "inset(0 100% 0 0)",
                position: "relative",
              }}
            >
              {/* page-curl shadow near the spine for a real-paper feel */}
              <div aria-hidden style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: "34px",
                background:
                  "linear-gradient(to right, rgba(27,74,90,0.16), transparent)",
                pointerEvents: "none",
              }} />
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

              {/* Header bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                marginBottom: "12px", position: "relative",
                paddingBottom: "7px",
                borderBottom: "1px solid rgba(27,74,90,0.12)",
              }}>
                <span style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: "#7BBF4A", flexShrink: 0,
                  boxShadow: "0 0 4px rgba(123,191,74,0.6)",
                }} />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "7px", fontWeight: 700, letterSpacing: "0.26em",
                  color: "rgba(27,74,90,0.55)", textTransform: "uppercase",
                }}>
                  Travel Instructions
                </span>
                <span style={{
                  marginLeft: "auto",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "6.5px", letterSpacing: "0.18em",
                  color: "rgba(27,74,90,0.3)",
                }}>NO. 06</span>
              </div>

              {/* Conversation bubbles */}
              {BUBBLES.map((text, i) => (
                <div
                  key={i}
                  ref={(el) => { bubbleRefs.current[i] = el; }}
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #f3f7f6 100%)",
                    border: "1px solid rgba(27,74,90,0.10)",
                    borderRadius: "10px 10px 10px 3px",
                    padding: "10px 30px 10px 12px",
                    marginBottom: i < 2 ? "9px" : 0,
                    opacity: 0,
                    position: "relative",
                    boxShadow: "0 2px 8px rgba(27,74,90,0.08)",
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
                    position: "absolute", bottom: "5px", right: "8px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "8px", fontWeight: 700,
                    color: "#7BBF4A",
                  }}>✓✓</div>
                </div>
              ))}

              {/* Stamp — double ring */}
              <div style={{
                position: "absolute", bottom: "30px", right: "14px",
                width: "44px", height: "44px",
                border: "2px solid rgba(232,98,42,0.35)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: "rotate(-14deg)",
              }}>
                <div style={{
                  position: "absolute", inset: "3px",
                  border: "1px dashed rgba(232,98,42,0.3)",
                  borderRadius: "50%",
                }} />
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "5.5px", fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "rgba(232,98,42,0.55)",
                  textAlign: "center", lineHeight: 1.3,
                }}>ENTRY<br />GRANTED</div>
              </div>

              {/* MRZ machine-readable strip */}
              <div aria-hidden style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "5px 14px 7px",
                background: "rgba(27,74,90,0.04)",
                borderTop: "1px solid rgba(27,74,90,0.10)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "7px", fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(27,74,90,0.32)",
                lineHeight: 1.5,
                whiteSpace: "nowrap", overflow: "hidden",
              }}>
                P&lt;KAIVOTRAVEL&lt;&lt;DELEGATE&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                KV06AI&lt;&lt;9KAI2026&lt;&lt;&lt;BOOKED&lt;&lt;&lt;60S
              </div>
            </div>

          </div>{/* end passport card */}
          </div>{/* end passport-core */}

            {/* orbiting travel objects — above the passport, always visible */}
            <div className="orbit-layer">
              {ORBIT_OBJECTS.map((o, i) => (
                <div
                  key={i}
                  className="orbit-item"
                  style={{ offsetPath: `path('${o.path}')`, animationDuration: `${o.dur}s`, animationDelay: `${o.delay}s` }}
                >
                  <div className="orbit-chip" style={{ "--chip-tilt": `${o.tilt}deg` } as React.CSSProperties}>
                    {o.node}
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end conv-stage */}
        </div>
      </div>
    </section>
  );
}
