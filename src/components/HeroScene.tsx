import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KaivoWordmark } from "./KaivoLogo";

gsap.registerPlugin(ScrollTrigger);

// ─── Shutter ──────────────────────────────────────────────────────────────────
// Dark blind sitting inside the oval window — slides up to reveal the sky.
// Sizing/position lives in .shutter-clip (index.css) so media queries apply.
function Shutter({ open }: { open: boolean }) {
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !shadeRef.current) return;

    // Slide the shade UP off the top of the oval — natural blind opening direction.
    gsap.to(shadeRef.current, {
      yPercent: -101,
      duration: 2.1,
      ease: "power2.inOut",
      delay: 0.1,
    });
  }, [open]);

  return (
    <div className="shutter-clip">
      <div
        ref={shadeRef}
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {/* MAIN SHADE */}
        <div
         style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(
              90deg,
              #a8875d 0%,
              #b39267 18%,
              #bc9b6f 42%,
              #b28f64 68%,
              #98754f 100%
            )
          `,
          boxShadow: `
            inset 8px 0 12px rgba(255,240,210,0.05),
            inset -22px 0 26px rgba(25,12,4,0.22),
            inset 0 4px 10px rgba(255,255,255,0.015),
            inset 0 -10px 14px rgba(20,10,4,0.08)
          `,
        }}
        />

        {/* SOFT FABRIC TEXTURE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.012,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.2) 0.7px, transparent 0.7px)",
            backgroundSize: "6px 6px",
            mixBlendMode: "soft-light",
          }}
        />

        {/* RIBS */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(i / 20) * 100}%`,
              height: "1px",
              background:
                i % 2 === 0
                  ? "rgba(255,245,220,0.035)"
                  : "rgba(40,22,10,0.05)",
            }}
          />
        ))}

        {/* TOP SHADOW */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "26px",
            background:
              "linear-gradient(to bottom, rgba(20,10,2,0.22), transparent)",
          }}
        />

        {/* BOTTOM DEPTH */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "16px",
            background:
              "linear-gradient(to top, rgba(20,10,4,0.08), transparent)",
          }}
        />

        {/* HANDLE */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "72px",
            height: "20px",
            background:
              "linear-gradient(180deg, #8a6a42 0%, #72542d 45%, #5a401f 100%)",
            borderRadius: "12px 12px 0 0",
            boxShadow: `
              0 -2px 6px rgba(0,0,0,0.12),
              inset 0 1px 2px rgba(255,255,255,0.15)
            `,
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
                height: "8px",
                borderRadius: "2px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.28), rgba(70,50,25,0.7))",
              }}
            />
          ))}
        </div>
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
  const heroSkyRef  = useRef<HTMLVideoElement>(null); // live sky — zooms during scroll
  const videoRef    = useRef<HTMLVideoElement>(null); // same element — seek control
  const cabinRef    = useRef<HTMLDivElement>(null);
  const vigRef      = useRef<HTMLDivElement>(null);
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
          invalidateOnRefresh: true, // recalculate all positions after browser zoom / resize
        },
      });

      // Initial states — video opacity is set via inline CSS (opacity:0 on the
      // element itself). Do NOT set opacity here — ScrollTrigger.refresh() can
      // reset GSAP-owned values, which would re-hide the video after it's shown.
      gsap.set(heroSkyRef.current,  { scale: 1.0 });
      gsap.set(skyBrandRef.current, { opacity: 0, scale: 0.88 });

      // ── 0-22%: text + CTA fade out — give the zoom full screen
      tl.fromTo(
        [leftRef.current, rightRef.current, ctaRef.current],
        { opacity: 1 },
        { opacity: 0, duration: 0.22 },
        0
      );

      // ── 0-68%: cabin zooms in — stays fully opaque the whole time
      tl.to(cabinRef.current, {
        scale: 2.6,
        transformOrigin: "50% 47%",
        ease: "power2.in",
        duration: 0.68,
      }, 0);

      // ── 80-95%: cabin fades only in the final stretch of the scroll pin
      // Window frame stays solid during the entire zoom — no see-through effect
      tl.to(cabinRef.current, { opacity: 0, duration: 0.15 }, 0.80);

      // ── 65-90%: vignette clears
      tl.to(vigRef.current, { opacity: 0, duration: 0.25 }, 0.65);

      // ── 81-92%: KAIVO sky brand appears only after cabin fades
      tl.to(
        skyBrandRef.current,
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.11 },
        0.81
      );

      // ── 88-100%: fade hero sky video out, handing off to the fixed background.
      // Both videos play the same source at the same objectPosition (50% 50%)
      // and the same effective size, so the crossfade is completely invisible.
      // After the pin releases, CloudTextSection (and beyond) show only the
      // fixed sky video — no crop mismatch, no seam.
      // NOTE: video opacity IS now in this timeline for the final 12% only.
      // The initial opacity:0 → 1 reveal (onSeeked) is not affected because
      // that fires well before the 88% scroll threshold is reached.
      tl.to(heroSkyRef.current, { opacity: 0, duration: 0.12 }, 0.88);
    }, sectionRef);

    // Zoom-reset is handled in App.tsx via lenis.scrollTo(0, { immediate: true })
    // which correctly resets Lenis's virtual scroll position (window.scrollTo
    // does not, since Lenis manages its own scroll state).
    return () => ctx.revert();
  }, []);

  // ── Park video at the golden sunrise frame — do NOT autoplay yet ─────────
  // Video starts at opacity:0 (see GSAP initial set above). Once the browser
  // confirms frame 3 is fully decoded via the "seeked" event, we reveal the
  // video. This prevents any flash of frame 0 through the oval window.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onSeeked = () => {
      // Frame 3 is now decoded — make the video visible (was opacity:0 via inline CSS)
      if (heroSkyRef.current) heroSkyRef.current.style.opacity = "1";
    };

    const seek = () => {
      vid.addEventListener("seeked", onSeeked, { once: true });
      vid.currentTime = 3; // 0:03 — golden sun burst + wing
    };

    // Loop from frame 3 BEFORE the video ends — never let it hit frame 0.
    // timeupdate fires ~4× per second while playing; proactively jump 0.5 s early
    // so there's no end-of-clip flash and no wrong-frame seek artifact.
    let loopSeeking = false;
    const onTimeUpdate = () => {
      if (!vid.duration || loopSeeking) return;
      if (vid.currentTime >= vid.duration - 0.5) {
        loopSeeking = true;
        vid.addEventListener("seeked", () => { loopSeeking = false; }, { once: true });
        vid.currentTime = 3;
      }
    };
    vid.addEventListener("timeupdate", onTimeUpdate);

    // Safety fallback: reveal after 3 s even if seeked never fires
    const fallback = setTimeout(() => {
      if (heroSkyRef.current) heroSkyRef.current.style.opacity = "1";
    }, 3000);

    if (vid.readyState >= 1) {
      seek(); // metadata already available (cached / fast load)
    } else {
      vid.addEventListener("loadedmetadata", seek, { once: true });
    }

    return () => {
      clearTimeout(fallback);
      vid.removeEventListener("loadedmetadata", seek);
      vid.removeEventListener("seeked", onSeeked);
      vid.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  // ── Text entrance: runs once after shutter opens ──────────────────────────
  useEffect(() => {
    if (!shutterOpen) return;

    // The mount effect already parked the video at frame 3 and confirmed it
    // via the "seeked" event. Just call play() directly — no re-seek needed,
    // which was causing a second flash of frame 0.
    const vid = videoRef.current;
    if (vid) {
      if (vid.currentTime < 0.5) {
        // Edge case: metadata not loaded yet — seek first then play
        const startPlay = () => vid.play().catch(() => {});
        vid.addEventListener("seeked", startPlay, { once: true });
        vid.currentTime = 3;
      } else {
        vid.play().catch(() => {});
      }
    }

    // Set everything to hidden immediately (shutter still covers them)
    gsap.set(leftRef.current,  { opacity: 0, y: 44, filter: "blur(7px)" });
    gsap.set(rightRef.current, { opacity: 0, y: 44, filter: "blur(7px)" });
    gsap.set(ctaRef.current,   { opacity: 0, y: 30, filter: "blur(5px)" });

    // Shutter takes 2.1s + 0.1s delay; start texts just before it fully clears
    const tl = gsap.timeline({ delay: 1.8 });

    tl.to(leftRef.current, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 0.75, ease: "power3.out",
    })
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
      {/* ── Window video — shows through the oval cabin window during the hero pin.
          Sized identically to the fixed sky video in App.tsx (110 % × 110 %, same
          objectPosition) so the two videos show the exact same crop. At 88–100 %
          of the scroll pin it fades to opacity:0, handing off seamlessly to the
          fixed sky video. CloudTextSection and beyond use only the fixed video —
          no crop mismatch, no seam at the section boundary.
          No autoPlay: video is parked at 3s and starts only when shutter opens. */}
      <video
        ref={(el) => {
          (heroSkyRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
          (videoRef   as React.MutableRefObject<HTMLVideoElement | null>).current = el;
        }}
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "50% 50%", // centred — golden sky fills full canvas
          zIndex: 1,
          willChange: "transform",
          opacity: 0, // hidden until frame 3 is decoded; revealed via .style.opacity in onSeeked
        }}
      >
        <source src="/window_behind.mp4" type="video/mp4" />
      </video>

      {/* ── Cabin interior ──────────────────────────────────────────────────
          mix-blend-mode: multiply  →  the dark leather walls stay dark;
          the bright window opening multiplies with the live sky below
          and lets it shine through naturally. No fake oval needed —
          the real window frame in the photo IS the window frame. */}
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
          color: "white",
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
          opacity: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Full wordmark — mark + KAIVO letters */}
        <KaivoWordmark
          height={54}
          color="white"
          style={{ filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.5))" }}
        />
        <div
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(11px, 1.1vw, 14px)",
            letterSpacing: "0.38em",
            color: "rgba(255,255,255,0.90)",
            textTransform: "uppercase",
            textShadow: "0 2px 16px rgba(0,0,0,0.70), 0 1px 6px rgba(0,0,0,0.50)",
          }}
        >
          Conversational Travel Booking
        </div>
      </div>

      {/* ── Full-viewport cinematic shutter — slides up on preloader complete ── */}
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
