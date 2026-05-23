import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface AirplaneWindowProps {
  triggerOpen: boolean;
}

export const AirplaneWindow: React.FC<AirplaneWindowProps> = ({ triggerOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerOpen) return;

    // Create the timeline for opening the airplane window shade
    const tl = gsap.timeline({
      delay: 0.2 // slight delay after preloader completes
    });

    // 1. Slide window shade up (revealing moving clouds behind)
    tl.to(shadeRef.current, {
      yPercent: -100,
      duration: 1.8,
      ease: "power4.inOut"
    }, 0);

    // 2. Slide the mechanical shade handle (knob) up in sync
    tl.to(knobRef.current, {
      yPercent: -450, // Move it up to the top of the window frame
      duration: 1.8,
      ease: "power4.inOut"
    }, 0);

    // 3. Fade in and scale up the Kaivo logo inside the window pane
    tl.fromTo(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      filter: "blur(8px)"
    }, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.4,
      ease: "power3.out"
    }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, [triggerOpen]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-brand-teal/10 rounded-2xl border border-brand-teal/5 shadow-2xl"
    >
      {/* SVG Definitions for Masks and Clips */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          {/* Mask to cut a hole in the window frame image */}
          <mask id="window-hole-mask" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />
            {/* The oval window opening (drawn in black to cut it out) */}
            <path
              d="M 0.5,0.12 
                 C 0.64,0.12 0.74,0.22 0.74,0.5 
                 C 0.74,0.78 0.64,0.88 0.5,0.88 
                 C 0.36,0.88 0.26,0.78 0.26,0.5 
                 C 0.26,0.22 0.36,0.12 0.5,0.12 Z"
              fill="black"
            />
          </mask>

          {/* Clip path for elements confined to the window glass area (clouds, shade) */}
          <clipPath id="window-glass-clip" clipPathUnits="objectBoundingBox">
            <path
              d="M 0.5,0.12 
                 C 0.64,0.12 0.74,0.22 0.74,0.5 
                 C 0.74,0.78 0.64,0.88 0.5,0.88 
                 C 0.36,0.88 0.26,0.78 0.26,0.5 
                 C 0.26,0.22 0.36,0.12 0.5,0.12 Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Layer 1: Infinite Horizontal Panning Clouds (Behind everything, clipped to window shape) */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ clipPath: "url(#window-glass-clip)" }}
      >
        <div className="flex w-[200%] h-full cloud-scroller">
          <img
            src="/clouds.png"
            alt="Scrolling clouds"
            className="w-1/2 h-full object-cover select-none pointer-events-none"
          />
          <img
            src="/clouds.png"
            alt="Scrolling clouds loop"
            className="w-1/2 h-full object-cover select-none pointer-events-none"
          />
        </div>
      </div>

      {/* Layer 2: Window Shade Blind Panel (Slides UP, clipped to window shape) */}
      <div
        ref={shadeRef}
        className="absolute inset-0 z-10 bg-[#e2d8cd] flex items-center justify-center shadow-inner"
        style={{
          clipPath: "url(#window-glass-clip)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.15)"
        }}
      >
        {/* Horizontal blind pleats */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 opacity-30">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-[2px] bg-brand-teal/40 w-full" />
          ))}
        </div>
      </div>

      {/* Layer 3: Floating KAIVO logo inside the window pane */}
      <div
        ref={logoRef}
        className="absolute z-20 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{ clipPath: "url(#window-glass-clip)" }}
      >
        {/* Soft glowing background behind logo */}
        <div className="absolute w-36 h-36 bg-brand-aqua/20 rounded-full blur-2xl animate-pulse" />

        <svg
          viewBox="0 0 100 100"
          className="w-20 h-20 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          {/* Orbital double loop */}
          <path d="M 50 15 C 68 15, 85 32, 85 50 C 85 68, 68 85, 50 85 C 32 85, 15 68, 15 50 C 15 32, 32 15, 50 15 Z" />
          <path d="M 50 25 C 62 25, 75 38, 75 50 C 75 62, 62 75, 50 75 C 38 75, 25 62, 25 50 C 25 38, 38 25, 50 25 Z" />
          {/* Nested diamond */}
          <polygon
            points="50,38 62,50 50,62 38,50"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polygon
            points="50,44 56,50 50,56 44,50"
            fill="currentColor"
          />
        </svg>
        <span className="mt-2 text-white font-space-grotesk text-sm uppercase tracking-[0.3em] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          KAIVO
        </span>
      </div>

      {/* Layer 4: Cabin Window Frame (Foreground, masked to cut a hole in the center) */}
      <div
        className="absolute inset-0 z-30 w-full h-full pointer-events-none select-none"
        style={{ mask: "url(#window-hole-mask)", WebkitMask: "url(#window-hole-mask)" }}
      >
        <img
          src="/window_frame.png"
          alt="Cabin Window Frame"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 5: Mechanical Shade Handle (Knob) (Animates up along the window channel) */}
      <div
        ref={knobRef}
        className="absolute bottom-[10.5%] z-40 w-12 h-6 bg-[#cfc3b5] border border-brand-teal/20 rounded shadow-md flex items-center justify-center pointer-events-none select-none cursor-pointer"
        style={{
          boxShadow: "0 4px 6px rgba(0,0,0,0.1), inset 0 2px 2px rgba(255,255,255,0.4)"
        }}
      >
        {/* Metal ridge lines on handle */}
        <div className="flex gap-1">
          <div className="w-[2px] h-3 bg-brand-teal/30" />
          <div className="w-[2px] h-3 bg-brand-teal/30" />
          <div className="w-[2px] h-3 bg-brand-teal/30" />
        </div>
      </div>
    </div>
  );
};
