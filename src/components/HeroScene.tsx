import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Shutter ──────────────────────────────────────────────────────────────────
// Full-viewport cinematic curtain — slides up to reveal the entire cabin scene.
// No longer clipped to a window oval; the whole screen opens like a blind.
function Shutter({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    gsap.to(ref.current, {
      yPercent: -101,
      duration: 2.2,
      ease: "power2.inOut",
      delay: 0.2,
    });
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,          // above everything — covers full viewport
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* ── Main shade ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg," +
            " rgba(252,246,236,0.98) 0%," +
            " #f0e8da 12%," +
            " #e2d5c0 35%," +
            " #cfc1a8 62%," +
            " #bfb094 82%," +
            " #afa080 100%)",
          boxShadow:
            "inset 0 4px 20px rgba(255,220,160,0.30)," +
            " inset 0 -6px 18px rgba(0,0,0,0.15)",
        }}
      />

      {/* ── Fabric ribs ── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0, right: 0,
            top: `${(i / 20) * 100}%`,
            height: "1px",
            background:
              i % 2 === 0
                ? "rgba(255,255,255,0.09)"
                : "rgba(0,0,0,0.04)",
          }}
        />
      ))}

      {/* ── Sunrise glow at top ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "10%",
          background:
            "linear-gradient(180deg, rgba(255,210,130,0.18) 0%, transparent 100%)",
        }}
      />

      {/* ── Pull handle at bottom — centred ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "72px",
          height: "20px",
          background:
            "linear-gradient(180deg, #e8dcc8 0%, #c8b898 40%, #b0a080 100%)",
          borderRadius: "12px 12px 0 0",
          boxShadow:
            "0 -4px 14px rgba(0,0,0,0.22)," +
            " inset 0 1px 4px rgba(255,255,255,0.5)," +
            " inset 0 -2px 4px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "3px",
              height: "9px",
              borderRadius: "2px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(160,140,110,0.8) 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>
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
  const heroSkyRef  = useRef<HTMLDivElement>(null);  // live sky — zooms during scroll
  const cabinRef    = useRef<HTMLDivElement>(null);
  const vigRef      = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const skyBrandRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1.4,
          anticipatePin: 1,
        },
      });

      // Initial states
      gsap.set(heroSkyRef.current,  { scale: 1.08, opacity: 0 });
      gsap.set(skyBrandRef.current, { opacity: 0, scale: 0.88 });

      // ── 0-22%: text + CTA fade out — give the zoom full screen
      tl.to(
        [leftRef.current, rightRef.current, ctaRef.current],
        { opacity: 0, duration: 0.22 },
        0
      );
      // ── logo persists a little longer (fades out at 0-38%)
      tl.to(logoRef.current, { opacity: 0, duration: 0.38 }, 0);

      // ── 0-68%: cabin zooms in
      tl.to(cabinRef.current, {
        scale: 2.6,
        transformOrigin: "50% 47%",
        ease: "power2.in",
        duration: 0.68,
      }, 0);

      // ── 48-76%: cabin fades — passed through the glass
      tl.to(cabinRef.current, { opacity: 0, duration: 0.28 }, 0.48);

      // ── 22-72%: sky fades in as window fills viewport
      tl.to(heroSkyRef.current, { opacity: 1, duration: 0.50 }, 0.22);

      // ── 0-100%: sky zooms with same momentum
      tl.to(heroSkyRef.current, { scale: 1.38, ease: "none", duration: 1 }, 0);

      // ── 42-98%: vignette clears
      tl.to(vigRef.current, { opacity: 0, duration: 0.56 }, 0.42);

      // ── 36-60%: KAIVO brand rises INTO the open clouds
      tl.to(
        skyBrandRef.current,
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.24 },
        0.36
      );

      // ── 80-100%: heroSkyRef fades OUT before pin ends.
      // This makes HeroScene fully transparent at pin release so the global
      // fixed sky behind it shows through — zero visible seam when scrolling
      // into CloudTextSection (which also shows the same global sky).
      tl.to(heroSkyRef.current, { opacity: 0, duration: 0.20 }, 0.80);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Text entrance: runs once after shutter opens ──────────────────────────
  useEffect(() => {
    if (!shutterOpen) return;

    // Set everything to hidden immediately (shutter still covers them)
    gsap.set(logoRef.current,  { opacity: 0, scale: 0.82 });
    gsap.set(leftRef.current,  { opacity: 0, y: 44, filter: "blur(7px)" });
    gsap.set(rightRef.current, { opacity: 0, y: 44, filter: "blur(7px)" });
    gsap.set(ctaRef.current,   { opacity: 0, y: 30, filter: "blur(5px)" });

    // Shutter takes 2.2s + 0.2s delay; start texts slightly before it fully clears
    const tl = gsap.timeline({ delay: 1.7 });

    tl.to(logoRef.current, {
      opacity: 1, scale: 1,
      duration: 0.9, ease: "back.out(1.5)",
    })
    .to(leftRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.75, ease: "power3.out",
    }, "-=0.55")
    .to(rightRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.75, ease: "power3.out",
    }, "-=0.65")
    .to(ctaRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.6, ease: "power3.out",
    }, "-=0.5");
  }, [shutterOpen]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "transparent",
        zIndex: 1,
      }}
    >
      {/* ── Live sky — fills behind cabin, zooms during scroll ──────────────
          Oversize by 6% so the zoom animation never shows blank edges.
          Same clouds.png + skyDrift animation as the global background,
          so the final full-screen sky is perfectly seamless. */}
      <div
        ref={heroSkyRef}
        style={{
          position: "absolute",
          top: "-6%", left: "-6%",
          width: "112%", height: "112%",
          backgroundImage: "url(/clouds.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          animation: "skyDrift 28s ease-in-out infinite",
          zIndex: 1,
          willChange: "transform",
          opacity: 0,    // hidden until scroll — sky appears with the window
        }}
      />

      {/* ── Cabin interior ──────────────────────────────────────────────────
          mix-blend-mode: multiply  →  the dark leather walls stay dark;
          the bright window opening multiplies with the live sky below
          and lets it shine through naturally. No fake oval needed —
          the real window frame in the photo IS the window frame. */}
      <div
        ref={cabinRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          backgroundImage: "url(/cabin.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          mixBlendMode: "multiply" as const,
          willChange: "transform",
        }}
      />

      {/* ── Edge vignette — corners only, centre clear ── */}
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

      {/* ── KAIVO logo — floats inside the real window opening ── */}
      <div
        ref={logoRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "48%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          display: "flex", alignItems: "center", gap: "12px",
          pointerEvents: "none", color: "white",
          textShadow: "0 2px 20px rgba(0,0,0,0.55)",
        }}
      >
        <svg viewBox="0 0 100 100" width="38" height="38" fill="none">
          <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2" strokeOpacity="0.90" />
          <circle cx="50" cy="50" r="27" stroke="white" strokeWidth="1.5" strokeOpacity="0.90" />
          <polygon points="50,36 64,50 50,64 36,50" fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="1.5" />
          <polygon points="50,43 57,50 50,57 43,50" fill="white" />
        </svg>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(15px, 1.6vw, 22px)",
            letterSpacing: "0.36em",
          }}
        >
          KAIVO
        </span>
      </div>

      {/* ── Left text — desktop/tablet ── */}
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
          fontSize: "clamp(8px, 0.8vw, 11px)",
          letterSpacing: "0.24em",
          color: "#E8622A",
          textTransform: "uppercase",
          margin: "0 0 10px",
        }}>AI-Powered</p>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(16px, 1.9vw, 28px)",
          lineHeight: 1.1,
          letterSpacing: "0.02em",
          color: "white",
          textTransform: "uppercase",
          margin: 0,
          textShadow: "0 2px 18px rgba(0,0,0,0.65)",
          whiteSpace: "nowrap",
        }}>
          Conversational<br />
          Travel Booking<br />
          Agent
        </p>
      </div>

      {/* ── Right text — desktop/tablet ── */}
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
          color: "#E8622A",
          textTransform: "uppercase",
          margin: 0,
          textShadow: "0 2px 20px rgba(0,0,0,0.45)",
          whiteSpace: "nowrap",
        }}>60 Seconds</p>
      </div>

      {/* ── Mobile-only strip ── */}
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
          letterSpacing: "0.22em", color: "#E8622A",
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
          <span style={{ color: "#E8622A" }}>60 Seconds</span>
        </p>
      </div>

      {/* ── CTA pill ── */}
      <div
        ref={ctaRef}
        style={{
          position: "absolute",
          bottom: "4%",
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

      {/* ── KAIVO sky brand — rises into open sky as cabin dissolves ── */}
      <div
        ref={skyBrandRef}
        style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 22,
          textAlign: "center",
          pointerEvents: "none",
          color: "white",
          opacity: 0,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="72"
          height="72"
          fill="none"
          style={{ display: "block", margin: "0 auto 16px" }}
        >
          <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2.2" strokeOpacity="0.9" />
          <circle cx="50" cy="50" r="27" stroke="white" strokeWidth="1.6" strokeOpacity="0.9" />
          <polygon
            points="50,36 64,50 50,64 36,50"
            fill="rgba(255,255,255,0.18)"
            stroke="white"
            strokeWidth="1.6"
          />
          <polygon points="50,43 57,50 50,57 43,50" fill="white" />
        </svg>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(34px, 4.8vw, 68px)",
            letterSpacing: "0.44em",
            textShadow: "0 4px 40px rgba(0,0,0,0.55), 0 0 80px rgba(255,255,255,0.08)",
          }}
        >
          KAIVO
        </div>
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(10px, 1vw, 13px)",
            letterSpacing: "0.34em",
            color: "rgba(255,255,255,0.60)",
            textTransform: "uppercase",
            marginTop: "12px",
          }}
        >
          Conversational Travel Booking
        </div>
      </div>

      {/* ── Full-viewport cinematic shutter — slides up on preloader complete ── */}
      <Shutter open={shutterOpen} />

      {/* ── Scroll indicator ── */}
      <div style={{
        position: "absolute", bottom: "1.2%", left: 0, right: 0,
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
