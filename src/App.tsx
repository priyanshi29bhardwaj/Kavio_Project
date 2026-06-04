import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Preloader }        from "./components/Preloader";
import { HeroScene }        from "./components/HeroScene";
import { CloudTextSection } from "./components/CloudTextSection";
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

  // Fixed sky video — replaces clouds.png; provides the golden-sunset background
  // for HeroScene (the oval shows the HeroScene video on top) and for
  // CloudTextSection (transparent bg, this fixed video shows through).
  // DemoSection and below live in z-index 2 and cover this entirely.
  const skyVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const vid = skyVideoRef.current;
    if (!vid) return;
    // Park at frame 3 but do NOT play yet — playback starts when the shutter opens
    // (see shutterOpen effect below) so both sky videos start in sync.
    const park = () => { vid.currentTime = 3; };
    // Loop manually from frame 3 (loop attr restarts at frame 0)
    const onEnded = () => { vid.currentTime = 3; vid.play().catch(() => {}); };
    vid.addEventListener("ended", onEnded);
    if (vid.readyState >= 1) park();
    else vid.addEventListener("loadedmetadata", park, { once: true });
    return () => vid.removeEventListener("ended", onEnded);
  }, []);

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
      setNavVisible(scroll > 80);
      setNavDark(scroll > window.innerHeight * 3.2);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    lenis.on("scroll", onScroll);

    // Browser-zoom guard: when viewport height changes (Ctrl+±), the pin range
    // (end: "+=220%") shrinks while scroll position stays put, so the same
    // pixels of scroll suddenly map to 80 %+ progress — making the cabin vanish.
    // Fix: if we're still within the hero pin range, snap instantly to 0.
    const onResize = () => {
      if (lenis.scroll < window.innerHeight * 2.4) {
        lenis.scrollTo(0, { immediate: true });
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileMenuOpen]);

  // When shutter opens: start the fixed sky video in sync with the hero sky video
  // (both parked at frame 3, both start playing here → zero frame-desync during crossfade)
  useEffect(() => {
    if (!shutterOpen) return;
    skyVideoRef.current?.play().catch(() => {});
  }, [shutterOpen]);

  // Show navbar only after scrolling past the hero pin (~220% vh)

  const logoColor  = navDark ? "#1B4A5A" : "white";
  const linkColor  = navDark ? "#1B4A5A" : "rgba(255,255,255,0.80)";

  return (
    <div className="app-root" style={{ fontFamily: "'Urbanist', sans-serif", position: "relative", zIndex: 1 }}>
      {/* ─── Cinematic film grain ───────────────────────────────────────────── */}
      <div className="film-grain" />
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

      {/* ─── Fixed golden-sky video — same file as the hero oval video.
           z-index 0 sits behind HeroScene (z-index 1), so the oval in cabin.png
           shows the HeroScene video (foreground), not this one.  CloudTextSection
           has a transparent background, so this fixed video shows through there,
           giving a seamless golden sky from hero → cloud-text section.
           DemoSection+ are in the z-index 2 wrapper and cover this completely. */}
      <video
        ref={skyVideoRef}
        muted
        playsInline
        preload="auto"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "50% 50%",
          zIndex: 0,
          willChange: "transform",
        }}
      >
        <source src="/window_behind_flipped.mp4" type="video/mp4" />
      </video>

      {/* ─── Sky sections ────────────────────────────────────────────────────── */}
      <HeroScene onJoinWaitlist={() => setIsModalOpen(true)} shutterOpen={shutterOpen} />
      <CloudTextSection onJoinWaitlist={() => setIsModalOpen(true)} />

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
