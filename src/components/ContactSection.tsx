import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Contact entries ───────────────────────────────────────────────────────────
const CONTACTS = [
  {
    category: "Partnerships",
    code: "PAR",
    desc: "Airlines, rail, travel infrastructure, and ecosystem integrations.",
    email: "partner@kaivo.com",
    bAngle: -50,   // degrees from top, clockwise
    bR: 0.52,      // fraction of radar radius
  },
  {
    category: "Investors",
    code: "INV",
    desc: "Strategy, traction, and long-term company building.",
    email: "invest@kaivo.com",
    bAngle: 42,
    bR: 0.68,
  },
  {
    category: "Press & Media",
    code: "PRS",
    desc: "Interviews, features, and product storytelling.",
    email: "press@kaivo.com",
    bAngle: 130,
    bR: 0.48,
  },
  {
    category: "Careers",
    code: "CAR",
    desc: "Design, product, engineering, and operations.",
    email: "careers@kaivo.com",
    bAngle: -130,
    bR: 0.62,
  },
] as const;

// ── Radar constants ───────────────────────────────────────────────────────────
const CX = 160, CY = 160, MAX_R = 148;

function degToRad(d: number) { return (d - 90) * (Math.PI / 180); }
function blipXY(angle: number, r: number) {
  const rad = degToRad(angle);
  return { x: CX + MAX_R * r * Math.cos(rad), y: CY + MAX_R * r * Math.sin(rad) };
}

