import { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMG_W = 2576;
const IMG_H = 1440;

/* EXACT INNER TV DISPLAY */
const SCREEN = {
  left: 690,
  top: 365,
  right: 1960,
  bottom: 1050,
};

function screenRect(cW: number, cH: number) {
  const scale = Math.max(cW / IMG_W, cH / IMG_H);

  const dispW = IMG_W * scale;
  const dispH = IMG_H * scale;

  const offX = (cW - dispW) / 2;
  const offY = (cH - dispH) / 2;

  return {
    left: offX + (SCREEN.left / IMG_W) * dispW,
    top: offY + (SCREEN.top / IMG_H) * dispH,
    width: ((SCREEN.right - SCREEN.left) / IMG_W) * dispW,
    height: ((SCREEN.bottom - SCREEN.top) / IMG_H) * dispH,
  };
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5V1H5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 1H13V5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 9V13H9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 13H1V9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CompressIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 1V5H1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 5H9V1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13V9H13" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 9H5V13" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DemoSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const reposition = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) setRect(screenRect(el.clientWidth, el.clientHeight));
  }, []);

  useEffect(() => {
    reposition();
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [reposition]);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.style.webkitMaskImage = "linear-gradient(180deg, transparent 0%, black 100%)";
    el.style.maskImage        = "linear-gradient(180deg, transparent 0%, black 100%)";

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end:   "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const stop = Math.round(100 - self.progress * 100);
        const mask = stop > 0
          ? `linear-gradient(180deg, transparent 0%, black ${stop}%)`
          : "none";
        el.style.webkitMaskImage = mask;
        el.style.maskImage       = mask;
      },
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let fadeTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fadeTimer = setTimeout(() => {
            video.style.transition = "opacity 0.8s ease";
            video.style.opacity = "1";
            video.play().catch(() => {});
            setVideoVisible(true);
          }, 1200);
        } else {
          clearTimeout(fadeTimer);
          video.pause();
          video.currentTime = 0;
          video.style.opacity = "0";
          setVideoVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          background: "linear-gradient(180deg, #0c1a24 0%, #1a2f3f 60%, #edf2f4 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px 0",
        }}
      >
        {/* Label */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "10px",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(126,206,202,0.7)",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          See it in action
        </p>

        {/* Video in a rounded device frame */}
        <div style={{
          width: "100%",
          maxWidth: "380px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#000",
        }}>
          <video
            ref={videoRef}
            src="/kavio_ui_ux.mp4"
            muted
            autoPlay
            playsInline
            loop
            preload="auto"
            style={{
              width: "100%",
              display: "block",
              opacity: 1,
            }}
          />
        </div>

        {/* Bottom fade into next section */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, transparent, #edf2f4)",
          pointerEvents: "none",
        }} />
      </section>
    );
  }

  /* ── Desktop layout ── */
  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundImage: "url(/ife-cabin.png)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {/* Video inside IFE screen */}
      <video
        ref={videoRef}
        src="/kavio_ui_ux.mp4"
        muted
        playsInline
        loop
        preload="auto"
        style={{
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          objectFit: "fill",
          borderRadius: "10px",
          zIndex: 2,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Fullscreen toggle button — top-right of IFE screen */}
      {videoVisible && (
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          style={{
            position: "absolute",
            left: rect.left + rect.width - 38,
            top: rect.top + 8,
            zIndex: 10,
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.15s ease",
            padding: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.7)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.45)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          {isFullscreen ? <CompressIcon /> : <ExpandIcon />}
        </button>
      )}

      {/* Smooth bottom fade — cabin dissolves into a light sky teal wash */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "260px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.5) 48%, white 100%)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
