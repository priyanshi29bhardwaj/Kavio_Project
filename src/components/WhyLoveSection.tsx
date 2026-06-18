import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Commercial aircraft silhouette, pointing right — matches the flight-path aesthetic
function PlaneSVG({ size = 56, color = "#1B4A5A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 0.38)} viewBox="0 0 200 76" fill={color} aria-hidden>
      {/* Fuselage */}
      <path d="M18,40 Q36,32 68,30 L172,28 Q194,28 200,38 Q194,48 172,48 L68,46 Q36,44 18,40Z" />
      {/* Main wing upper */}
      <path d="M118,30 L84,4 L72,7 L106,31Z" />
      {/* Main wing lower */}
      <path d="M118,46 L84,72 L72,69 L106,45Z" />
      {/* Vertical tail fin */}
      <path d="M38,32 L26,12 L35,12 L46,32Z" />
      {/* Horizontal stabiliser upper */}
      <path d="M42,33 L24,22 L21,24 L36,35Z" />
      {/* Horizontal stabiliser lower */}
      <path d="M42,43 L24,54 L21,52 L36,41Z" />
      {/* Engine pod */}
      <path d="M96,47 Q108,47 116,48 L116,52 Q108,53 96,53 Q90,52 88,50 Q90,47 96,47Z" />
    </svg>
  );
}

const ENGINES = [
  {
    num: "01",
    name: "DELEGATION",
    body: "Hand it over. Kaivo does the searching, comparing and booking, so you don't have to.",
  },
  {
    num: "02",
    name: "TRUST",
    body: "The best price we can find, shown with its reasoning. Nothing hidden, nothing pushed.",
  },
  {
    num: "03",
    name: "KNOWLEDGE",
    body: "Kaivo knows when to book, how fares move, and when waiting beats buying.",
  },
  {
    num: "04",
    name: "CONVERSATION",
    body: "Talk or type, like messaging a friend. No filters, no forms, no twelve open tabs.",
  },
  {
    num: "05",
    name: "PERSONALISATION",
    body: "The more you use it, the better it gets. Kaivo adapts to how you travel.",
  },
] as const;

export function WhyLoveSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Flight path refs
  const lineContRef = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const planeRef    = useRef<HTMLDivElement>(null);

  // Content refs
  const badgeRef  = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Flight path scrub ──────────────────────────────────────────────
      const cont  = lineContRef.current;
      const line  = lineRef.current;
      const plane = planeRef.current;
      if (cont && line && plane) {
        gsap.set(line,  { clipPath: "inset(0 100% 0 0)" });
        gsap.set(plane, { x: 0 });
        const endX = cont.offsetWidth - (plane.offsetWidth || 40);
        gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 25%", scrub: 1 },
        })
          .to(line,  { clipPath: "inset(0 0% 0 0)", ease: "none" })
          .to(plane, { x: endX, ease: "none" }, 0);
      }

      // ── Content entrance ──────────────────────────────────────────────
      gsap.set(badgeRef.current,                 { opacity: 0, y: 14 });
      gsap.set(headRef.current,                  { opacity: 0, y: 28 });
      gsap.set(subRef.current,                   { opacity: 0, y: 18 });
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 28 });

      const tl = gsap.timeline({ paused: true });
      tl
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        .to(headRef.current,  { opacity: 1, y: 0, duration: 0.7,  ease: "power3.out" }, 0.15)
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.30)
        .to(cardRefs.current, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" }, 0.48);

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
        background:    "white",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        position:      "relative",
        overflow:      "hidden",
        padding:       "0 0 clamp(48px, 6vh, 80px)",
      }}
    >
      {/* Bottom gradient seam → PurposeSection */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "200px",
        background: "linear-gradient(to bottom, transparent 0%, #f0f9f9 55%, #D6EEEE 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── Full-width dashed flight path ─────────────────────────────── */}
      <div ref={lineContRef} style={{ position: "relative", height: "36px", width: "100%", flexShrink: 0 }}>
        <div ref={lineRef} style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 0, borderTop: "1.5px dashed #7ECECA",
          transform: "translateY(-50%)",
        }} />
        <div ref={planeRef} style={{
          position: "absolute", top: "50%", left: 0,
          transform: "translateY(-50%)", lineHeight: 0,
        }}>
          <PlaneSVG size={44} color="#7ECECA" />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:      "1120px",
        width:         "100%",
        padding:       "clamp(28px, 4vh, 48px) clamp(20px, 4vw, 60px) 0",
        position:      "relative",
        zIndex:        1,
        display:       "flex",
        flexDirection: "column",
        gap:           "clamp(24px, 3vh, 40px)",
      }}>

        {/* ── Badge + Headline ─────────────────────────────────────────── */}
        <div>
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(27,74,90,0.15)", borderRadius: "100px",
            padding: "7px 18px", marginBottom: "20px",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="4.5" stroke="rgba(27,74,90,0.4)" strokeWidth="1.2" />
              <circle cx="6" cy="6" r="1.5" fill="rgba(27,74,90,0.4)" />
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
              color: "#1B4A5A", textTransform: "uppercase",
            }}>The Engines</span>
          </div>

          <div ref={headRef} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
            fontSize: "clamp(32px, 4.2vw, 62px)",
            color: "#1B4A5A", lineHeight: 1.0, letterSpacing: "-0.03em",
            marginBottom: "clamp(12px, 1.8vh, 20px)",
          }}>
            Built different,<br />
            <span style={{ color: "#7ECECA" }}>on purpose.</span>
          </div>

          <p ref={subRef} style={{
            fontFamily: "'Urbanist', sans-serif", fontWeight: 600,
            fontSize: "clamp(15px, 1.5vw, 20px)",
            color: "rgba(27,74,90,0.72)", lineHeight: 1.6,
            margin: 0, maxWidth: "600px",
          }}>
            Five engines that move your travel forward —<br />
            not pillars holding a brand up.
          </p>
        </div>

        {/* ── Engine list ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {ENGINES.map((e, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                display: "flex", alignItems: "flex-start", gap: "clamp(20px, 3vw, 40px)",
                padding: "clamp(18px, 2.2vh, 28px) 0",
                borderBottom: i < ENGINES.length - 1 ? "1px solid rgba(27,74,90,0.08)" : "none",
                opacity: 0,
              }}
            >
              {/* Number */}
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                fontSize: "clamp(12px, 1vw, 14px)", letterSpacing: "0.18em",
                color: "#7ECECA", flexShrink: 0, paddingTop: "3px",
                minWidth: "28px",
              }}>
                {e.num}
              </div>

              {/* Divider */}
              <div style={{
                width: "1px", alignSelf: "stretch",
                background: "rgba(27,74,90,0.1)", flexShrink: 0,
              }} />

              {/* Name + body */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                  fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.28em",
                  color: "#1B4A5A", textTransform: "uppercase", marginBottom: "8px",
                }}>
                  {e.name}
                </div>
                <div style={{
                  fontFamily: "'Urbanist', sans-serif", fontWeight: 600,
                  fontSize: "clamp(15px, 1.5vw, 19px)",
                  color: "rgba(27,74,90,0.80)", lineHeight: 1.6,
                }}>
                  {e.body}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
