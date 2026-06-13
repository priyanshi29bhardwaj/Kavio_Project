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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // descent target lives in the sibling hero section
      const skyImg = document.querySelector(".sky-stage_img");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        defaults: { ease: "none" },
      });

      // descent: clouds drift up + push in so it feels like losing altitude.
      // force3D keeps it on the GPU; modest scale (1.28) keeps per-frame
      // texture sampling cheap so it stays smooth.
      if (skyImg) {
        tl.fromTo(
          skyImg,
          { yPercent: 0, scale: 1 },
          { yPercent: -34, scale: 1.28, duration: 1, force3D: true },
          0
        );
      }

      tl
        .fromTo(".about-s_text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.05)
        .to(".about-s_text", { opacity: 0, duration: 0.1 }, 0.52)
        .fromTo(".about-s_cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.64);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sky-about" ref={rootRef}>
      <div className="about-s">
        <p className="about-s_text">
          Your perfect flight, matched by AI. Found and booked in under 60
          seconds. No endless searching. No second-guessing. No admin overload.
          Just better travel decisions — handled for you.
        </p>

        <div className="about-s_cta">
          <h3 className="about-s_cta_tag">
            Stop doing.
            <br />
            Start delegating.
          </h3>
          <button className="about-s_cta_btn" onClick={onJoinWaitlist}>
            Join waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
