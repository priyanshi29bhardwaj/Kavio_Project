import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Icons ─────────────────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke="#1B4A5A" strokeWidth="1.5" />
      <path d="M11 6.5V11L13.5 13.5" stroke="#1B4A5A" strokeWidth="1.8"
        strokeLinecap="round" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke="#1B4A5A" strokeWidth="1.5" />
      <path d="M7.5 11L10 13.5L14.5 8.5" stroke="#1B4A5A" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TrendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M3.5 15.5L8.5 9.5L12.5 12.5L18 6.5"
        stroke="#1B4A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 6.5H18V10"
        stroke="#1B4A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "Saves hours",
    body:  "Less searching. Less comparing. Less admin.",
  },
  {
    title: "Gets it right",
    body:  "Built around your timing, baggage, budget, airline preferences, and trade-offs.",
  },
  {
    title: "Learns over time",
    body:  "The more you use Kaivo, the less you have to explain.",
  },
] as const;

const NO_ITEMS = [
  "No tabs.",
  "No repeated forms.",
  "No restarting searches.",
  "No second-guessing.",
] as const;

function FeatureIcon({ i }: { i: number }) {
  if (i === 0) return <ClockIcon />;
  if (i === 1) return <CheckCircleIcon />;
  return <TrendIcon />;
}

export function WhyLoveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const bannerRef  = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  // Text refs
  const badgeRef = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(badgeRef.current,                 { opacity: 0, y: 14 });
      gsap.set(headRef.current,                  { opacity: 0, y: 32 });
      gsap.set(cardRefs.current.filter(Boolean), { y: 32, opacity: 0 });
      gsap.set(bannerRef.current,                { y: 24, opacity: 0 });
      gsap.set(bottomRef.current,                { y: 20, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl
        .to(badgeRef.current,
          { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        .to(headRef.current,
          { opacity: 1, y: 0, duration: 0.7,  ease: "power3.out" }, 0.18)
        .to(cardRefs.current,
          { y: 0, opacity: 1, duration: 0.6,  stagger: 0.16, ease: "power2.out" }, 0.45)
        .to(bannerRef.current,
          { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }, 0.78)
        .to(bottomRef.current,
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }, 1.05);

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
        background: "white",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vh, 100px) 0",
      }}
    >

      {/* Watermark */}
      <div aria-hidden style={{
        position: "absolute", right: "-1%", top: "50%",
        transform: "translateY(-46%)",
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
        fontSize: "clamp(140px, 20vw, 300px)",
        color: "rgba(27,74,90,0.028)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        letterSpacing: "-0.05em",
      }}>08</div>

      <div style={{
        maxWidth: "1120px",
        width: "100%",
        padding: "0 clamp(20px, 4vw, 60px)",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(36px, 5vh, 56px)",
      }}>

        {/* ── Badge + Headline ─────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", maxWidth: "820px" }}>

          {/* Pill badge */}
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(27,74,90,0.15)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "28px",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 12.5C7 12.5 1.5 9 1.5 5C1.5 3.07 3.07 1.5 5 1.5C5.97 1.5 6.84 1.9 7 2C7.16 1.9 8.03 1.5 9 1.5C10.93 1.5 12.5 3.07 12.5 5C12.5 9 7 12.5 7 12.5Z"
                stroke="#E8622A" strokeWidth="1.2" fill="rgba(232,98,42,0.1)" />
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "10px", letterSpacing: "0.32em",
              color: "rgba(27,74,90,0.55)", textTransform: "uppercase",
            }}>
              Why People Will Love It
            </span>
          </div>

          {/* Headline */}
          <div ref={headRef} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(32px, 4.8vw, 66px)",
            color: "#1B4A5A", lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>
            The best travel product isn't the one
            with{" "}
            <span style={{ color: "#7ECECA" }}>the most options.</span>
            {" "}It's the one that gives you{" "}
            <span style={{ color: "#7ECECA" }}>your time back.</span>
          </div>
        </div>

        {/* ── Feature cards ─────────────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(12px, 1.8vw, 20px)",
          width: "100%",
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                background: "white",
                border: "1.5px solid rgba(27,74,90,0.08)",
                borderRadius: "16px",
                padding: "clamp(20px, 2.4vw, 30px)",
                boxShadow: "0 2px 20px rgba(27,74,90,0.06)",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                opacity: 0,
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: "46px", height: "46px", flexShrink: 0,
                borderRadius: "50%",
                background: "rgba(126,206,202,0.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FeatureIcon i={i} />
              </div>

              {/* Text */}
              <div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 800,
                  fontSize: "clamp(16px, 1.8vw, 20px)",
                  color: "#1B4A5A", lineHeight: 1.2, marginBottom: "7px",
                }}>
                  {f.title}
                </div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 400,
                  fontSize: "clamp(12px, 1.1vw, 14px)",
                  color: "rgba(27,74,90,0.52)", lineHeight: 1.65,
                }}>
                  {f.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Travel image banner ──────────────────────────────────────────── */}
        <div
          ref={bannerRef}
          style={{
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            position: "relative",
            minHeight: "clamp(140px, 22vh, 220px)",
            backgroundImage: "url(/clouds.png)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
          }}
        >
          {/* Teal overlay */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(27,74,90,0.72), rgba(11,44,58,0.78))",
          }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(28px, 4vh, 48px) 24px" }}>
            <div style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
              fontSize: "clamp(22px, 3.6vw, 50px)",
              color: "white", letterSpacing: "-0.025em", lineHeight: 1.1,
            }}>
              Your next trip, booked in under{" "}
              <span style={{ color: "#C8E44A" }}>60 seconds.</span>
            </div>
          </div>
        </div>

        {/* ── NO items + tagline ───────────────────────────────────────────── */}
        <div
          ref={bottomRef}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            paddingTop: "clamp(8px, 1.5vh, 16px)",
            borderTop: "1px solid rgba(27,74,90,0.08)",
            opacity: 0,
          }}
        >
          {/* NO items as inline row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 0px", alignItems: "center" }}>
            {NO_ITEMS.map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 500, fontSize: "clamp(12px, 1.1vw, 14px)",
                  color: "rgba(27,74,90,0.4)",
                }}>
                  <span style={{ color: "#E8622A", fontWeight: 700 }}>No </span>
                  {item.replace("No ", "")}
                </span>
                {i < NO_ITEMS.length - 1 && (
                  <span style={{
                    margin: "0 12px",
                    color: "rgba(27,74,90,0.18)",
                    fontSize: "12px",
                  }}>·</span>
                )}
              </span>
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700, fontSize: "clamp(13px, 1.3vw, 16px)",
            color: "#1B4A5A",
            whiteSpace: "nowrap",
          }}>
            Just say what you need.{" "}
            <span style={{ color: "rgba(27,74,90,0.4)", fontWeight: 500 }}>
              Kaivo handles the rest.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
