import { useRef, useEffect, useState, type CSSProperties } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  animate,
} from "framer-motion";

export interface FlightMovementProps {
  exteriorJetSrc?: string;
  structureSrc?: string;
  nextSectionImageSrc?: string;
  brand?: string;
  navLinks?: string[];
  phone?: string;
  email?: string;
  scrollLengthVh?: number;
  className?: string;
}

const ink = "#26221d";
const inkSoft = "#6f675c";
const cream = "#efe9df";
const creamLo = "#e4dccf";
const DISPLAY = '"Saira","Archivo",system-ui,sans-serif';
const BODY = '"Inter",system-ui,sans-serif';

const PLANE_H_VH = 110;
const PLANE_ASPECT = 440 / 480;
const PLANE_W_VH = PLANE_H_VH * PLANE_ASPECT;
const PLANE_W_VW_CAP = 88;

/* ------------------------------------------------------------------ */
/*  Breakpoint hook                                                     */
/* ------------------------------------------------------------------ */

type Breakpoint = "desktop" | "tablet" | "mobile";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return bp;
}

export default function FlightMovement(props: FlightMovementProps) {
  const {
    exteriorJetSrc,
    structureSrc,
    nextSectionImageSrc,
    scrollLengthVh = 8,
    className,
  } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted ? prefersReduced : false;

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const isCompact = isMobile || isTablet;

  /*
   * SCROLL LENGTH FIX
   * -----------------
   * On mobile the default scroll track (scrollLengthVh × 100vh) is physically
   * shorter in pixels than on desktop, so the user blows through all the flight
   * animations before they can see them. We extend the track on smaller screens
   * so the sticky stage pins for longer and every animation phase plays fully.
   *
   * Desktop : use the prop value as-is (no change)
   * Tablet  : at least 12 × 100vh
   * Mobile  : at least 16 × 100vh
   *
   * The prop still wins if it's already larger than the floor value.
   */
 const effectiveScrollLength = isMobile
  ? Math.max(scrollLengthVh, 5)   // just enough to see animations, not forever
  : isTablet
    ? Math.max(scrollLengthVh, 6)
    : scrollLengthVh;

  /* ---- Scroll progress ---- */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.4 });

  const LOCK_AT    = 0.40;
  const WIPE_START = 0.42;
  const WIPE_END   = 0.65;

  const LOCKED_TY = (100 - PLANE_H_VH) / 2;

  /* ---- Plane transform ---- */
  const planeTYRaw = useTransform(
    p,
    [0,    0.10, 0.22,  LOCK_AT,   1],
    reduce
      ? [LOCKED_TY, LOCKED_TY, LOCKED_TY, LOCKED_TY, LOCKED_TY]
      : [78,        -55,       -55,        LOCKED_TY, LOCKED_TY]
  );

  const planeScaleRaw = useTransform(
    p,
    [0,    0.10, 0.22,  LOCK_AT, 1],
    reduce ? [1, 1, 1, 1, 1] : [1.1, 2.0, 2.0, 1.0, 1.0]
  );

  /* ---- Intro fly-in ---- */
  const OFFSCREEN_VH = 140;
  const introY = useMotionValue(reduce ? 0 : OFFSCREEN_VH);
  useEffect(() => {
    if (reduce) return;
    const c = animate(introY, 0, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [reduce, introY]);

  const planeY = useTransform(() => `${planeTYRaw.get() + introY.get()}vh`);

  /* ---- WIPE clip-paths ---- */
  const extBottom = useTransform(p, [WIPE_START, WIPE_END], [0,   100]);
  const strTop    = useTransform(p, [WIPE_START, WIPE_END], [100, 0  ]);
  const extClip   = useMotionTemplate`inset(0% 0% ${extBottom}% 0%)`;
  const strClip   = useMotionTemplate`inset(${strTop}% 0% 0% 0%)`;

  /* ---- Text opacity / motion ---- */
  const heroTextOpacity = useTransform(p, [0, 0.06, 0.18, 0.28], [1, 1, 0, 0]);
  const heroTextY       = useTransform(p, [0, 0.28], reduce ? [0, 0] : [0, -24]);
  const specTextOpacity = useTransform(p, [LOCK_AT, WIPE_START + 0.04, 1], [0, 1, 1]);

  /* ---- Background gradient ---- */
  const bgTop = useTransform(p, [0, 0.20, LOCK_AT], ["#c87941", "#d4916a", cream]);
  const bgMid = useTransform(p, [0, 0.20, LOCK_AT], ["#a85e2a", "#c47a4a", "#e8dfd0"]);
  const bgBot = useTransform(p, [0, 0.20, LOCK_AT], ["#7a3a12", "#b06838", creamLo]);
  const bg    = useMotionTemplate`linear-gradient(180deg, ${bgTop} 0%, ${bgMid} 50%, ${bgBot} 100%)`;

  const heroTextColor = useTransform(p, [0, 0.20], ["#f5ede3", ink]);

  /* ---- Plane container CSS sizing ---- */
  const planeWidthCss  = `min(${PLANE_W_VH}vh, ${PLANE_W_VW_CAP}vw)`;
  const planeHeightCss = `min(${PLANE_H_VH}vh, ${PLANE_W_VW_CAP / PLANE_ASPECT}vw)`;

  const planeContainerStyle = {
    position: "absolute" as const,
    top: 0,
    left: "50%",
    width: planeWidthCss,
    height: planeHeightCss,
    x: "-50%",
    y: planeY,
    scale: planeScaleRaw,
    transformOrigin: "50% 0%",
    willChange: "transform",
  };

  /* ---- Responsive values ---- */
  const sideColWidth = isMobile
    ? "100%"
    : isTablet
      ? "clamp(100px, 7vw, 160px)"
      : "clamp(200px, 28%, 360px)";

  const sideColPadding = isMobile
    ? "clamp(16px, 4vw, 24px)"
    : isTablet
      ? "clamp(8px, 1.5vw, 16px)"
      : "clamp(20px, 2.8vw, 44px)";

  const megaSize = isMobile
    ? "clamp(28px, 8vw, 42px)"
    : isTablet
      ? "clamp(18px, 3.5vw, 36px)"
      : "clamp(36px, 5.5vw, 104px)";

  const specMegaSize = isMobile
    ? "clamp(30px, 9vw, 46px)"
    : isTablet
      ? "clamp(20px, 4vw, 40px)"
      : "clamp(44px, 6vw, 108px)";

  const mobileTextStripStyle: CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 clamp(16px,5vw,28px)",
    pointerEvents: "none",
  };

  const stageStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    color: ink,
    fontFamily: BODY,
    isolation: "isolate",
  };

  const tabletSideBase: CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: sideColWidth,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    pointerEvents: "none",
  };

  return (
    <div className={className} style={{ position: "relative", color: ink, fontFamily: BODY }}>

      {/* ── scroll track: effectiveScrollLength keeps mobile pinned long enough ── */}
      <div ref={trackRef} style={{ height: `${effectiveScrollLength * 100}vh`, position: "relative" }}>
        <motion.div style={{ ...stageStyle, background: bg }}>

          {/* ============ PLANE LAYERS ============ */}

          {/* Layer 1 — STRUCTURE (revealed by wipe from below) */}
          <motion.div style={{ ...planeContainerStyle, zIndex: 10, clipPath: strClip }}>
            {structureSrc ? (
              <img src={structureSrc} alt="" style={imgFill} />
            ) : (
              <StructureFallback />
            )}
          </motion.div>

          {/* Layer 2 — EXTERIOR JET (wiped away) */}
          <motion.div style={{ ...planeContainerStyle, zIndex: 11, clipPath: extClip }}>
            {exteriorJetSrc ? (
              <img src={exteriorJetSrc} alt="Aircraft" style={imgFill} />
            ) : (
              <ExteriorFallback />
            )}
          </motion.div>

          {/* ============ TEXT OVERLAYS ============ */}

          {isMobile ? (
            /* ---------- MOBILE: bottom strip ---------- */
            <>
              <motion.div style={{ ...overlay, zIndex: 20, opacity: heroTextOpacity, y: heroTextY }}>
                <motion.div style={{ ...mobileTextStripStyle }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <motion.h1 style={{ ...mega, fontSize: megaSize, margin: 0, color: heroTextColor, lineHeight: 0.9 }}>
                      Fly in
                    </motion.h1>
                    <motion.p style={{ ...heroSub, color: heroTextColor, opacity: 0.75, fontSize: "clamp(11px, 3.2vw, 14px)", marginTop: 8 }}>
                      Luxury<br />that moves<br />with you
                    </motion.p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
                    <motion.h1 style={{ ...mega, fontSize: megaSize, margin: 0, color: heroTextColor, lineHeight: 0.9 }}>
                      Luxury
                    </motion.h1>
                    <motion.p style={{ ...heroSub, color: heroTextColor, opacity: 0.75, fontSize: "clamp(11px, 3.2vw, 14px)", marginTop: 8 }}>
                      G650ER<br />Twin Rolls-Royce
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div style={{ ...overlay, zIndex: 20, opacity: specTextOpacity }}>
                <div style={{ ...mobileTextStripStyle }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ ...eyebrow, fontSize: "clamp(10px, 3vw, 13px)", marginBottom: 4 }}>
                      Gulfstream
                    </span>
                    <div style={{ ...mega, fontSize: specMegaSize, lineHeight: 0.9 }}>650ER</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
                    <h2 style={{ ...rightHead, fontSize: "clamp(14px, 4.5vw, 22px)", margin: 0, lineHeight: 1.1 }}>
                      Ultra-long-range<br />Aircraft
                    </h2>
                    <MobileSpecPills />
                  </div>
                </div>
              </motion.div>
            </>
          ) : isTablet ? (
            /* ---------- TABLET ---------- */
            <>
              <motion.div style={{ ...overlay, zIndex: 20, opacity: heroTextOpacity, y: heroTextY }}>
                <motion.div style={{ ...tabletSideBase, left: 0, paddingLeft: sideColPadding, paddingRight: "6px", alignItems: "flex-start", color: heroTextColor }}>
                  <motion.h1 style={{ ...mega, fontSize: megaSize, margin: 0, color: "inherit" }}>
                    Fly in
                  </motion.h1>
                  <motion.p style={{ ...heroSub, color: "inherit", opacity: 0.75, fontSize: "clamp(10px, 1.6vw, 13px)", marginTop: "clamp(6px, 1vh, 12px)" }}>
                    Luxury<br />that moves<br />with you
                  </motion.p>
                </motion.div>

                <motion.div style={{ ...tabletSideBase, right: 0, paddingRight: sideColPadding, paddingLeft: "6px", alignItems: "flex-end", textAlign: "right", color: heroTextColor }}>
                  <motion.h1 style={{ ...mega, fontSize: megaSize, margin: 0, color: "inherit" }}>
                    Luxury
                  </motion.h1>
                  <div style={{ marginTop: "clamp(12px, 2vh, 28px)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                      <span style={{ ...label, color: "inherit", opacity: 0.6, fontSize: "8px" }}>GULFSTREAM</span>
                      <span style={{ ...label, color: "inherit", opacity: 0.6, fontSize: "8px" }}>650ER</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div style={{ ...overlay, zIndex: 20, opacity: specTextOpacity }}>
                <div style={{ ...tabletSideBase, left: 0, paddingLeft: sideColPadding, paddingRight: "6px", alignItems: "flex-start" }}>
                  <span style={{ ...eyebrow, fontSize: "clamp(11px, 1.8vw, 16px)", marginBottom: 4 }}>
                    Gulfstream
                  </span>
                  <div style={{ ...mega, fontSize: specMegaSize }}>650ER</div>
                  <div style={{ marginTop: "clamp(16px, 2.5vh, 32px)" }}>
                    <TabletSpecList />
                  </div>
                </div>
                <div style={{ ...tabletSideBase, right: 0, paddingRight: sideColPadding, paddingLeft: "6px", alignItems: "flex-end", textAlign: "right" }}>
                  <h2 style={{ ...rightHead, fontSize: "clamp(14px, 2.8vw, 26px)", margin: 0 }}>
                    Ultra-long-range<br />Aircraft
                  </h2>
                  <span style={{ ...label, marginTop: "clamp(16px, 2.5vh, 36px)", fontSize: "8px" }}>
                    Direct access to<br />private travel
                  </span>
                </div>
              </motion.div>
            </>
          ) : (
            /* ---------- DESKTOP: original layout unchanged ---------- */
            <>
              <motion.div style={{ ...overlay, zIndex: 20, opacity: heroTextOpacity, y: heroTextY }}>
                <motion.div style={{
                  position: "absolute", top: 0, bottom: 0, left: 0,
                  width: sideColWidth, display: "flex", flexDirection: "column",
                  justifyContent: "center", paddingLeft: sideColPadding,
                  alignItems: "flex-start", color: heroTextColor,
                }}>
                  <h1 style={{ ...mega, fontSize: megaSize }}>Fly in</h1>
                  <p style={{ ...heroSub, color: "inherit", opacity: 0.75, fontSize: "clamp(14px, 1.5vw, 18px)" }}>
                    Luxury<br />that moves<br />with you
                  </p>
                </motion.div>

                <motion.div style={{
                  position: "absolute", top: 0, bottom: 0, right: 0,
                  width: sideColWidth, display: "flex", flexDirection: "column",
                  justifyContent: "center", paddingRight: sideColPadding,
                  alignItems: "flex-end", textAlign: "right", color: heroTextColor,
                }}>
                  <h1 style={{ ...mega, fontSize: megaSize }}>Luxury</h1>
                  <div style={{ marginTop: "clamp(24px, 3vh, 40px)", maxWidth: 320 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ ...label, color: "inherit", opacity: 0.6 }}>GULFSTREAM</span>
                      <span style={{ ...label, color: "inherit", opacity: 0.6 }}>650ER</span>
                    </div>
                    <p style={{ ...small, color: "inherit", opacity: 0.65, marginTop: 8 }}>
                      Wings designed to minimise drag, powered by twin
                      Rolls-Royce engines for exceptional range and top-end speed.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div style={{ ...overlay, zIndex: 20, opacity: specTextOpacity }}>
                <div style={{
                  position: "absolute", top: 0, bottom: 0, left: 0,
                  width: sideColWidth, display: "flex", flexDirection: "column",
                  justifyContent: "center", paddingLeft: sideColPadding, alignItems: "flex-start",
                }}>
                  <span style={{ ...eyebrow, marginBottom: 6, fontSize: "clamp(16px, 1.8vw, 22px)" }}>
                    Gulfstream
                  </span>
                  <div style={{ ...mega, fontSize: specMegaSize }}>650ER</div>
                  <div style={{ marginTop: "clamp(24px, 3.5vh, 48px)" }}>
                    <SpecGrid />
                  </div>
                </div>
                <div style={{
                  position: "absolute", top: 0, bottom: 0, right: 0,
                  width: sideColWidth, display: "flex", flexDirection: "column",
                  justifyContent: "center", paddingRight: sideColPadding,
                  alignItems: "flex-end", textAlign: "right",
                }}>
                  <h2 style={{ ...rightHead, fontSize: "clamp(20px, 2.8vw, 42px)" }}>
                    Ultra-long-range<br />Aircraft
                  </h2>
                  <span style={{ ...label, marginTop: "clamp(24px, 3.5vh, 48px)" }}>
                    Direct access to<br />private travel
                  </span>
                  <p style={{ ...small, marginTop: 18, maxWidth: 280 }}>
                    A true time-saving machine —
                    it brings Tokyo and New York an hour closer, and at 92% of the speed of
                    sound it can circle the globe with a single stop.
                  </p>
                </div>
              </motion.div>
            </>
          )}

        </motion.div>
      </div>

      <NextSection imageSrc={nextSectionImageSrc} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile spec pills                                                  */
/* ------------------------------------------------------------------ */

function MobileSpecPills() {
  const specs: [string, string][] = [
    ["11,263 km", "Range"],
    ["14 hrs",    "Endurance"],
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
      {specs.map(([val, key]) => (
        <div key={key} style={{ background: `${ink}18`, borderRadius: 6, padding: "4px 8px", textAlign: "center" }}>
          <div style={{ fontSize: "clamp(11px, 3.2vw, 14px)", fontWeight: 700, color: ink, lineHeight: 1.1 }}>{val}</div>
          <div style={{ fontSize: "clamp(8px, 2.2vw, 10px)", letterSpacing: "0.08em", textTransform: "uppercase", color: inkSoft, marginTop: 1 }}>{key}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tablet spec list                                                   */
/* ------------------------------------------------------------------ */

function TabletSpecList() {
  const rows: [string, string][] = [
    ["Range",    "11,263 km"],
    ["Speed",    "480 kts"],
    ["Seats",    "Up to 12"],
    ["Duration", "14 hrs"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px, 1.2vh, 12px)" }}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <div style={{ ...label, fontSize: "7.5px", marginBottom: 2 }}>{k}</div>
          <div style={{ fontSize: "clamp(10px, 1.4vw, 12px)", fontWeight: 700, color: ink }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop spec grid                                                  */
/* ------------------------------------------------------------------ */

function SpecGrid() {
  const rows: [string, string][] = [
    ["Maximum operating range", "11,263 km"], ["Speed", "480 knots"],
    ["Passenger capacity", "Up to 12 seats"], ["Endurance", "14 hrs"],
    ["Baggage capacity", "5.52 m³"],          ["Cruising altitude", "15,544 m"],
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "clamp(12px, 2vh, 20px) clamp(16px, 2.5vw, 38px)",
      maxWidth: 420,
    }}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <div style={{ ...label, marginBottom: 4 }}>{k}</div>
          <div style={{ fontSize: "clamp(11px, 1.1vw, 13px)", fontWeight: 600 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Next Section                                                       */
/* ------------------------------------------------------------------ */

function NextSection({ imageSrc }: { imageSrc?: string }) {
  return (
    <section style={{
      position: "relative",
      background: creamLo,
      color: ink,
      fontFamily: BODY,
      padding: "clamp(48px, 8vw, 80px) clamp(20px, 2.8vw, 44px)",
      marginTop: 0,
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
        gap: "clamp(28px, 4vw, 56px)",
        alignItems: "center",
        maxWidth: 1240,
        margin: "0 auto",
      }}>
        <div>
          <div style={{ ...label, marginBottom: 18 }}>A Better Way to Fly</div>
          <div style={{ borderTop: `1px solid ${inkSoft}55`, paddingTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(20px, 2.2vw, 28px)", margin: 0 }}>Pets</h3>
              <span style={{ fontSize: 22, color: inkSoft }}>–</span>
            </div>
            <p style={{ ...small, marginTop: 18, maxWidth: 420 }}>
              Traveling with pets on a private jet means comfort and peace of mind for
              both owners and their companions. Our dedicated team ensures seamless
              arrangements, from documentation and safety to onboard care, so that your
              pet enjoys the same level of attention and luxury as you do.
            </p>
          </div>
        </div>
        <div style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "4 / 3", background: "#cfc6b6" }}>
          {imageSrc ? (
            <img src={imageSrc} alt="Cabin interior" style={imgFill} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: inkSoft, fontSize: 13 }}>
              Cabin interior image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG Fallbacks                                                      */
/* ------------------------------------------------------------------ */

function ExteriorFallback() {
  return (
    <svg viewBox="0 0 440 480" style={imgFill} preserveAspectRatio="xMidYMin meet">
      <defs>
        <linearGradient id="fz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a9854e" /><stop offset="0.5" stopColor="#ecd2a2" /><stop offset="1" stopColor="#9c7b46" />
        </linearGradient>
        <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#caae7e" /><stop offset="0.5" stopColor="#cdb184" /><stop offset="1" stopColor="#a3855a" />
        </linearGradient>
      </defs>
      <path d="M220 196 L20 352 L26 372 L220 268 Z" fill="url(#wg)" />
      <path d="M220 196 L420 352 L414 372 L220 268 Z" fill="url(#wg)" opacity="0.93" />
      <path d="M220 404 L168 446 L172 456 L220 430 Z" fill="url(#wg)" />
      <path d="M220 404 L272 446 L268 456 L220 430 Z" fill="url(#wg)" opacity="0.93" />
      <path d="M220 10 C240 40 246 84 246 150 L246 392 C246 432 235 460 220 466 C205 460 194 432 194 392 L194 150 C194 84 200 40 220 10 Z" fill="url(#fz)" />
      <path d="M220 46 C235 66 238 96 238 126 L202 126 C202 96 205 66 220 46 Z" fill="#2c3a44" />
      <g fill="#7a6233">
        <circle cx="204" cy="168" r="3.4" /><circle cx="236" cy="168" r="3.4" />
        <circle cx="204" cy="206" r="3.4" /><circle cx="236" cy="206" r="3.4" />
        <circle cx="204" cy="244" r="3.4" /><circle cx="236" cy="244" r="3.4" />
        <circle cx="204" cy="282" r="3.4" /><circle cx="236" cy="282" r="3.4" />
      </g>
      <rect x="182" y="400" width="22" height="60" rx="11" fill="#8a6c3f" />
      <rect x="236" y="400" width="22" height="60" rx="11" fill="#7d6038" />
    </svg>
  );
}

function StructureFallback() {
  const seats = [160, 206, 258, 310];
  return (
    <svg viewBox="0 0 440 480" style={imgFill} preserveAspectRatio="xMidYMin meet">
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7cb98" /><stop offset="1" stopColor="#cdb184" />
        </linearGradient>
      </defs>
      <path d="M220 10 C238 40 244 80 244 134 L196 134 C196 80 202 40 220 10 Z" fill="url(#ng)" opacity="0.5" />
      <path d="M220 46 C234 66 236 96 236 122 L204 122 C204 96 206 66 220 46 Z" fill="#2c3a44" opacity="0.45" />
      <rect x="190" y="134" width="60" height="316" rx="20" fill="none" stroke="#6f675c" strokeWidth="1.8" />
      <path d="M220 450 L204 470 L236 470 Z" fill="#cdb184" opacity="0.7" />
      <g stroke="#6f675c" strokeWidth="1.4" fill="none">
        {seats.map((y) => (
          <g key={y}>
            <rect x="198" y={y} width="17" height="30" rx="5" />
            <rect x="225" y={y} width="17" height="30" rx="5" />
          </g>
        ))}
        <rect x="202" y="362" width="36" height="44" rx="5" />
      </g>
      <rect x="204" y="418" width="32" height="26" rx="5" fill="none" stroke="#6f675c" strokeWidth="1.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Style fragments                                                    */
/* ------------------------------------------------------------------ */

const imgFill: CSSProperties = { width: "100%", height: "100%", display: "block", objectFit: "contain" };
const overlay: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none" };

const mega: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontSize: "clamp(36px, 5.5vw, 104px)",
  lineHeight: 0.92,
  margin: 0,
  letterSpacing: "-0.01em",
};

const heroSub: CSSProperties = {
  marginTop: "clamp(10px, 1.5vh, 18px)",
  fontSize: "clamp(14px, 1.5vw, 18px)",
  lineHeight: 1.35,
  color: inkSoft,
};

const eyebrow: CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: "clamp(16px, 1.8vw, 22px)",
  fontWeight: 500,
};

const rightHead: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontSize: "clamp(20px, 2.8vw, 42px)",
  lineHeight: 1.05,
  margin: 0,
};

const label: CSSProperties = {
  fontSize: "clamp(9px, 0.9vw, 10.5px)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: inkSoft,
  fontWeight: 600,
};

const small: CSSProperties = {
  fontSize: "clamp(11px, 1.1vw, 13px)",
  lineHeight: 1.5,
  color: inkSoft,
  marginTop: 8,
};