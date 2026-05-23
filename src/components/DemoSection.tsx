import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function DemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        screenRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px",
      }}
    >
      {/* Section heading */}
      <div ref={headingRef} style={{ textAlign: "center", marginBottom: "64px" }}>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "10px",
            letterSpacing: "0.35em",
            color: "#7ECECA",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          Frame 2 — Product Demo
        </div>
        <h2
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 5.5vw, 72px)",
            color: "#1B4A5A",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          From ask to booked
          <br />
          <span style={{ color: "#E8622A" }}>in 60 seconds.</span>
        </h2>
      </div>

      {/* Entertainment screen mockup */}
      <div
        ref={screenRef}
        style={{
          width: "min(740px, 92vw)",
          background: "linear-gradient(145deg, #2e1e10 0%, #4a3220 40%, #3a2818 100%)",
          borderRadius: "18px",
          padding: "22px 22px 28px",
          boxShadow:
            "0 50px 100px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,200,100,0.1), inset 0 1px 0 rgba(255,220,150,0.12)",
        }}
      >
        {/* Screen top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            padding: "0 4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(255,220,160,0.7)",
            }}
          >
            <svg viewBox="0 0 100 100" width="16" height="16" fill="none">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,220,160,0.7)" strokeWidth="3" />
              <circle cx="50" cy="50" r="27" stroke="rgba(255,220,160,0.7)" strokeWidth="2" />
              <polygon points="50,44 56,50 50,56 44,50" fill="rgba(255,220,160,0.7)" />
            </svg>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                fontWeight: 600,
              }}
            >
              KAIVO
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.18em",
              color: "rgba(255,220,160,0.5)",
            }}
          >
            From ask to booked in{" "}
            <span style={{ color: "#C8E44A" }}>60 seconds</span>
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.18em",
              color: "rgba(255,220,160,0.5)",
            }}
          >
            PRODUCT DEMO
          </span>
        </div>

        {/* The screen surface */}
        <div
          style={{
            background: "linear-gradient(160deg, #080f1e 0%, #101c34 55%, #080e1c 100%)",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Subtle glare on screen */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* Screen header bar */}
          <div
            style={{
              padding: "20px 28px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
              }}
            >
              KAIVO IS YOUR ALWAYS-ON TRAVEL AGENT
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "rgba(200,228,74,0.6)",
              }}
            >
              ● LIVE
            </span>
          </div>

          {/* Main screen content */}
          <div style={{ padding: "36px 28px 40px", minHeight: "320px" }}>
            {/* Big headline inside screen */}
            <h3
              style={{
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(22px, 3vw, 36px)",
                color: "white",
                lineHeight: 1.1,
                margin: "0 0 32px",
              }}
            >
              One Question.{" "}
              <span style={{ color: "#C8E44A" }}>Anywhere.</span>
            </h3>

            {/* Mock chat interface */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "520px",
              }}
            >
              {/* User message */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  You
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px 12px 12px 12px",
                    padding: "10px 14px",
                    fontFamily: "'Urbanist', sans-serif",
                    fontSize: "clamp(12px, 1.4vw, 15px)",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.5,
                  }}
                >
                  "Book me business class London to New York, next Monday."
                </div>
              </div>

              {/* KAIVO response */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  marginLeft: "8px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(126,206,202,0.15)",
                    border: "1px solid rgba(126,206,202,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 100 100" width="14" height="14" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="#7ECECA" strokeWidth="4" />
                    <polygon points="50,44 56,50 50,56 44,50" fill="#7ECECA" />
                  </svg>
                </div>
                <div
                  style={{
                    background: "rgba(126,206,202,0.08)",
                    border: "1px solid rgba(126,206,202,0.2)",
                    borderRadius: "12px 12px 12px 4px",
                    padding: "10px 14px",
                    fontFamily: "'Urbanist', sans-serif",
                    fontSize: "clamp(12px, 1.4vw, 15px)",
                    color: "#7ECECA",
                    lineHeight: 1.5,
                  }}
                >
                  Found 3 options.{" "}
                  <strong style={{ color: "white" }}>
                    British Airways BA117
                  </strong>{" "}
                  recommended — best price, direct, arrives 18:40.{" "}
                  <span style={{ color: "#C8E44A" }}>Approve to book?</span>
                </div>
              </div>

              {/* Approve button */}
              <div style={{ display: "flex", gap: "8px", marginLeft: "38px", marginTop: "4px" }}>
                <button
                  style={{
                    background: "#C8E44A",
                    color: "#1B4A5A",
                    border: "none",
                    padding: "8px 20px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  APPROVE & BOOK
                </button>
                <button
                  style={{
                    background: "transparent",
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "8px 16px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  SEE OPTIONS
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              padding: "14px 28px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              fontFamily: "'Urbanist', sans-serif",
              fontSize: "clamp(11px, 1.2vw, 14px)",
              color: "rgba(255,255,255,0.3)",
              textAlign: "center",
            }}
          >
            Travel booking becomes finally{" "}
            <span style={{ color: "#E8622A" }}>one-click.</span>
          </div>
        </div>
      </div>

      {/* Below screen: Stop doing / start delegating */}
      <div
        style={{
          marginTop: "64px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div style={{ height: "1px", width: "48px", background: "#1B4A5A" }} />
        <p
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 1.8vw, 18px)",
            color: "#1B4A5A",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          Stop doing.{" "}
          <span style={{ color: "#E8622A" }}>Start delegating.</span>
        </p>
        <div style={{ height: "1px", width: "48px", background: "#1B4A5A" }} />
      </div>
    </section>
  );
}
