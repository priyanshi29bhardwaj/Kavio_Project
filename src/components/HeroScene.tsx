import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KaivoWordmark } from "./KaivoLogo";

gsap.registerPlugin(ScrollTrigger);

// ─── Shutter ──────────────────────────────────────────────────────────────────
function Shutter({ open }: { open: boolean }) {
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !shadeRef.current) return;
    gsap.to(shadeRef.current, {
      opacity: 0,
      duration: 2.2,
      ease: "power2.inOut",
      delay: 0.1,
      onComplete: () => {
        if (shadeRef.current) shadeRef.current.style.pointerEvents = "none";
      },
    });
  }, [open]);

  return (
    <div
      ref={shadeRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "#04060c",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "18px",
      }}
    >
      <KaivoWordmark
        height={58}
        color="white"
        style={{ filter: "drop-shadow(0 4px 32px rgba(255,255,255,0.15))" }}
      />
      <p style={{
        fontFamily: "'Urbanist', sans-serif",
        fontWeight: 600,
        fontSize: "clamp(11px, 1.1vw, 15px)",
        letterSpacing: "0.32em",
        color: "rgba(255,255,255,0.75)",
        textTransform: "uppercase",
        margin: 0,
      }}>
        Stop Doing. Start Delegating.
      </p>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
interface HeroSceneProps {
  onJoinWaitlist: () => void;
  shutterOpen: boolean;
}

