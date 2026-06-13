import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Preloader }        from "./components/Preloader";
import { NewHeroSection }   from "./components/NewHeroSection";
import { SkyAboutSection }  from "./components/SkyAboutSection";
import { FleetSection }     from "./components/FleetSection";
import { DemoSection }      from "./components/DemoSection";
import { ProblemSection }   from "./components/ProblemSection";
import { ShiftSection }     from "./components/ShiftSection";
import { ProductSection }        from "./components/ProductSection";
import { ConversationalSection } from "./components/ConversationalSection";
import { TrustSection }          from "./components/TrustSection";
import { WhyLoveSection }        from "./components/WhyLoveSection";
import { PurposeSection }        from "./components/PurposeSection";
import { BusinessModelSection }  from "./components/BusinessModelSection";
import { DelegationSection }     from "./components/DelegationSection";
import { TeamSection }           from "./components/TeamSection";
import { FoundersCTASection }   from "./components/FoundersCTASection";
import { ContactSection }       from "./components/ContactSection";
import { JoinWaitlistModal } from "./components/JoinWaitlistModal";
import { KaivoWordmark } from "./components/KaivoLogo";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// dev-only escape hatch for debugging scroll animations from the console
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__ScrollTrigger = ScrollTrigger;
}

const NAV_LINKS = [
  { label: "Home",    action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  { label: "Waitlist", action: null }, // handled by setIsModalOpen — injected at render
  { label: "About",   action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Contact", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
] as const;

function App() {
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [navDark,         setNavDark]         = useState(false);
  const [navVisible,      setNavVisible]      = useState(false);
  const [shutterOpen,     setShutterOpen]     = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);

  // Lenis smooth scroll + GSAP ScrollTrigger. Lenis drives the REAL scroll
  // position (default mode), so native position:sticky stays perfectly in sync
  // — the earlier "stucky" feel was actually overflow-x:hidden breaking sticky
  // (now `clip`), not Lenis. This effect runs once and uses functional state
  // updates so Lenis is never torn down/recreated mid-scroll.
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const updateNav = (scroll: number) => {
      setNavVisible(scroll > 80);
      setNavDark(scroll > window.innerHeight * 9.2);
      setMobileMenuOpen((v) => (v ? false : v));
    };

    // Touch/mobile: native scroll (Lenis can fight iOS momentum)
    if (isTouchDevice) {
      const onScroll = () => updateNav(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", ({ scroll }: { scroll: number }) => updateNav(scroll));
    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);
    };
  }, []);

  // Show navbar only after scrolling past the hero pin (~220% vh)

  const logoColor  = navDark ? "#1B4A5A" : "white";
  const linkColor  = navDark ? "#1B4A5A" : "rgba(255,255,255,0.80)";

  return (
    <div className="app-root" style={{ fontFamily: "'Urbanist', sans-serif", position: "relative", zIndex: 1 }}>
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
          opacity: navVisible ? 1 : 0,
          pointerEvents: navVisible ? "auto" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease, opacity 0.6s ease",
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
          {NAV_LINKS.map(({ label, action }) => (
            <button
              key={label}
              onClick={action ?? (() => setIsModalOpen(true))}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "inherit", fontFamily: "inherit",
                fontWeight: "inherit", fontSize: "inherit",
                letterSpacing: "inherit", padding: 0,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {label}
            </button>
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
              if (navDark) btn.style.color = "white";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "transparent";
              btn.style.color = navDark ? "#1B4A5A" : "white";
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
            {NAV_LINKS.map(({ label, action }) => (
              <button
                key={label}
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(false);
                  (action ?? (() => setIsModalOpen(true)))();
                }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Urbanist', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.85)",
                  padding: 0,
                }}
              >
                {label}
              </button>
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

      {/* ─── Frame 1: cabin-window zoom-through hero ───────────────────────── */}
      <NewHeroSection shutterOpen={shutterOpen} onJoinWaitlist={() => setIsModalOpen(true)} />

      {/* ─── Frame 2: sky descent + about overlap parallax ─────────────────── */}
      <SkyAboutSection onJoinWaitlist={() => setIsModalOpen(true)} />

      {/* ─── Frame 3: fleet blueprint scanning wipe ────────────────────────── */}
      <FleetSection />

      {/* ─── Solid website (sky stops here) ─────────────────────────────────
          This wrapper sits above the fixed sky at z:2 with a solid background,
          so the clouds never bleed through anything below this point.        */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <DemoSection />
        <div id="about" />
        <ProblemSection />
        <ShiftSection />
        <ProductSection />
        <ConversationalSection />
        <TrustSection />
        <WhyLoveSection />
        <PurposeSection />
        <BusinessModelSection />
        <DelegationSection />
        <TeamSection />
        <FoundersCTASection onJoinWaitlist={() => setIsModalOpen(true)} />
        <div id="contact" />
        <ContactSection />

      {/* ─── Contact / Footer divider ───────────────────────────────────────── */}
      <div
        style={{
          background: "#04060c",
          display: "flex",
          alignItems: "center",
          padding: "0",
          gap: 0,
        }}
      >
        {/* Left line */}
        <div style={{ flex: 1, height: "1px", background: "rgba(126,206,202,0.18)" }} />

        {/* Plane icon */}
        <svg
          width="22" height="22"
          viewBox="0 0 24 24"
          fill="#7ECECA"
          style={{ margin: "0 16px", opacity: 0.7, flexShrink: 0 }}
          aria-hidden
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>

        {/* Right line */}
        <div style={{ flex: 1, height: "1px", background: "rgba(126,206,202,0.18)" }} />
      </div>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="app-footer"
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
          className="footer-tagline"
          style={{
            fontFamily: "'Urbanist', sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.72)",
            textTransform: "uppercase",
            margin: 0,
            textAlign: "center",
          }}
        >
          Stop Doing. Start Delegating.
        </p>

        <div
          className="footer-links"
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
          {[
            { label: "Home",     action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
            { label: "Waitlist", action: () => setIsModalOpen(true) },
            { label: "About",    action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Contact",  action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
          ].map(({ label, action }, i, arr) => (
            <span key={label} style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <button
                onClick={action}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "inherit", fontFamily: "inherit",
                  fontSize: "inherit", letterSpacing: "inherit",
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {label}
              </button>
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
