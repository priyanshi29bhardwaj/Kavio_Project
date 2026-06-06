import { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useAnimation } from "framer-motion";
import { KaivoWordmark } from "./KaivoLogo";

gsap.registerPlugin(ScrollTrigger);

// ─── Shutter (frame 0 — dark screen with logo, fades out on open) ─────────────
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
        position: "absolute", inset: 0, zIndex: 50,
        background: "#04060c", pointerEvents: "none",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "18px",
      }}
    >
      <KaivoWordmark
        height={58}
        color="white"
        style={{ filter: "drop-shadow(0 4px 32px rgba(255,255,255,0.15))" }}
      />
      <p style={{
        fontFamily: "'Urbanist', sans-serif", fontWeight: 600,
        fontSize: "clamp(11px, 1.1vw, 15px)", letterSpacing: "0.32em",
        color: "rgba(255,255,255,0.75)", textTransform: "uppercase", margin: 0,
      }}>
        Stop Doing. Start Delegating.
      </p>
    </div>
  );
}

// ─── WindowShade ──────────────────────────────────────────────────────────────
// slide.png slides UP through the transparent oval in WithoutHandler.png,
// revealing the App.tsx fixed sky video behind it.

interface WindowShadeProps {
  open: boolean;
  onShadeComplete?: () => void;
}