export function HeroScene({ onJoinWaitlist, shutterOpen }: HeroSceneProps) {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const cabinRef    = useRef<HTMLDivElement>(null);
  const vigRef      = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const skyBrandRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // On mobile: no pin — users scroll freely, animation fires once on enter
      if (isMobile) {
        gsap.set([leftRef.current, rightRef.current, ctaRef.current], { opacity: 1 });
        gsap.set(skyBrandRef.current, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ── 0-22%: text + CTA fade out
      tl.fromTo(
        [leftRef.current, rightRef.current, ctaRef.current],
        { opacity: 1 },
        { opacity: 0, duration: 0.22 },
        0
      );

      gsap.set(skyBrandRef.current, { opacity: 0, scale: 0.88 });

      // ── 0-100%: cabin zooms continuously to scale 4.5.
      // The oval frame exits the viewport around scale ~3.2 — after that the
      // visible area is only the transparent window opening (pure sky).
      // No opacity fade needed: the frame is geometrically off-screen.
      tl.to(cabinRef.current, {
        scale: 4.5,
        transformOrigin: "50% 47%",
        ease: "power2.in",
        duration: 1.0,
      }, 0);

      // ── 65-88%: vignette clears
      tl.to(vigRef.current, { opacity: 0, duration: 0.23 }, 0.65);

      // ── 82-90%: KAIVO brand rises into the open sky and holds to the end of the pin.
      // No fade-out: the hero section scrolling away IS the transition.
      // The next section appears over it naturally.
      tl.to(skyBrandRef.current,
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.08 },
        0.82
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Text entrance: runs once after shutter opens ──────────────────────────
  useEffect(() => {
    if (!shutterOpen) return;

    gsap.set(leftRef.current,  { opacity: 0, y: 24, filter: "blur(14px)" });
    gsap.set(rightRef.current, { opacity: 0, y: 24, filter: "blur(14px)" });
    gsap.set(ctaRef.current,   { opacity: 0, y: 16, filter: "blur(8px)" });

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(leftRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 1.6, ease: "power2.out",
    }, 0.2)
    .to(rightRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 1.6, ease: "power2.out",
    }, 0.3)
    .to(ctaRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 1.2, ease: "power2.out",
    }, 0.8);
  }, [shutterOpen]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        isolation: "isolate",
        background: "transparent",
        zIndex: 1,
      }}
    >
      {/* ── Cabin interior ────────────────────────────────────────────────────
          The fixed sky video in App.tsx (position:fixed, z:0) shows through
          the hero's transparent background and through the transparent oval
          window in cabin.png. No second video needed — no crossfade, no flash,
          no seam. Fading the cabin simply reveals the continuous sky behind it. */}
      <div
        ref={cabinRef}
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0, right: "-2%",
          zIndex: 2,
          backgroundImage: "url(/cabin.png)",
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          willChange: "transform",
        }}
      />

      {/* ── Edge vignette ── */}
      <div
        ref={vigRef}
        style={{
          position: "absolute", inset: 0, zIndex: 3,
          background:
            "radial-gradient(ellipse 58% 65% at 50% 50%," +
            " rgba(0,0,0,0.00) 0%," +
            " rgba(0,0,0,0.06) 44%," +
            " rgba(0,0,0,0.28) 66%," +
            " rgba(0,0,0,0.58) 84%," +
            " rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Left text ── */}
      <div
        ref={leftRef}
        className="hero-side"
        style={{
          position: "absolute",
          left: "4.5%", top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30, pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(13px, 1.4vw, 18px)",
          letterSpacing: "0.22em",
          color: "white",
          textTransform: "uppercase",
          margin: "0 0 14px",
          textShadow: "0 1px 12px rgba(0,0,0,0.9), 0 2px 24px rgba(0,0,0,0.6)",
        }}>AI-Powered</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(18px, 2.2vw, 34px)",
          lineHeight: 1.1,
          letterSpacing: "0.02em",
          color: "white",
          textTransform: "uppercase",
          margin: 0,
          textShadow: "0 2px 24px rgba(0,0,0,0.75)",
          whiteSpace: "nowrap",
        }}>
          Conversational<br />
          Travel Booking<br />
          Agent
        </p>
      </div>

      {/* ── Right text ── */}
      <div
        ref={rightRef}
        className="hero-side"
        style={{
          position: "absolute",
          right: "4.5%", bottom: "13%",
          zIndex: 30,
          textAlign: "right", pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(12px, 1.4vw, 20px)",
          lineHeight: 1.2,
          letterSpacing: "0.06em",
          color: "white",
          textTransform: "uppercase",
          margin: "0 0 3px",
          textShadow: "0 2px 18px rgba(0,0,0,0.65)",
          whiteSpace: "nowrap",
        }}>Delegate &amp; Approve:</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(16px, 2.1vw, 30px)",
          lineHeight: 1.05,
          letterSpacing: "0.03em",
          color: "white",
          textTransform: "uppercase",
          margin: "0 0 2px",
          textShadow: "0 2px 18px rgba(0,0,0,0.65)",
          whiteSpace: "nowrap",
        }}>Book a Flight in</p>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(22px, 2.8vw, 42px)",
          lineHeight: 1,
          letterSpacing: "0.03em",
          color: "white",
          textTransform: "uppercase",
          margin: 0,
          textShadow: "0 2px 20px rgba(0,0,0,0.45)",
          whiteSpace: "nowrap",
        }}>60 Seconds</p>
      </div>

      {/* ── Mobile strip ── */}
      <div
        className="hero-mob"
        style={{
          position: "absolute",
          bottom: "11%",
          left: 0, right: 0,
          textAlign: "center",
          zIndex: 30, pointerEvents: "none",
          padding: "0 20px",
        }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: "8px",
          letterSpacing: "0.22em", color: "white",
          textTransform: "uppercase", margin: "0 0 6px",
        }}>AI-Powered Travel Booking</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800, fontSize: "22px",
          lineHeight: 1.1, color: "white",
          textTransform: "uppercase", margin: 0,
          textShadow: "0 2px 16px rgba(0,0,0,0.65)",
        }}>
          Book a Flight in{" "}
          <span style={{ color: "white" }}>60 Seconds</span>
        </p>
      </div>

      {/* ── CTA pill ── */}
      <div
        ref={ctaRef}
        style={{
          position: "absolute",
          bottom: "2%",
          left: 0, right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 30,
        }}
      >
        <button
          onClick={onJoinWaitlist}
          style={{
            background: "white",
            color: "#1B4A5A",
            border: "none",
            padding: "14px 38px",
            borderRadius: "100px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: "10px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
          }}
        >
          Join the Waitlist <span style={{ fontSize: "15px" }}>✈</span>
        </button>
      </div>

      {/* ── KAIVO sky brand — appears in open sky as cabin dissolves ── */}
      <div
        ref={skyBrandRef}
        style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 22,
          textAlign: "center",
          pointerEvents: "none",
          opacity: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <KaivoWordmark
          height={54}
          color="white"
          style={{ filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.5))" }}
        />
        <div style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 600,
          fontSize: "clamp(11px, 1.1vw, 14px)",
          letterSpacing: "0.38em",
          color: "rgba(255,255,255,0.90)",
          textTransform: "uppercase",
          textShadow: "0 2px 16px rgba(0,0,0,0.70)",
        }}>
          Conversational Travel Booking
        </div>
      </div>

      {/* ── Shutter ── */}
      <Shutter open={shutterOpen} />

      {/* ── Scroll indicator ── */}
      <div style={{
        position: "absolute", bottom: "0.6%", left: 0, right: 0,
        textAlign: "center",
        color: "rgba(255,255,255,0.28)",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "7px", letterSpacing: "0.3em",
        textTransform: "uppercase",
        zIndex: 30, pointerEvents: "none",
      }}>
        SCROLL DOWN
      </div>
    </section>
  );
}
