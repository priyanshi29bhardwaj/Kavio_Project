import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PlaneIcon } from "./PlaneIcon";

gsap.registerPlugin(ScrollTrigger);

// ── Per-engine line icons (24×24, single stroke) ──────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  // Delegation — hand it off / send away
  DELEGATION: (
    <>
      <path d="M5 15v3h14v-3" />
      <path d="M12 4v9" />
      <path d="M8 8l4-4 4 4" />
    </>
  ),
  // Trust — shield with check
  TRUST: (
    <>
      <path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  // Knowledge — compass
  KNOWLEDGE: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 4-4 2 2-4z" />
    </>
  ),
  // Conversation — chat bubble
  CONVERSATION: (
    <>
      <path d="M5 6h14v9h-8l-4 3v-3H5z" />
      <path d="M9 10.5h0M12 10.5h0M15 10.5h0" />
    </>
  ),
  // Personalisation — tune / sliders
  PERSONALISATION: (
    <>
      <path d="M4 8h16M4 16h16" />
      <circle cx="9" cy="8" r="2" />
      <circle cx="15" cy="16" r="2" />
    </>
  ),
};

const ENGINES = [
  { num: "01", name: "DELEGATION",      body: "Hand it over. Kaivo does the searching, comparing and booking, so you don't have to." },
  { num: "02", name: "TRUST",           body: "The best price we can find, shown with its reasoning. Nothing hidden, nothing pushed." },
  { num: "03", name: "KNOWLEDGE",       body: "Kaivo knows when to book, how fares move, and when waiting beats buying." },
  { num: "04", name: "CONVERSATION",    body: "Talk or type, like messaging a friend. No filters, no forms, no twelve open tabs." },
  { num: "05", name: "PERSONALISATION", body: "The more you use it, the better it gets. Kaivo adapts to how you travel." },
] as const;

// ── Spinning jet-turbine graphic for the feature card ─────────────────────
function Turbine({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ display: "block" }}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(126,206,202,0.30)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(126,206,202,0.18)" strokeWidth="1" />
      <g className="turbine-blades" style={{ transformOrigin: "50px 50px" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M50 50 L45 14 Q50 11 55 14 Z"
            fill="rgba(126,206,202,0.55)"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="#7ECECA" />
      <circle cx="50" cy="50" r="3.5" fill="#163C49" />
    </svg>
  );
}

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
        const endX = () => cont.offsetWidth - (plane.offsetWidth || 48);
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
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 30 });

      const tl = gsap.timeline({ paused: true });
      tl
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0)
        .to(headRef.current,  { opacity: 1, y: 0, duration: 0.7,  ease: "power3.out" }, 0.12)
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.28)
        .to(cardRefs.current.filter(Boolean), { opacity: 1, y: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" }, 0.42);

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
          <PlaneIcon size={48} color="#7ECECA" />
        </div>
      </div>

      <style>{`
        .engine-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 1.6vw, 20px);
          width: 100%;
        }
        @media (max-width: 940px) { .engine-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .engine-grid { grid-template-columns: 1fr; } }

        .engine-card {
          position: relative;
          overflow: hidden;
          background: #FBFDFD;
          border: 1px solid rgba(27,74,90,0.10);
          border-radius: 20px;
          padding: clamp(22px, 2.4vw, 30px);
          min-height: 230px;
          display: flex;
          flex-direction: column;
          transition: transform .38s cubic-bezier(.2,.7,.2,1),
                      box-shadow .38s ease, border-color .38s ease;
        }
        .engine-card:hover {
          transform: translateY(-6px);
          border-color: rgba(126,206,202,0.65);
          box-shadow: 0 22px 46px -22px rgba(27,74,90,0.30);
        }
        .engine-ghost {
          position: absolute; right: 14px; bottom: -18px;
          font-family: 'Space Grotesk', sans-serif; font-weight: 800;
          font-size: 116px; line-height: 1; letter-spacing: -0.04em;
          color: rgba(27,74,90,0.045);
          pointer-events: none; transition: color .38s ease;
        }
        .engine-card:hover .engine-ghost { color: rgba(126,206,202,0.14); }
        .engine-accent {
          height: 3px; width: 36px; border-radius: 3px;
          background: #7ECECA; margin-top: auto;
          transition: width .42s cubic-bezier(.2,.7,.2,1);
        }
        .engine-card:hover .engine-accent { width: 100%; }
        .engine-icon-chip {
          width: 46px; height: 46px; border-radius: 13px;
          background: rgba(126,206,202,0.16);
          display: flex; align-items: center; justify-content: center;
          transition: background .38s ease;
        }
        .engine-card:hover .engine-icon-chip { background: rgba(126,206,202,0.30); }

        .turbine-blades { animation: turbine-spin 14s linear infinite; }
        .engine-feature:hover .turbine-blades { animation-duration: 3s; }
        @keyframes turbine-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:      "1120px",
        width:         "100%",
        padding:       "clamp(28px, 4vh, 48px) clamp(20px, 4vw, 60px) 0",
        position:      "relative",
        zIndex:        1,
        display:       "flex",
        flexDirection: "column",
        gap:           "clamp(28px, 4vh, 48px)",
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

        {/* ── Engine card grid ─────────────────────────────────────────── */}
        <div className="engine-grid">
          {ENGINES.map((e, i) => (
            <div
              key={e.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="engine-card"
            >
              <span className="engine-ghost">{e.num}</span>

              {/* Icon + number row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
                <div className="engine-icon-chip">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#1B4A5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[e.name]}
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                  fontSize: "12px", letterSpacing: "0.16em", color: "#7ECECA",
                }}>{e.num}</span>
              </div>

              {/* Name */}
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                fontSize: "13px", letterSpacing: "0.22em",
                color: "#1B4A5A", textTransform: "uppercase", marginBottom: "12px",
                position: "relative",
              }}>
                {e.name}
              </div>

              {/* Body */}
              <div style={{
                fontFamily: "'Urbanist', sans-serif", fontWeight: 600,
                fontSize: "clamp(15px, 1.4vw, 17px)",
                color: "rgba(27,74,90,0.78)", lineHeight: 1.55,
                marginBottom: "22px", position: "relative",
              }}>
                {e.body}
              </div>

              <div className="engine-accent" />
            </div>
          ))}

          {/* ── Feature card — the engine itself ──────────────────────── */}
          <div
            ref={(el) => { cardRefs.current[ENGINES.length] = el; }}
            className="engine-card engine-feature"
            style={{
              background: "#163C49",
              border: "1px solid rgba(126,206,202,0.18)",
              alignItems: "center", justifyContent: "center", textAlign: "center",
            }}
          >
            {/* soft glow */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at 50% 42%, rgba(126,206,202,0.18) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", marginBottom: "18px" }}>
              <Turbine size={130} />
            </div>
            <div style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
              fontSize: "clamp(20px, 2vw, 26px)", color: "white",
              lineHeight: 1.1, letterSpacing: "-0.02em", position: "relative",
            }}>
              Engineered<br />
              <span style={{ color: "#7ECECA" }}>to deliver.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
