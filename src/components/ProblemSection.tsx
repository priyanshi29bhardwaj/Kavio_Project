import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  {
    tool: "Search",
    desc: "Browse and filter everything yourself.",
    isKaivo: false,
  },
  {
    tool: "Online Travel Agents",
    desc: "Compare endlessly, then book manually.",
    isKaivo: false,
  },
  {
    tool: "AI Chat",
    desc: "Get answers — then start booking from scratch.",
    isKaivo: false,
  },
  {
    tool: "KAIVO",
    desc: "Get matched, approve once, and move on.",
    isKaivo: true,
  },
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 56 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tableRef.current,
            start: "top 80%",
          },
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
        padding: "110px 24px 100px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "880px", margin: "0 auto", width: "100%" }}>
        {/* Label */}
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "9px",
            letterSpacing: "0.42em",
            color: "#E8622A",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}
        >
          The Problem
        </div>

        {/* Big headline */}
        <div ref={headlineRef}>
          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(52px, 8.5vw, 110px)",
              color: "#1B4A5A",
              lineHeight: 0.92,
              margin: "0 0 10px",
              letterSpacing: "-0.02em",
            }}
          >
            You were
          </h2>
          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(52px, 8.5vw, 110px)",
              color: "#1B4A5A",
              lineHeight: 0.92,
              margin: "0 0 10px",
              letterSpacing: "-0.02em",
            }}
          >
            promised
          </h2>
          <h2
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(52px, 8.5vw, 110px)",
              color: "#C8E44A",
              lineHeight: 0.92,
              margin: "0 0 48px",
              letterSpacing: "-0.02em",
            }}
          >
            convenience.
          </h2>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{ height: "1px", width: "52px", background: "#E8622A" }}
            />
            <h3
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(18px, 2.8vw, 32px)",
                color: "#E8622A",
                margin: 0,
              }}
            >
              Instead, you got work.
            </h3>
          </div>

          <p
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(14px, 1.7vw, 18px)",
              color: "rgba(27,74,90,0.6)",
              lineHeight: 1.75,
              marginBottom: "64px",
              maxWidth: "560px",
            }}
          >
            Tabs. Filters. Re-entering details. Comparing policies. Checking
            baggage rules. Wondering if there's a better option somewhere else.
            <br />
            <br />
            Search gave people access. Comparison sites multiplied decisions.
            AI sped up answers.
            <br />
            <strong style={{ color: "#1B4A5A" }}>
              But you still do the work.
            </strong>
          </p>
        </div>

        {/* Comparison table */}
        <div
          ref={tableRef}
          style={{
            border: "1px solid rgba(27,74,90,0.1)",
            overflow: "hidden",
          }}
        >
          {rows.map(({ tool, desc, isKaivo }, i) => (
            <div
              key={tool}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "22px 28px",
                background: isKaivo ? "#1B4A5A" : "white",
                borderBottom:
                  i < rows.length - 1
                    ? "1px solid rgba(27,74,90,0.08)"
                    : "none",
                gap: "28px",
              }}
            >
              {/* Tool name */}
              <div
                style={{
                  width: "clamp(140px, 22vw, 220px)",
                  flexShrink: 0,
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(14px, 1.6vw, 17px)",
                  color: isKaivo ? "#C8E44A" : "#1B4A5A",
                }}
              >
                {tool}
              </div>

              {/* Vertical divider */}
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: isKaivo
                    ? "rgba(200,228,74,0.25)"
                    : "rgba(27,74,90,0.12)",
                  flexShrink: 0,
                }}
              />

              {/* Description */}
              <div
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontSize: "clamp(13px, 1.4vw, 16px)",
                  fontWeight: isKaivo ? 500 : 400,
                  color: isKaivo ? "rgba(255,255,255,0.88)" : "rgba(27,74,90,0.55)",
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
    </section>
  );
}