// ── Radar SVG ─────────────────────────────────────────────────────────────────
function RadarDisplay({ blipRefs }: { blipRefs: React.MutableRefObject<(SVGCircleElement | null)[]> }) {
  const sweepRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // continuous sweep rotation
    gsap.to(sweepRef.current, {
      rotation: 360,
      svgOrigin: `${CX} ${CY}`,
      duration: 5,
      repeat: -1,
      ease: "none",
    });

    // blip ping: each blip glows when sweep crosses its angle
    CONTACTS.forEach((c, i) => {
      const normalAngle = ((c.bAngle % 360) + 360) % 360; // 0-360 from top
      const delay = (normalAngle / 360) * 5;
      gsap.timeline({ repeat: -1, delay })
        .to(blipRefs.current[i], {
          attr: { r: 7, opacity: 1 },
          duration: 0.12, ease: "power2.out",
        })
        .to(blipRefs.current[i], {
          attr: { r: 3.5, opacity: 0.55 },
          duration: 4.5, ease: "power2.in",
        });
    });
  }, [blipRefs]);

  // tick marks every 30°
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180);
    const isMaj = i % 3 === 0;
    const inner = MAX_R - (isMaj ? 10 : 5);
    return {
      x1: CX + inner * Math.cos(a), y1: CY + inner * Math.sin(a),
      x2: CX + MAX_R * Math.cos(a), y2: CY + MAX_R * Math.sin(a),
      label: isMaj ? String(i * 30) : null,
      lx: CX + (MAX_R - 20) * Math.cos(a),
      ly: CY + (MAX_R - 20) * Math.sin(a),
      isMaj,
    };
  });

  return (
    <svg
      width={320} height={320}
      viewBox="0 0 320 320"
      style={{ overflow: "visible", filter: "drop-shadow(0 0 32px rgba(126,206,202,0.18))" }}
    >
      <defs>
        {/* Sweep fade gradient */}
        <radialGradient id="rg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#7ECECA" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7ECECA" stopOpacity="0" />
        </radialGradient>
        {/* Blip glow */}
        <filter id="blipGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Outer glow disk ── */}
      <circle cx={CX} cy={CY} r={MAX_R + 18}
        fill="rgba(126,206,202,0.025)" />

      {/* ── Range rings ── */}
      {[MAX_R * 0.33, MAX_R * 0.66, MAX_R].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r}
          fill="none"
          stroke={i === 2 ? "rgba(126,206,202,0.30)" : "rgba(126,206,202,0.12)"}
          strokeWidth={i === 2 ? 1.2 : 0.8}
          strokeDasharray={i === 2 ? "none" : "4 6"}
        />
      ))}

      {/* ── Cross-hairs ── */}
      <line x1={CX} y1={CY - MAX_R - 8} x2={CX} y2={CY + MAX_R + 8}
        stroke="rgba(126,206,202,0.10)" strokeWidth="0.8" />
      <line x1={CX - MAX_R - 8} y1={CY} x2={CX + MAX_R + 8} y2={CY}
        stroke="rgba(126,206,202,0.10)" strokeWidth="0.8" />

      {/* ── Diagonal faint lines ── */}
      {[45, 135].map(deg => {
        const r = (deg - 90) * Math.PI / 180;
        return <line key={deg}
          x1={CX - (MAX_R + 6) * Math.cos(r)} y1={CY - (MAX_R + 6) * Math.sin(r)}
          x2={CX + (MAX_R + 6) * Math.cos(r)} y2={CY + (MAX_R + 6) * Math.sin(r)}
          stroke="rgba(126,206,202,0.06)" strokeWidth="0.7" />;
      })}

      {/* ── Tick marks & degree labels ── */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.isMaj ? "rgba(126,206,202,0.45)" : "rgba(126,206,202,0.20)"}
            strokeWidth={t.isMaj ? 1.2 : 0.7} />
          {t.label && (
            <text x={t.lx} y={t.ly}
              textAnchor="middle" dominantBaseline="central"
              fontFamily="'Space Grotesk', sans-serif" fontSize="7" fontWeight="600"
              fill="rgba(126,206,202,0.45)"
            >{t.label}°</text>
          )}
        </g>
      ))}

      {/* ── Rotating sweep group ── */}
      <g ref={sweepRef}>
        {/* Trail fade lines (static offset angles = appear as sweep trail) */}
        {[
          { offset: 25, opacity: 0.04, w: 80 },
          { offset: 18, opacity: 0.08, w: 100 },
          { offset: 11, opacity: 0.14, w: 120 },
          { offset: 5,  opacity: 0.22, w: 140 },
        ].map(({ offset, opacity, w }) => {
          const a = (offset - 90) * Math.PI / 180;
          return (
            <line key={offset}
              x1={CX} y1={CY}
              x2={CX + w * Math.cos(a)} y2={CY + w * Math.sin(a)}
              stroke="#7ECECA" strokeWidth="1.5" opacity={opacity}
            />
          );
        })}
        {/* Main sweep line */}
        <line x1={CX} y1={CY} x2={CX} y2={CY - MAX_R}
          stroke="#7ECECA" strokeWidth="1.5" opacity="0.90"
          strokeLinecap="round" />
        {/* Sweep tip glow */}
        <circle cx={CX} cy={CY - MAX_R} r="3"
          fill="#7ECECA" opacity="0.7" filter="url(#blipGlow)" />
      </g>

      {/* ── Centre dot ── */}
      <circle cx={CX} cy={CY} r={6} fill="none"
        stroke="rgba(126,206,202,0.50)" strokeWidth="1.2" />
      <circle cx={CX} cy={CY} r={2.5} fill="#7ECECA" opacity="0.8" />

      {/* ── Blip dots ── */}
      {CONTACTS.map((c, i) => {
        const { x, y } = blipXY(c.bAngle, c.bR);
        return (
          <g key={i} filter="url(#blipGlow)">
            {/* Halo ring */}
            <circle cx={x} cy={y} r={8}
              fill="none" stroke="#7ECECA" strokeWidth="0.8" opacity={0.15} />
            {/* Blip dot */}
            <circle
              ref={(el) => { blipRefs.current[i] = el; }}
              cx={x} cy={y} r={3.5}
              fill="#7ECECA" opacity={0.55}
            />
            {/* IATA code label */}
            <text x={x + 10} y={y + 1}
              fontFamily="'Space Grotesk', sans-serif" fontSize="7.5" fontWeight="700"
              fill="rgba(126,206,202,0.80)" dominantBaseline="central"
            >{c.code}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Contact card ──────────────────────────────────────────────────────────────
function ContactCard({ category, code, desc, email, index }: {
  category: string; code: string; desc: string; email: string; index: number;
}) {
  const icons = ["⟷", "↗", "◎", "⌖"];
  return (
    <a
      href={`mailto:${email}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="contact-card"
        style={{
          background: "rgba(126,206,202,0.04)",
          border: "1px solid rgba(126,206,202,0.18)",
          borderRadius: "10px",
          padding: "22px 22px 20px",
          cursor: "pointer",
          transition: "background 0.25s ease, border-color 0.25s ease, transform 0.2s ease",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "rgba(126,206,202,0.09)";
          el.style.borderColor = "rgba(126,206,202,0.45)";
          el.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "rgba(126,206,202,0.04)";
          el.style.borderColor = "rgba(126,206,202,0.18)";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Top row: code badge + icon */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: "10px", letterSpacing: "0.30em",
            color: "#7ECECA", textTransform: "uppercase",
            background: "rgba(126,206,202,0.10)",
            border: "1px solid rgba(126,206,202,0.25)",
            borderRadius: "4px",
            padding: "3px 8px",
          }}>{code}</span>
          <span style={{ fontSize: "15px", opacity: 0.5 }}>{icons[index]}</span>
        </div>

        {/* Category */}
        <div style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800, fontSize: "clamp(15px, 1.4vw, 18px)",
          color: "white", marginBottom: "8px", letterSpacing: "-0.01em",
        }}>{category}</div>

        {/* Description */}
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 500, fontSize: "clamp(12px, 1.05vw, 14px)",
          color: "rgba(255,255,255,0.52)", lineHeight: 1.6,
          margin: "0 0 16px",
        }}>{desc}</p>

        {/* Email */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: "clamp(11px, 1vw, 13px)",
          color: "#C8E44A", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{ opacity: 0.6, fontSize: "11px" }}>→</span>
          {email}
        </div>
      </div>
    </a>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ContactSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const radarRef    = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const blipRefs    = useRef<(SVGCircleElement | null)[]>([]);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Scan line — continuous vertical sweep across section ─────────────
      gsap.to(scanLineRef.current, {
        y: "100vh",
        duration: 6,
        repeat: -1,
        ease: "none",
        yoyo: false,
      });

      // ── Entrance animations ───────────────────────────────────────────────
      gsap.set([badgeRef.current, headRef.current, subRef.current], { opacity: 0, y: 30 });
      gsap.set(radarRef.current, { opacity: 0, scale: 0.82, y: 20 });
      gsap.set(cardsRef.current, { opacity: 0, y: 36 });

      const tl = gsap.timeline({ paused: true });
      tl
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0)
        .to(headRef.current,  { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, 0.15)
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.7,  ease: "power2.out" }, 0.35)
        .to(radarRef.current, { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "back.out(1.4)" }, 0.45)
        .to(cardsRef.current, { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" }, 0.90);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
        onEnter: () => tl.play(),
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#04060c",
        overflow: "hidden",
        padding: "clamp(80px, 12vh, 140px) clamp(24px, 5vw, 80px) clamp(80px, 12vh, 120px)",
      }}
    >
      {/* ── Scan line overlay ─────────────────────────────────────────────── */}
      <div
        ref={scanLineRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(126,206,202,0.12) 30%, rgba(126,206,202,0.20) 50%, rgba(126,206,202,0.12) 70%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Background grid ───────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(126,206,202,0.04) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(126,206,202,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Corner brackets ───────────────────────────────────────────────── */}
      {[
        { top: 20, left: 20, rotate: 0 },
        { top: 20, right: 20, rotate: 90 },
        { bottom: 20, right: 20, rotate: 180 },
        { bottom: 20, left: 20, rotate: 270 },
      ].map(({ rotate, ...pos }, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none"
          aria-hidden
          style={{ position: "absolute", ...pos, transform: `rotate(${rotate}deg)`, opacity: 0.35, zIndex: 2 }}>
          <path d="M0 12V0H12" stroke="#7ECECA" strokeWidth="1.5" />
        </svg>
      ))}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 3, maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>

          {/* Badge */}
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(126,206,202,0.30)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "22px",
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <circle cx="5" cy="5" r="4" stroke="rgba(126,206,202,0.7)" strokeWidth="1.1"/>
              <circle cx="5" cy="5" r="1.5" fill="#7ECECA"/>
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
              color: "#7ECECA", textTransform: "uppercase",
            }}>Contact</span>
          </div>

          {/* Headline */}
          <div ref={headRef}>
            <h2 style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(38px, 6vw, 86px)",
              color: "white",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: "0 0 6px",
            }}>
              Let's{" "}
              <span style={{ color: "#7ECECA" }}>connect.</span>
            </h2>
          </div>

          {/* Sub */}
          <p ref={subRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 500, fontSize: "clamp(14px, 1.4vw, 18px)",
            color: "rgba(255,255,255,0.55)", lineHeight: 1.75,
            margin: "14px auto 0", maxWidth: "560px",
          }}>
            We're rebuilding how decisions get done, starting with travel.
            If you want to build, invest, partner, or tell this story with us,
            we'd love to hear from you.
          </p>
        </div>

        {/* ── Radar + Cards layout ───────────────────────────────────────── */}
        <div className="contact-layout" style={{
          display: "flex", alignItems: "center",
          gap: "clamp(32px, 5vw, 72px)",
          justifyContent: "center",
        }}>

          {/* ── Radar ──────────────────────────────────────────────────── */}
          <div ref={radarRef} className="contact-radar-wrap" style={{
            flexShrink: 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
          }}>
            <RadarDisplay blipRefs={blipRefs} />
            {/* Live indicator */}
            <div style={{
              display: "flex", alignItems: "center", gap: "7px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "9px", letterSpacing: "0.28em",
              color: "rgba(126,206,202,0.55)", textTransform: "uppercase",
            }}>
              <span style={{
                display: "inline-block", width: "6px", height: "6px", borderRadius: "50%",
                background: "#7ECECA",
                boxShadow: "0 0 6px #7ECECA",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
              Live · Kaivo HQ
            </div>
          </div>

          {/* ── Cards 2×2 grid ─────────────────────────────────────────── */}
          <div
            ref={cardsRef}
            className="contact-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(10px, 1.5vw, 16px)",
              flex: 1,
              maxWidth: "560px",
            }}
          >
            {CONTACTS.map((c, i) => (
              <ContactCard key={c.category} {...c} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Pulse keyframe ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @media (max-width: 760px) {
          .contact-layout { flex-direction: column !important; }
          .contact-cards  { grid-template-columns: 1fr !important; max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
