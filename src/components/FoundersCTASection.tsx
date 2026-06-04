import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onJoinWaitlist: () => void;
}

export function FoundersCTASection({ onJoinWaitlist }: Props) {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const word1Ref    = useRef<HTMLSpanElement>(null); // "Stop"
  const word2Ref    = useRef<HTMLSpanElement>(null); // "searching."
  const word3Ref    = useRef<HTMLSpanElement>(null); // "Start"
  const word4Ref    = useRef<HTMLSpanElement>(null); // "travelling."
  const ruleRef     = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const btnRef      = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
      });

      // Eyebrow fades in
      tl.fromTo(eyebrowRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )

      // Each word clips up from its overflow:hidden wrapper — line 1
      .fromTo([word1Ref.current, word2Ref.current],
        { yPercent: 105 },
        { yPercent: 0, duration: 0.85, ease: "power4.out", stagger: 0.09 },
        "-=0.1"
      )
      // Line 2 words follow with slight delay
      .fromTo([word3Ref.current, word4Ref.current],
        { yPercent: 105 },
        { yPercent: 0, duration: 0.85, ease: "power4.out", stagger: 0.09 },
        "-=0.6"
      )

      // Lemon-lime rule draws itself left → right
      .fromTo(ruleRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      )

      // Subtext fades up
      .fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.65"
      )

      // Button springs in
      .fromTo(btnRef.current,
        { opacity: 0, y: 16, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Helper: each word is wrapped in overflow:hidden so the clip looks sharp
  const Clip = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", ...style }}>
      {children}
    </span>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#ffffff",
        overflow: "hidden",
        padding: "clamp(64px, 14vh, 160px) clamp(20px, 5vw, 60px)",
        textAlign: "center",
        borderTop: "1px solid rgba(27,74,90,0.07)",
      }}
    >
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            border: "1.5px solid rgba(126,206,202,0.35)",
            borderRadius: "100px",
            padding: "7px 18px",
            marginBottom: "28px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 1.5L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5Z"
              stroke="rgba(126,206,202,0.75)" strokeWidth="1.1"
              fill="rgba(126,206,202,0.12)" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: "11px",
            letterSpacing: "0.30em", textTransform: "uppercase",
            color: "#7ECECA",
          }}>Early Access</span>
        </div>

        {/* Headline — word-by-word clip reveal */}
        <h2 style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(32px, 6.5vw, 86px)",
          lineHeight: 1.05,
          margin: "0 0 12px",
          letterSpacing: "-0.01em",
        }}>
          {/* Line 1 — dark teal */}
          <span style={{ display: "block" }}>
            <Clip>
              <span ref={word1Ref} style={{ display: "inline-block", color: "#1B4A5A" }}>Stop&nbsp;</span>
            </Clip>
            <Clip>
              <span ref={word2Ref} style={{ display: "inline-block", color: "#1B4A5A" }}>searching.</span>
            </Clip>
          </span>

          {/* Line 2 — lemon lime + sweet potato */}
          <span style={{ display: "block" }}>
            <Clip>
              <span ref={word3Ref} style={{ display: "inline-block", color: "#C8E44A" }}>Start&nbsp;</span>
            </Clip>
            <Clip>
              <span ref={word4Ref} style={{ display: "inline-block", color: "#C8E44A" }}>travelling.</span>
            </Clip>
          </span>
        </h2>

        {/* Animated lemon-lime rule */}
        <div
          ref={ruleRef}
          style={{
            width: "72px",
            height: "3px",
            background: "#C8E44A",
            margin: "24px auto 36px",
          }}
        />

        {/* Subtext */}
        <p
          ref={subRef}
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(16px, 1.7vw, 20px)",
            lineHeight: 1.72,
            color: "rgba(27,74,90,0.65)",
            maxWidth: "480px",
            margin: "0 auto 52px",
          }}
        >
          Join Kaivo's early founders list and help shape how modern travel gets delegated.
        </p>

        {/* CTA button */}
        <div ref={btnRef}>
          <button
            onClick={onJoinWaitlist}
            style={{
              background: "#1B4A5A",
              color: "white",
              border: "none",
              padding: "17px 52px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
              boxShadow: "0 4px 24px rgba(27,74,90,0.18)",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(-4px)";
              b.style.background = "#C8E44A";
              b.style.color = "#1B4A5A";
              b.style.boxShadow = "0 12px 40px rgba(200,228,74,0.40)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.transform = "translateY(0)";
              b.style.background = "#1B4A5A";
              b.style.color = "white";
              b.style.boxShadow = "0 4px 24px rgba(27,74,90,0.18)";
            }}
          >
            Join Waitlist
          </button>
        </div>

      </div>
    </section>
  );
}
