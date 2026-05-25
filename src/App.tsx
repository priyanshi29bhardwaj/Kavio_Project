import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Preloader }        from "./components/Preloader";
import { HeroScene }        from "./components/HeroScene";
import { CloudTextSection } from "./components/CloudTextSection";
import { DemoSection }      from "./components/DemoSection";
import { ProblemSection }   from "./components/ProblemSection";
import { JoinWaitlistModal } from "./components/JoinWaitlistModal";
import { KaivoWordmark } from "./components/KaivoLogo";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ["About", "How It Works", "Pricing"] as const;

function App() {
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [navDark,         setNavDark]         = useState(false);
  const [shutterOpen,     setShutterOpen]     = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);

  // Lenis + GSAP ScrollTrigger integration
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

    const onScroll = ({ scroll }: { scroll: number }) => {
      setNavDark(scroll > window.innerHeight * 3.2);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    lenis.on("scroll", onScroll);

    return () => { lenis.destroy(); gsap.ticker.remove(rafFn); };
  }, [mobileMenuOpen]);

  const logoColor  = navDark ? "#1B4A5A" : "white";
  const linkColor  = navDark ? "#1B4A5A" : "rgba(255,255,255,0.80)";

  return (
    <div style={{ fontFamily: "'Urbanist', sans-serif", position: "relative", zIndex: 1 }}>
      {/* ─── Preloader ──────────────────────────────────────────────────────── */}
      <Preloader onComplete={() => setShutterOpen(true)} />

      {/* ─── Navigation ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          height: "68px",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          background: navDark ? "rgba(255,255,255,0.94)" : "transparent",
          backdropFilter: navDark ? "blur(14px)" : "none",
          borderBottom: navDark ? "1px solid rgba(27,74,90,0.08)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Logo — left */}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
          <KaivoWordmark height={22} color={logoColor} style={{ transition: "all 0.4s" }} />
        </div>

        {/* Nav links — absolutely centred on the full header width (desktop) */}
        <nav
          className="nav-desktop-links"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "36px",
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.04em",
            color: linkColor,
          }}
        >
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              style={{ color: "inherit", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.5")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side — CTA + hamburger */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Desktop CTA */}
          <button
            className="nav-cta-desktop"
            onClick={() => setIsModalOpen(true)}
            style={{
              background: "transparent",
              color: navDark ? "#1B4A5A" : "white",
              border: navDark ? "1.5px solid #1B4A5A" : "1.5px solid rgba(255,255,255,0.65)",
              padding: "9px 22px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "10px",
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.background = navDark ? "#1B4A5A" : "rgba(255,255,255,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Join Waitlist
          </button>

          {/* Hamburger (mobile only) */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "1.5px",
                  background: logoColor,
                  transition: "all 0.3s",
                  transformOrigin: "center",
                  transform:
                    mobileMenuOpen
                      ? i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)"
                      : i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)"
                      : "scaleX(0)"
                      : "none",
                  opacity: mobileMenuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* ─── Mobile full-screen menu ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 190,
            background: "rgba(4,6,12,0.96)",
            backdropFilter: "blur(18px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <KaivoWordmark height={32} color="white" />
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
            }}
          >
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); setIsModalOpen(true); }}
            style={{
              background: "white",
              color: "#1B4A5A",
              border: "none",
              padding: "14px 36px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Join Waitlist
          </button>
        </div>
      )}

      {/* ─── Global sky — fixed, drifts via translateX on an oversized element ── */}
      <div
        style={{
          position: "fixed",
          top: "-5%",
          left: "-8%",
          width: "116%",
          height: "110%",
          zIndex: 0,
          backgroundImage: "url(/clouds.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          animation: "skyDrift 30s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ─── Sky sections (transparent — global sky shows through) ─────────── */}
      <HeroScene onJoinWaitlist={() => setIsModalOpen(true)} shutterOpen={shutterOpen} />
      <CloudTextSection onJoinWaitlist={() => setIsModalOpen(true)} />

      {/* ─── Solid website (sky stops here) ─────────────────────────────────
          This wrapper sits above the fixed sky at z:2 with a solid background,
          so the clouds never bleed through anything below this point.        */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <DemoSection />
        <ProblemSection />

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#04060c",
          padding: "52px 40px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "22px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <KaivoWordmark height={20} color="rgba(255,255,255,0.75)" />

        <p
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.25)",
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
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          {["Privacy", "Terms", "Contact"].map((l, i, arr) => (
            <span key={l} style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>
              {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>·</span>}
            </span>
          ))}
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

      </div>{/* end solid-website wrapper */}

      {/* ─── Waitlist Modal ──────────────────────────────────────────────────── */}
      <JoinWaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
