import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = ["Intent", "Prepare", "Review", "Approve", "Done"] as const;

// ── Clock constants ────────────────────────────────────────────────────────────
const S  = 136;           // SVG size
const cx = 68, cy = 68;   // centre
const R  = 60;            // ring radius
const ARC_R = 55;         // arc slightly inside the ring
const ARC_CIRC = +(2 * Math.PI * ARC_R).toFixed(2); // ≈ 345.58
const HAND = R - 15;      // second-hand length

// ── Tick marks: 60 ticks, major every 5 ──────────────────────────────────────
const ticks = Array.from({ length: 60 }, (_, i) => {
  const ang   = (i * 6 - 90) * (Math.PI / 180);
  const isMaj = i % 5 === 0;
  const inner = R - (isMaj ? 10 : 5);
  return {
    x1: cx + inner * Math.cos(ang), y1: cy + inner * Math.sin(ang),
    x2: cx + R     * Math.cos(ang), y2: cy + R     * Math.sin(ang),
    isMaj,
  };
});

// ── Plane pointing right ──────────────────────────────────────────────────────
function PlaneRight({ color = "#1B4A5A", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <g transform="rotate(90 12 12)">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </g>
    </svg>
  );
}

export function ShiftSection() {
  const sectionRef    = useRef<HTMLElement>(null);

  // transition strip
  const wipeLineRef   = useRef<HTMLDivElement>(null);
  const wipePlaneRef  = useRef<HTMLDivElement>(null);

  // headline
  const badgeRef      = useRef<HTMLDivElement>(null);
  const head0         = useRef<HTMLDivElement>(null);
  const head1         = useRef<HTMLDivElement>(null);
  const underlineRef  = useRef<HTMLDivElement>(null);

  // body + tagline
  const bodyRef       = useRef<HTMLParagraphElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);

  // clock
  const clockWrapRef  = useRef<HTMLDivElement>(null);
  const arcRef        = useRef<SVGCircleElement>(null);   // progress arc
  const handGroupRef  = useRef<SVGGElement>(null);        // rotating hand
  const clockSecRef   = useRef<SVGTextElement>(null);     // 0→60 counter

  // steps
  const stepsRowRef   = useRef<HTMLDivElement>(null);
  const wordRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const connRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs     = useRef<(SVGPolygonElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Transition strip ─────────────────────────────────────────────────
      const stripW = (wipeLineRef.current?.parentElement?.offsetWidth ?? window.innerWidth);
      gsap.set(wipeLineRef.current,  { scaleX: 0, transformOrigin: "left center" });
      gsap.set(wipePlaneRef.current, { x: 0 });
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          end:   "top 50%",
          scrub: 1,
        },
      })
        .to(wipeLineRef.current,  { scaleX: 1, ease: "none" })
        .to(wipePlaneRef.current, { x: stripW - 28, ease: "none" }, 0);

      // ── Text + content entrance — single timeline, fires once ────────────
      gsap.set(badgeRef.current,     { opacity: 0, y: 14 });
      gsap.set([head0.current, head1.current], { y: "105%" });
      gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(bodyRef.current,      { opacity: 0, filter: "blur(8px)", y: 20 });
      gsap.set(clockWrapRef.current, { opacity: 0, scale: 0.72, y: 24 });
      gsap.set(stepsRowRef.current,  { opacity: 0, y: 24 });
      gsap.set(taglineRef.current,   { opacity: 0, y: 20 });

      const entryTl = gsap.timeline({ paused: true });
      entryTl
        .to(badgeRef.current,     { opacity: 1, y: 0,         duration: 0.5,  ease: "power2.out" }, 0)
        .to(head0.current,        { y: "0%",                  duration: 0.9,  ease: "power4.out" }, 0.15)
        .to(head1.current,        { y: "0%",                  duration: 0.9,  ease: "power4.out" }, 0.32)
        .to(underlineRef.current, { scaleX: 1,                duration: 0.75, ease: "power2.inOut" }, 0.72)
        .to(bodyRef.current,      { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.7, ease: "power2.out" }, 0.60)
        .to(clockWrapRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: "back.out(1.6)" }, 0.75)
        .to(stepsRowRef.current,  { opacity: 1, y: 0,         duration: 0.65, ease: "power2.out" }, 0.90)
        .to(taglineRef.current,   { opacity: 1, y: 0,         duration: 0.6,  ease: "power2.out" }, 1.08);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 82%",
        once:    true,
        onEnter: () => entryTl.play(),
      });

      // ── MASTER LOOP — clock arc + hand + counter + word highlights ────────
      const tl = gsap.timeline({ repeat: -1, paused: true });

      // Progress arc: strokeDashoffset from full → 0 (draws clockwise)
      tl.fromTo(arcRef.current,
        { strokeDashoffset: ARC_CIRC },
        { strokeDashoffset: 0, duration: 5, ease: "none" },
        0
      );

      // Hand: full 360° in 5 s — svgOrigin pins rotation to clock centre
      tl.to(handGroupRef.current, {
        rotation: 360,
        svgOrigin: `${cx} ${cy}`,
        duration: 5,
        ease: "none",
      }, 0);

      // Counter: 0 → 60
      const counter = { value: 0 };
      tl.to(counter, {
        value: 60, duration: 5, ease: "none",
        onUpdate() {
          if (clockSecRef.current) {
            clockSecRef.current.textContent = String(Math.round(counter.value));
          }
        },
      }, 0);

      // Word highlights — 1 s each
      STEPS.forEach((_, i) => {
        const t = i;

        // Step box → join-waitlist yellow highlight
        tl.to(wordRefs.current[i], {
          backgroundColor: "#E8E840",
          borderColor: "#E8E840",
          color: "#1B4A5A",
          scale: 1.1,
          boxShadow: "0 4px 20px rgba(232,232,64,0.50)",
          duration: 0.12, ease: "power2.out",
        }, t);

        // Connector + arrowhead → animate to black
        if (i < STEPS.length - 1 && connRefs.current[i]) {
          tl.fromTo(connRefs.current[i],
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.55, ease: "power2.inOut" },
            t + 0.18
          );
          // Arrowhead fills black as line draws in
          tl.to(arrowRefs.current[i],
            { attr: { fill: "#000000" }, duration: 0.18, ease: "power2.out" },
            t + 0.18
          );
        }

        // Reset step box
        tl.to(wordRefs.current[i], {
          backgroundColor: "transparent",
          borderColor: "rgba(27,74,90,0.28)",
          color: "#1B4A5A",
          scale: 1,
          boxShadow: "none",
          duration: 0.14, ease: "power2.in",
        }, t + 0.85);

        // Reset arrowhead
        if (i < STEPS.length - 1) {
          tl.to(arrowRefs.current[i],
            { attr: { fill: "rgba(27,74,90,0.30)" }, duration: 0.14, ease: "power2.in" },
            t + 0.83
          );
        }
      });

      tl.set(connRefs.current.filter(Boolean), { scaleX: 0 });
      tl.set(arrowRefs.current.filter(Boolean), { attr: { fill: "rgba(27,74,90,0.30)" } });

      // Master loop fires when the section is visible — tied to section, not steps row
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 60%",
        end:     "bottom 15%",
        onEnter:     () => tl.play(0),
        onLeave:     () => tl.pause(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.pause(),
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "white", position: "relative", overflow: "hidden" }}>

      {/* ── Transition strip ─────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        height: "56px",
        background: "white",
        borderTop: "1px solid rgba(27,74,90,0.06)",
        overflow: "hidden",
      }}>
        <div ref={wipeLineRef} style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 0,
          borderTop: "1.5px dashed #1B4A5A",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }} />
        <div ref={wipePlaneRef} style={{
          position: "absolute", top: "50%", left: 0,
          transform: "translateY(-50%)",
          lineHeight: 0, zIndex: 2,
        }}>
          <PlaneRight color="#1B4A5A" size={20} />
        </div>
      </div>

      {/* ── Background watermark "04" ────────────────────────────────────────── */}
      <div aria-hidden style={{
        position: "absolute",
        right: "-1%", top: "50%",
        transform: "translateY(-46%)",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 900,
        fontSize: "clamp(160px, 22vw, 340px)",
        color: "rgba(27,74,90,0.028)",
        lineHeight: 1,
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "-0.05em",
      }}>
        04
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(36px, 5vh, 60px) clamp(20px, 5vw, 60px) clamp(44px, 6vh, 72px)",
        position: "relative",
      }}>

        {/* Subtle aqua bloom */}
        <div aria-hidden style={{
          position: "absolute", top: "38%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "72vw", height: "72vw", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(126,206,202,0.07) 0%, transparent 62%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "900px", width: "100%", textAlign: "center", position: "relative" }}>

          {/* ── Badge ──────────────────────────────────────────────────────────── */}
          <div ref={badgeRef} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(27,74,90,0.15)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "14px", opacity: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1.5 6H10.5M7.5 3L10.5 6L7.5 9"
                stroke="rgba(27,74,90,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: "11px", letterSpacing: "0.30em",
              color: "#1B4A5A", textTransform: "uppercase",
            }}>The Shift</span>
          </div>

          {/* ── Headline — clip reveal ──────────────────────────────────────────── */}
          <div style={{ overflow: "hidden", lineHeight: 1, marginBottom: "4px" }}>
            <div ref={head0} style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
              fontSize: "clamp(32px, 4.6vw, 68px)",
              color: "#1B4A5A",
              lineHeight: 1.0, letterSpacing: "-0.028em",
            }}>
              The next interface
            </div>
          </div>
          <div style={{ overflow: "hidden", lineHeight: 1 }}>
            <div ref={head1} style={{
              fontFamily: "'Urbanist', sans-serif", fontWeight: 900,
              fontSize: "clamp(32px, 4.6vw, 68px)",
              color: "#7ECECA",
              lineHeight: 1.0, letterSpacing: "-0.028em",
            }}>
              isn't search. It's delegation.
            </div>
          </div>

          {/* ── Animated gradient underline under headline ───────────────────── */}
          <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 0" }}>
            <div ref={underlineRef} style={{
              width: "clamp(48px, 7vw, 96px)",
              height: "3px",
              background: "linear-gradient(90deg, #C8E44A 0%, #7ECECA 100%)",
              borderRadius: "2px",
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }} />
          </div>

          {/* ── Body — blur reveal ─────────────────────────────────────────────── */}
          <p ref={bodyRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 800, fontSize: "clamp(14px, 1.3vw, 17px)",
            color: "rgba(27,74,90,0.90)", lineHeight: 1.75,
            margin: "14px auto 0", maxWidth: "520px", opacity: 0,
          }}>
            You tell Kaivo what you need. It finds, compares, and prepares the best option.
            You review it. You approve it.{" "}
            <strong style={{
              color: "#1B4A5A", fontWeight: 800,
              background: "linear-gradient(120deg, rgba(232,232,64,0.38) 0%, rgba(232,232,64,0.38) 100%)",
              padding: "2px 7px",
              borderRadius: "3px",
            }}>
              In 60 seconds — it's done.
            </strong>
          </p>

          {/* ── Clock ──────────────────────────────────────────────────────────── */}
          <div ref={clockWrapRef} style={{
            display: "flex", justifyContent: "center",
            margin: "18px 0 10px", opacity: 0,
            filter: "drop-shadow(0 8px 32px rgba(27,74,90,0.08))",
          }}>
            <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: "visible" }}>

              {/* Subtle face fill */}
              <circle cx={cx} cy={cy} r={R}
                fill="rgba(27,74,90,0.025)" />

              {/* Outer ring */}
              <circle cx={cx} cy={cy} r={R}
                fill="none" stroke="rgba(27,74,90,0.13)" strokeWidth="1.5" />

              {/* Progress arc — drawn by GSAP, clockwise from 12 */}
              <circle
                ref={arcRef}
                cx={cx} cy={cy} r={ARC_R}
                fill="none"
                stroke="#C8E44A"
                strokeWidth="2.5"
                strokeDasharray={`${ARC_CIRC}`}
                strokeDashoffset={`${ARC_CIRC}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                opacity={0.55}
              />

              {/* Tick marks */}
              {ticks.map((tk, i) => (
                <line key={i}
                  x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
                  stroke={tk.isMaj ? "rgba(27,74,90,0.36)" : "rgba(27,74,90,0.09)"}
                  strokeWidth={tk.isMaj ? 1.5 : 0.8}
                />
              ))}

              {/* Hour labels at 12, 3, 6, 9 */}
              {([
                { label: "12", x: cx,          y: cy - R + 14 },
                { label: "3",  x: cx + R - 14, y: cy + 4      },
                { label: "6",  x: cx,          y: cy + R - 9  },
                { label: "9",  x: cx - R + 14, y: cy + 4      },
              ] as const).map(({ label, x, y }) => (
                <text key={label} x={x} y={y}
                  textAnchor="middle"
                  fontFamily="'Space Grotesk', sans-serif"
                  fontSize="8" fontWeight="600"
                  fill="rgba(27,74,90,0.32)"
                >
                  {label}
                </text>
              ))}

              {/* Decorative static minute hand (pointing ~12:10) */}
              <g transform={`translate(${cx}, ${cy}) rotate(12)`}>
                <line x1={0} y1={6} x2={0} y2={-(HAND - 6)}
                  stroke="rgba(27,74,90,0.22)" strokeWidth={2} strokeLinecap="round" />
              </g>

              {/* Decorative static hour hand (pointing ~10:00) */}
              <g transform={`translate(${cx}, ${cy}) rotate(-60)`}>
                <line x1={0} y1={5} x2={0} y2={-(HAND - 22)}
                  stroke="rgba(27,74,90,0.22)" strokeWidth={3} strokeLinecap="round" />
              </g>

              {/* Seconds counter (lower half, clear of hands) */}
              <text ref={clockSecRef}
                x={cx} y={cy + 22}
                textAnchor="middle"
                fontFamily="'Space Grotesk', sans-serif"
                fontSize="18" fontWeight="800"
                fill="rgba(27,74,90,0.75)"
              >
                0
              </text>
              <text x={cx} y={cy + 30}
                textAnchor="middle"
                fontFamily="'Space Grotesk', sans-serif"
                fontSize="5" letterSpacing="0.18em"
                fill="rgba(27,74,90,0.20)"
              >
                SEC
              </text>

              {/* Rotating second-hand group (origin = clock centre) */}
              <g ref={handGroupRef} transform={`translate(${cx}, ${cy})`}>
                {/* Tail */}
                <line x1={0} y1={10} x2={0} y2={0}
                  stroke="#C8E44A" strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
                {/* Shaft */}
                <line x1={0} y1={0} x2={0} y2={-HAND}
                  stroke="#C8E44A" strokeWidth={1.8} strokeLinecap="round" />
                {/* Glow overlay */}
                <line x1={0} y1={6} x2={0} y2={-HAND}
                  stroke="#C8E44A" strokeWidth={7} strokeLinecap="round" opacity={0.07} />
              </g>

              {/* Centre ring + dot */}
              <circle cx={cx} cy={cy} r={5.5}
                fill="white" stroke="rgba(27,74,90,0.18)" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r={2.5} fill="#1B4A5A" />
            </svg>
          </div>

          {/* ── Steps row ──────────────────────────────────────────────────────── */}
          <div ref={stepsRowRef} className="shift-steps-row" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            flexWrap: "wrap", rowGap: "10px",
            opacity: 0,
          }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <span
                  ref={(el) => { wordRefs.current[i] = el; }}
                  className="shift-step-box"
                  style={{
                    display: "inline-block",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(9px, 1.1vw, 13px)",
                    letterSpacing: "0.11em",
                    textTransform: "uppercase",
                    color: "#1B4A5A",
                    padding: "7px 13px",
                    border: "1.5px solid rgba(27,74,90,0.28)",
                    borderRadius: "3px",
                    whiteSpace: "nowrap",
                    backgroundColor: "transparent",
                  }}
                >
                  {step}
                </span>

                {i < STEPS.length - 1 && (
                  <div className="shift-connector" style={{
                    position: "relative",
                    width: "clamp(32px, 3.8vw, 58px)",
                    height: "24px",
                    flexShrink: 0,
                  }}>
                    {/* Background track */}
                    <div style={{
                      position: "absolute",
                      left: 0, right: 16,
                      top: "50%", marginTop: "-1.5px",
                      height: "3px",
                      background: "rgba(27,74,90,0.13)",
                      borderRadius: "2px",
                    }} />
                    {/* GSAP-animated fill — turns black during animation */}
                    <div
                      ref={(el) => { connRefs.current[i] = el; }}
                      style={{
                        position: "absolute",
                        left: 0, right: 16,
                        top: "50%", marginTop: "-1.5px",
                        height: "3px",
                        background: "#000000",
                        transform: "scaleX(0)",
                        transformOrigin: "left center",
                        borderRadius: "2px",
                      }}
                    />
                    {/* Solid filled arrowhead — animates to black via GSAP */}
                    <svg
                      style={{
                        position: "absolute",
                        right: 0, top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      width="16" height="14" viewBox="0 0 16 14"
                      aria-hidden
                    >
                      <polygon
                        ref={(el) => { arrowRefs.current[i] = el; }}
                        points="0,0 16,7 0,14"
                        fill="rgba(27,74,90,0.30)"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Tagline ─────────────────────────────────────────────────────────── */}
          <div ref={taglineRef} style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(15px, 1.6vw, 22px)",
            color: "#1B4A5A",
            letterSpacing: "0.01em",
            marginTop: "24px",
            opacity: 0,
          }}>
            Kaivo does the work.{" "}
            <span style={{
              color: "#1B4A5A", fontWeight: 800,
              position: "relative",
              display: "inline-block",
            }}>
              You do the deciding.
              {/* Yellow chalk underline */}
              <span aria-hidden style={{
                position: "absolute",
                bottom: "-2px", left: 0, right: 0,
                height: "6px",
                background: "#F0E040",
                opacity: 0.45,
                borderRadius: "2px",
                zIndex: -1,
              }} />
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
