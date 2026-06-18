import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./new-hero.css";

gsap.registerPlugin(ScrollTrigger);

interface SkyAboutSectionProps {
  onJoinWaitlist: () => void;
}

export function SkyAboutSection({ onJoinWaitlist }: SkyAboutSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = textRef.current;
      if (!el) return;

      // Split into word spans for the progressive highlight
      const words = el.textContent!.trim().split(/\s+/);
      el.innerHTML = words.map(w => `<span class="about-word">${w}</span>`).join(" ");
      const spans = el.querySelectorAll<HTMLElement>(".about-word");

      let prevLit = -1;
      ScrollTrigger.create({
        trigger: el,
        start: "top 78%",
        end: "bottom 88%",
        scrub: 0.5,
        onUpdate: (self) => {
          const lit = Math.round(self.progress * spans.length);
          if (lit === prevLit) return;
          if (lit > prevLit) {
            for (let i = prevLit < 0 ? 0 : prevLit; i < lit; i++) spans[i]?.classList.add("is-on");
          } else {
            for (let i = lit; i < prevLit; i++) spans[i]?.classList.remove("is-on");
          }
          prevLit = lit;
        },
      });

      // Gentle parallax on the inner content as it rises through the frame
      gsap.fromTo(
        ".about-s_inner",
        { y: "6vh" },
        {
          y: "-14vh", ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      // Fade the copy out once it has been read, leaving pure descending sky
      // before the cabin rises in — guarantees no collision with the next frame
      gsap.to(".about-s_inner", {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "bottom 95%", end: "bottom 72%", scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sky-about" ref={rootRef}>
      <div className="about-tint" />
      <div className="about-s_inner">
        <p className="about-text" ref={textRef}>
          Your perfect flight, matched by AI. Found and booked in under 60 seconds.
          No endless searching. No second-guessing. No admin overload.
          Just better travel decisions — handled for you. Stop doing. Start delegating.
        </p>
        <div className="about-cta">
          <button className="btn-pill about-pill" onClick={onJoinWaitlist}>
            <span>Join Waitlist</span>
            <span className="btn-pill_ico">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
