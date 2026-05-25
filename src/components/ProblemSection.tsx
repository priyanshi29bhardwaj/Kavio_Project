import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Plane pointing right (flight path decoration) ────────────────────────────
function PlaneRight({ color = "#7ECECA", size = 17 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <g transform="rotate(90 12 12)">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </g>
    </svg>
  );
}

// ── Plane pointing up-right (takeoff, used in KAIVO row) ─────────────────────
function PlaneTakeoff({ color = "#C8E44A", size = 13 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

const rows = [
  { tool: "Search",               desc: "Browse and filter everything yourself.",            isKaivo: false },
  { tool: "Online Travel Agents", desc: "Compare endlessly, then book manually.",            isKaivo: false },
  { tool: "AI Chat",              desc: "Get answers — then start booking from scratch.",    isKaivo: false },
  { tool: "Kaivo",                desc: "Get matched, approve once, and move on.",           isKaivo: true  },
];

export function ProblemSection() {
  const sectionRef      = useRef<HTMLElement>(null);

  // flight path
  const lineContRef     = useRef<HTMLDivElement>(null);
  const lineRef         = useRef<HTMLDivElement>(null);
  const planeRef        = useRef<HTMLDivElement>(null);

  // left-column text
  const badgeRef        = useRef<HTMLDivElement>(null);
  const headlineInners  = useRef<(HTMLHeadingElement | null)[]>([]);  // h2s inside clip wrappers
  const dividerLineRef  = useRef<HTMLDivElement>(null);               // orange line
  const subheadRef      = useRef<HTMLSpanElement>(null);
  const bodyRef         = useRef<HTMLParagraphElement>(null);

  // table
  const rowRefs         = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Dashed flight-path + plane ───────────────────────────────────
      const cont  = lineContRef.current;
      const line  = lineRef.current;
      const plane = planeRef.current;

      if (cont && line && plane) {
        gsap.set(line,  { clipPath: "inset(0 100% 0 0)" });
        gsap.set(plane, { x: 0 });

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end:   "top 35%",
            scrub: 1,
          },
        })
          .to(line,  { clipPath: "inset(0 0% 0 0)", ease: "none" })
          .to(plane, { x: cont.offsetWidth - 20,    ease: "none" }, 0);
      }

      const trigger = { trigger: sectionRef.current, start: "top 65%" };

      // ── 2. Badge — simple fade-up ────────────────────────────────────────
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: trigger }
      );

      // ── 3. Headlines — clip reveal (text slides up from under hidden edge) ─
      //   Each h2 starts at y:110% inside an overflow:hidden wrapper → slides to y:0
      gsap.fromTo(
        headlineInners.current.filter(Boolean),
        { y: "110%" },
        {
          y: "0%",
          stagger: 0.09,
          duration: 0.85,
          ease: "power4.out",
          scrollTrigger: trigger,
        }
      );

      // ── 4. Orange divider line — draws in left→right ─────────────────────
      gsap.fromTo(
        dividerLineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1, duration: 0.55, ease: "power2.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 58%" },
        }
      );

      // ── 5. Sub-headline — fades up after the line ────────────────────────
      gsap.fromTo(
        subheadRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
        }
      );

      // ── 6. Body — blur-to-sharp reveal ───────────────────────────────────
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, filter: "blur(7px)", y: 18 },
        {
          opacity: 1, filter: "blur(0px)", y: 0,
          duration: 1.1, ease: "power2.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 88%" },
        }
      );

      // ── 7. Table rows — stagger in from right ───────────────────────────
      gsap.fromTo(
        rowRefs.current.filter(Boolean),
        { opacity: 0, x: 28 },
        {
          opacity: 1, x: 0,
          stagger: 0.13,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: rowRefs.current[0], start: "top 85%" },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        background: "white",
        padding: "120px 40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto", width: "100%" }}>

        {/* ── Animated flight path ──────────────────────────────────────────── */}
        <div
          ref={lineContRef}
          style={{ position: "relative", height: "32px", marginBottom: "56px" }}
        >
          <div
            ref={lineRef}
            style={{
              position: "absolute",
              top: "50%", left: 0, right: 0,
              height: 0,
              borderTop: "1.5px dashed #7ECECA",
              transform: "translateY(-50%)",
            }}
          />
          <div
            ref={planeRef}
            style={{
              position: "absolute",
              top: "50%", left: 0,
              transform: "translateY(-50%)",
              lineHeight: 0,
            }}
          >
            <PlaneRight color="#7ECECA" size={28} />
          </div>
        </div>

        {/* ── Two-column grid ───────────────────────────────────────────────── */}
        <div className="problem-grid">

          {/* ── Left: text ──────────────────────────────────────────────────── */}
          <div>

            {/* Badge */}
            <div
              ref={badgeRef}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "9px",
                letterSpacing: "0.44em",
                color: "#E8622A",
                textTransform: "uppercase",
                marginBottom: "34px",
              }}
            >
              The Problem
            </div>

            {/* Clip-reveal headlines — each h2 sits inside overflow:hidden */}
            {(["You were", "promised", "convenience."] as const).map((text, i) => (
              <div
                key={text}
                style={{
                  overflow: "hidden",
                  lineHeight: 1,
                  marginBottom: i < 2 ? "6px" : "0",
                }}
              >
                <h2
                  ref={(el) => { headlineInners.current[i] = el; }}
                  style={{
                    fontFamily: "'Urbanist', sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(46px, 5.5vw, 88px)",
                    color: i === 2 ? "#C8E44A" : "#1B4A5A",
                    lineHeight: 1.0,
                    margin: 0,
                    letterSpacing: "-0.025em",
                    display: "block",
                  }}
                >
                  {text}
                </h2>
              </div>
            ))}

            {/* Divider + sub-headline */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                margin: "36px 0 24px",
              }}
            >
              {/* Animated orange line */}
              <div
                ref={dividerLineRef}
                style={{ width: "36px", height: "1px", background: "#E8622A", flexShrink: 0 }}
              />
              {/* Animated sub-headline */}
              <span
                ref={subheadRef}
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(15px, 1.6vw, 22px)",
                  color: "#E8622A",
                  display: "block",
                }}
              >
                Instead, you got work.
              </span>
            </div>

            {/* Body — blur reveal */}
            <p
              ref={bodyRef}
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(13px, 1.3vw, 16px)",
                color: "rgba(27,74,90,0.55)",
                lineHeight: 1.85,
                margin: 0,
                maxWidth: "420px",
              }}
            >
              Tabs. Filters. Re-entering details. Comparing policies.
              Checking baggage rules. Wondering if there's a better option.
              <br /><br />
              Search gave access. Comparison sites multiplied decisions.
              AI sped up answers.{" "}
              <strong style={{ color: "#1B4A5A", fontWeight: 700 }}>
                But you still do the work.
              </strong>
            </p>
          </div>

          {/* ── Right: comparison card ──────────────────────────────────────── */}
          <div>
            <div
              style={{
                border: "1px solid rgba(27,74,90,0.1)",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {rows.map(({ tool, desc, isKaivo }, i) => (
                <div
                  key={tool}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px 26px",
                    background: isKaivo ? "#1B4A5A" : "white",
                    borderBottom: i < rows.length - 1 ? "1px solid rgba(27,74,90,0.07)" : "none",
                    gap: "20px",
                    minHeight: "68px",
                  }}
                >
                  {/* Tool name */}
                  <div
                    style={{
                      minWidth: "clamp(110px, 15vw, 175px)",
                      flexShrink: 0,
                      fontFamily: "'Urbanist', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(11px, 1.1vw, 13px)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: isKaivo ? "#C8E44A" : "#1B4A5A",
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    {isKaivo && <PlaneTakeoff color="#C8E44A" size={13} />}
                    {tool}
                  </div>

                  {/* Vertical divider */}
                  <div
                    style={{
                      width: "1px",
                      alignSelf: "stretch",
                      background: isKaivo
                        ? "rgba(200,228,74,0.2)"
                        : "rgba(27,74,90,0.08)",
                      flexShrink: 0,
                    }}
                  />

                  {/* Description */}
                  <div
                    style={{
                      fontFamily: "'Urbanist', sans-serif",
                      fontSize: "clamp(12px, 1.1vw, 14px)",
                      fontWeight: isKaivo ? 600 : 400,
                      color: isKaivo
                        ? "rgba(255,255,255,0.88)"
                        : "rgba(27,74,90,0.48)",
                      lineHeight: 1.5,
                    }}
                  >
                    {isKaivo ? (
                      <>
                        Get matched, approve once, and{" "}
                        <span style={{ color: "#C8E44A", fontWeight: 700 }}>
                          move on.
                        </span>
                      </>
                    ) : (
                      desc
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
