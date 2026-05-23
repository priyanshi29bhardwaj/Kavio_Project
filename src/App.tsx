import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Preloader } from "./components/Preloader";
import { HeroScene } from "./components/HeroScene";
import { CloudTextSection } from "./components/CloudTextSection";
import { DemoSection } from "./components/DemoSection";
import { ProblemSection } from "./components/ProblemSection";
import { JoinWaitlistModal } from "./components/JoinWaitlistModal";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navDark, setNavDark] = useState(false);
  const [shutterOpen, setShutterOpen] = useState(false);

  // Lenis + GSAP ScrollTrigger official integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // Switch nav colour when hero pin ends
    const onScroll = ({ scroll }: { scroll: number }) => {
      setNavDark(scroll > window.innerHeight * 3.2);
    };
    lenis.on("scroll", onScroll);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Urbanist', sans-serif", position: "relative", zIndex: 1 }}>
      {/* ─── Preloader ─── */}
      <Preloader onComplete={() => setShutterOpen(true)} />

      {/* ─── Fixed transparent nav ─── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 40px",
          background: navDark
            ? "rgba(255,255,255,0.92)"
            : "transparent",
          backdropFilter: navDark ? "blur(12px)" : "none",
          borderBottom: navDark ? "1px solid rgba(27,74,90,0.08)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: navDark ? "#1B4A5A" : "white",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="26"
            height="26"
            fill="none"
            style={{ transition: "all 0.4s" }}
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={navDark ? "#1B4A5A" : "white"}
              strokeWidth="2.2"
            />
            <circle
              cx="50"
              cy="50"
              r="27"
              stroke={navDark ? "#1B4A5A" : "white"}
              strokeWidth="1.5"
            />
            <polygon
              points="50,37 63,50 50,63 37,50"
              fill={navDark ? "rgba(27,74,90,0.15)" : "rgba(255,255,255,0.18)"}
              stroke={navDark ? "#1B4A5A" : "white"}
              strokeWidth="1.5"
            />
            <polygon
              points="50,44 56,50 50,56 44,50"
              fill={navDark ? "#1B4A5A" : "white"}
            />
          </svg>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: "0.32em",
            }}
          >
            KAIVO
          </span>
        </div>

        {/* Nav links (desktop) */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.06em",
            color: navDark ? "#1B4A5A" : "rgba(255,255,255,0.72)",
          }}
        >
          {["About", "How It Works", "Pricing"].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.opacity = "0.6")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.opacity = "1")
              }
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: navDark ? "#1B4A5A" : "rgba(255,255,255,0.12)",
            color: navDark ? "white" : "white",
            border: navDark
              ? "1px solid #1B4A5A"
              : "1px solid rgba(255,255,255,0.32)",
            padding: "10px 22px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.35s ease",
          }}
        >
          Join Waitlist
        </button>
      </header>

      {/* ─── Global sky — fixed behind every section ─── */}
      {/* HeroScene and CloudTextSection both reveal this same layer,
          so the transition between them is physically seamless */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url(/clouds.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          animation: "skyDrift 28s ease-in-out infinite",
        }}
      />

      {/* ─── Hero — full-screen GSAP pinned window scene ─── */}
      <HeroScene
        onJoinWaitlist={() => setIsModalOpen(true)}
        shutterOpen={shutterOpen}
      />

      {/* ─── Cloud Text — revealed after hero zoom ─── */}
      <CloudTextSection onJoinWaitlist={() => setIsModalOpen(true)} />

      {/* ─── Demo Section ─── */}
      <DemoSection />

      {/* ─── Problem Section ─── */}
      <ProblemSection />

      {/* ─── Footer ─── */}
      <footer
        style={{
          background: "#04060c",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "white",
          }}
        >
          <svg viewBox="0 0 100 100" width="22" height="22" fill="none">
            <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2" />
            <circle cx="50" cy="50" r="27" stroke="white" strokeWidth="1.4" />
            <polygon
              points="50,37 63,50 50,63 37,50"
              fill="rgba(255,255,255,0.15)"
              stroke="white"
              strokeWidth="1.4"
            />
            <polygon points="50,44 56,50 50,56 44,50" fill="white" />
          </svg>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "0.34em",
            }}
          >
            KAIVO
          </span>
        </div>

        <p
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Stop Doing. Start Delegating.
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Privacy
          </a>
          <span>·</span>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Terms
          </a>
          <span>·</span>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Contact
          </a>
        </div>

        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "10px",
            color: "rgba(255,255,255,0.14)",
            margin: 0,
            letterSpacing: "0.1em",
          }}
        >
          © {new Date().getFullYear()} Kaivo Travel Inc. All rights reserved.
        </p>
      </footer>

      {/* ─── Waitlist Modal ─── */}
      <JoinWaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