function WindowShade({ open, onShadeComplete }: WindowShadeProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (!open) return;
    controls
      .start({
        y: "-100%",
        transition: { duration: 2.0, ease: [0.76, 0, 0.24, 1], delay: 2.3 },
      })
      .then(() => onShadeComplete?.());

    const earlySwap = setTimeout(() => onShadeComplete?.(), 3500);
    return () => clearTimeout(earlySwap);
  }, [open, controls, onShadeComplete]);

  return (
    <div
      style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        overflow: "hidden", pointerEvents: "none",
      }}
    >
      <motion.div
        animate={controls}
        initial={{ y: "0%" }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url(/slide.png)",
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── HeroScene ────────────────────────────────────────────────────────────────

interface HeroSceneProps {
  onJoinWaitlist: () => void;
  shutterOpen: boolean;
}

export function HeroScene({ onJoinWaitlist, shutterOpen }: HeroSceneProps) {
  const sectionRef        = useRef<HTMLDivElement>(null);
  const withoutHandlerRef = useRef<HTMLDivElement>(null);
  const cabinRef          = useRef<HTMLDivElement>(null);
  const shadeWrapperRef   = useRef<HTMLDivElement>(null);
  const vigRef            = useRef<HTMLDivElement>(null);
  const leftRef           = useRef<HTMLDivElement>(null);
  const rightRef          = useRef<HTMLDivElement>(null);
  const ctaRef            = useRef<HTMLDivElement>(null);
  const skyBrandRef       = useRef<HTMLDivElement>(null);
  const ambientRef        = useRef<HTMLAudioElement | null>(null);

  const [shadeComplete, setShadeComplete] = useState(false);

  // ── Scroll-driven zoom ───────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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

      gsap.set(skyBrandRef.current, { opacity: 0, scale: 0.88 });

      tl.fromTo(
        [leftRef.current, rightRef.current, ctaRef.current],
        { opacity: 1 },
        { opacity: 0, duration: 0.22 },
        0
      );

      tl.to(cabinRef.current, {
        scale: 4.5, transformOrigin: "50% 47%", ease: "power2.in", duration: 1.0,
      }, 0);

      tl.to(withoutHandlerRef.current, {
        scale: 4.5, transformOrigin: "50% 47%", ease: "power2.in", duration: 1.0,
      }, 0);

      tl.to(shadeWrapperRef.current, {
        scale: 4.5, transformOrigin: "50% 47%", ease: "power2.in", duration: 1.0,
      }, 0);

      tl.to(vigRef.current, { opacity: 0, duration: 0.23 }, 0.65);

      tl.to(skyBrandRef.current,
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.08 },
        0.82
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Text + cabin entrance after shutter opens ────────────────────────────
  useEffect(() => {
    if (!shutterOpen) return;

    gsap.set(leftRef.current,  { opacity: 0, y: 24, filter: "blur(14px)" });
    gsap.set(rightRef.current, { opacity: 0, y: 24, filter: "blur(14px)" });
    gsap.set(ctaRef.current,   { opacity: 0, y: 16, filter: "blur(8px)" });

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(leftRef.current,  { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "power2.out" }, 0.2)
      .to(rightRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6, ease: "power2.out" }, 0.3)
      .to(ctaRef.current,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }, 0.8);
  }, [shutterOpen]);

  // ── Swap to cabin.png after shade has fully slid up ─────────────────────
  useEffect(() => {
    if (!shadeComplete) return;
    // cabin.png fades in first
    if (cabinRef.current) {
      cabinRef.current.style.transition = "opacity 0.3s ease";
      cabinRef.current.style.opacity = "1";
    }
    // Then fade out no_logo_transparent.png AFTER cabin.png is fully opaque
    // so the dark ring disappears without any flash
    if (withoutHandlerRef.current) {
      withoutHandlerRef.current.style.transition = "opacity 0.3s ease 0.3s";
      withoutHandlerRef.current.style.opacity = "0";
    }
  }, [shadeComplete]);

  // ── Ambient airplane sound (frames 0+1; fades out on scroll past frame 1) ─
  useEffect(() => {
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const scrollThreshold = isMobile ? window.innerHeight * 0.8 : 40;

    const audio = new Audio("/aeoplane_Sound.mp3");
    audio.loop    = true;
    audio.volume  = 0.35;
    audio.preload = "auto";
    ambientRef.current = audio;

    const fadeOutAndStop = () => {
      const step = Math.max(audio.volume / 20, 0.01);
      const fade = setInterval(() => {
        if (audio.volume > step) {
          audio.volume = Math.max(0, audio.volume - step);
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fade);
        }
      }, 30);
    };

    let stopped = false;
    const onScroll = () => {
      if (!stopped && window.scrollY > scrollThreshold) {
        stopped = true;
        fadeOutAndStop();
        window.removeEventListener("scroll", onScroll);
      }
    };

    const removeUnlockListeners = () => {
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("touchend",   unlock);
      document.removeEventListener("click",      unlock);
    };

    // Audio unlock pattern: retry play() on every interaction until it resolves
    const unlock = () => {
      audio.play().then(() => {
        removeUnlockListeners();
        window.addEventListener("scroll", onScroll, { passive: true });
      }).catch(() => {
        // still blocked — will retry on next interaction
      });
    };

    // Try autoplay first; if it fails register unlock listeners
    audio.play().then(() => {
      window.addEventListener("scroll", onScroll, { passive: true });
    }).catch(() => {
      document.addEventListener("touchstart", unlock, { passive: true });
      document.addEventListener("touchend",   unlock, { passive: true });
      document.addEventListener("click",      unlock, { passive: true });
    });

    return () => {
      removeUnlockListeners();
      window.removeEventListener("scroll", onScroll);
      audio.pause();
      audio.src = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "clip",
        touchAction: "pan-y",
        isolation: "isolate",
        background: "transparent", // App.tsx fixed sky video shows through
        zIndex: 1,
      }}
    >
      {/*
        LAYER STACK (bottom → top):
        App.tsx fixed sky video (z:0) — visible through transparent section + transparent oval
        z:2  shade wrapper   — slide.png slides UP through the oval, covers the sky initially
        z:3  WithoutHandler.png — cabin frame; transparent oval = natural mask for shade below
        z:4  cabin.png       — fades in after shade is gone
        z:5  vignette
        z:30 UI / text / CTA
      */}

      {/* ── z:2 — Window shade (slide.png slides up on open) ── */}
      <div
        ref={shadeWrapperRef}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 2, pointerEvents: "none", willChange: "transform",
        }}
      >
        <WindowShade
          open={shutterOpen}
          onShadeComplete={() => setShadeComplete(true)}
        />
      </div>

      {/* ── z:3 — no_logo_transparent.png — no handle, mask for closed shutter ── */}
      <div
        ref={withoutHandlerRef}
        className="cabin-frame-layer"
        style={{
          position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
          zIndex: 3,
          backgroundImage: "url(/no_logo_transparent.png)",
          willChange: "transform",
        }}
      />

      {/* ── z:4 — cabin.png — clean edges, fades in after shutter opens ── */}
      <div
        ref={cabinRef}
        className="cabin-frame-layer"
        style={{
          position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
          zIndex: 4,
          backgroundImage: "url(/cabin.png)",
          willChange: "transform", opacity: 0,
        }}
      />


      {/* ── z:5 — Vignette ── */}
      <div
        ref={vigRef}
        style={{
          position: "absolute", inset: 0, zIndex: 5,
          background:
            "radial-gradient(ellipse 58% 65% at 50% 50%," +
            " rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.06) 44%," +
            " rgba(0,0,0,0.28) 66%, rgba(0,0,0,0.58) 84%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── z:30 — Left text ── */}
      <div
        ref={leftRef}
        className="hero-side"
        style={{
          position: "absolute", left: "4.5%", top: "50%",
          transform: "translateY(-50%)", zIndex: 30, pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: "clamp(17px, 2vw, 26px)", letterSpacing: "0.22em",
          color: "#C8E44A", textTransform: "uppercase", margin: "0 0 14px",
          textShadow: "0 1px 12px rgba(0,0,0,0.9), 0 2px 24px rgba(0,0,0,0.6)",
        }}>AI-Powered</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
          fontSize: "clamp(18px, 2.2vw, 34px)", lineHeight: 1.1,
          letterSpacing: "0.02em", color: "white", textTransform: "uppercase",
          margin: 0, textShadow: "0 2px 24px rgba(0,0,0,0.75)", whiteSpace: "nowrap",
        }}>
          Conversational<br />Travel Booking<br />Agent
        </p>
      </div>

      {/* ── z:30 — Right text ── */}
      <div
        ref={rightRef}
        className="hero-side"
        style={{
          position: "absolute", right: "4.5%", bottom: "13%",
          zIndex: 30, textAlign: "left", pointerEvents: "none",
        }}
      >
        <p style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 700,
          fontSize: "clamp(17px, 2vw, 28px)", lineHeight: 1.2,
          letterSpacing: "0.06em", color: "#C8E44A", textTransform: "uppercase",
          margin: "0 0 3px", textShadow: "0 2px 18px rgba(0,0,0,0.65)", whiteSpace: "nowrap",
        }}>Delegate &amp; Approve:</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
          fontSize: "clamp(16px, 2.1vw, 30px)", lineHeight: 1.05,
          letterSpacing: "0.03em", color: "white", textTransform: "uppercase",
          margin: "0 0 2px", textShadow: "0 2px 18px rgba(0,0,0,0.65)", whiteSpace: "nowrap",
        }}>Book a Flight in</p>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: "clamp(22px, 2.8vw, 42px)", lineHeight: 1,
          letterSpacing: "0.03em", color: "white", textTransform: "uppercase",
          margin: 0, textShadow: "0 2px 20px rgba(0,0,0,0.45)", whiteSpace: "nowrap",
        }}>60 Seconds</p>
      </div>

      {/* ── Mobile strip ── */}
      <div
        className="hero-mob"
        style={{
          position: "absolute", bottom: "11%", left: 0, right: 0,
          textAlign: "center", zIndex: 30, pointerEvents: "none", padding: "0 20px",
        }}
      >
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: "8px", letterSpacing: "0.22em", color: "white",
          textTransform: "uppercase", margin: "0 0 6px",
        }}>AI-Powered Travel Booking</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
          fontSize: "22px", lineHeight: 1.1, color: "white",
          textTransform: "uppercase", margin: 0, textShadow: "0 2px 16px rgba(0,0,0,0.65)",
        }}>
          Book a Flight in <span style={{ color: "white" }}>60 Seconds</span>
        </p>
      </div>

      {/* ── z:30 — CTA button ── */}
      <div
        ref={ctaRef}
        style={{
          position: "absolute", bottom: "2%", left: 0, right: 0,
          display: "flex", justifyContent: "center", zIndex: 30,
        }}
      >
        <button
          onClick={onJoinWaitlist}
          style={{
            background: "white", color: "#1B4A5A", border: "none",
            padding: "14px 38px", borderRadius: "100px",
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
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

      {/* ── KAIVO sky brand (after scroll zoom-through) ── */}
      <div
        ref={skyBrandRef}
        style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)", zIndex: 22,
          textAlign: "center", pointerEvents: "none", opacity: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "18px",
        }}
      >
        <KaivoWordmark
          height={54}
          color="white"
          style={{ filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.5))" }}
        />
        <div style={{
          fontFamily: "'Urbanist', sans-serif", fontWeight: 600,
          fontSize: "clamp(11px, 1.1vw, 14px)", letterSpacing: "0.38em",
          color: "rgba(255,255,255,0.90)", textTransform: "uppercase",
          textShadow: "0 2px 16px rgba(0,0,0,0.70)",
        }}>
          Conversational Travel Booking
        </div>
      </div>

      {/* ── z:50 — Shutter (frame 0: dark screen + logo) ── */}
      <Shutter open={shutterOpen} />

      {/* ── Scroll indicator ── */}
      <div style={{
        position: "absolute", bottom: "0.6%", left: 0, right: 0,
        textAlign: "center", color: "rgba(255,255,255,0.28)",
        fontFamily: "'Space Grotesk', sans-serif", fontSize: "7px",
        letterSpacing: "0.3em", textTransform: "uppercase",
        zIndex: 30, pointerEvents: "none",
      }}>
        SCROLL DOWN
      </div>
    </section>
  );
}
