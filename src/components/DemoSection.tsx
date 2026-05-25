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

export function DemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [rect, setRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const reposition = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    setRect(screenRect(el.clientWidth, el.clientHeight));
  }, []);

  useEffect(() => {
    reposition();
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [reposition]);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Initial mask: top is transparent so Frame 1's sky bleeds through
    el.style.webkitMaskImage = "linear-gradient(180deg, transparent 0%, black 32%)";
    el.style.maskImage        = "linear-gradient(180deg, transparent 0%, black 32%)";

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end:   "top top",
      scrub: true,
      onUpdate: (self) => {
        const stop = Math.round(32 - self.progress * 32);
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
          }, 1200);
        } else {
          clearTimeout(fadeTimer);
          video.pause();
          video.currentTime = 0;
          video.style.opacity = "0";
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
          objectFit: "fill",   // IMPORTANT
          borderRadius: "10px",
          zIndex: 2,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}