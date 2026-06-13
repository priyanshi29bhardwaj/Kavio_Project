import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./new-hero.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Frame 3: blueprint scanning wipe ────────────────────────────────────────
// Pinned 300vh section with two overlapping jet visuals. A gradient CSS mask
// wipes the physical jet away (--mask-size 100% 150% -> 100% 0%) while the
// technical blueprint is wiped into view (--mask-size 100% 0% -> 100% 150%,
// --mask-y 200% -> 50%), with a scanner line riding the boundary.
export function FleetSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        defaults: { ease: "none" },
      });

      tl
        // physical jet wiped away
        .fromTo(
          ".img-jet",
          { "--mask-size": "100% 150%" },
          { "--mask-size": "100% 0%", duration: 0.7 },
          0.04
        )
        // blueprint scanned into view
        .fromTo(
          ".blueprint",
          { "--mask-size": "100% 0%", "--mask-y": "200%" },
          { "--mask-size": "100% 150%", "--mask-y": "50%", duration: 0.7 },
          0.04
        )
        // blueprint-paper backdrop + scanner line ride along
        .to(".fleet-bg_blue", { opacity: 1, duration: 0.5 }, 0.08)
        // scanner line sweeps the wipe boundary while the section is pinned
        .fromTo(
          ".scanline",
          { top: "100%", opacity: 0 },
          { opacity: 1, duration: 0.04 },
          0.22
        )
        .to(".scanline", { top: "0%", duration: 0.52 }, 0.22)
        .to(".scanline", { opacity: 0, duration: 0.05 }, 0.74);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fleet_scroll-area" ref={rootRef}>
      <section className="fleet-w">
        <div className="fleet-bg_blue" />

        <div className="fleet-stage">
          <div className="fleet-imgs">
            <div className="blueprint">
              <div className="blueprint_grid" />
              <img className="blueprint_img" src="/new_hero/jet.webp" alt="" />
            </div>
            <img className="img-jet" src="/new_hero/jet.webp" alt="" />
            <div className="scanline" />
          </div>
        </div>
      </section>
    </div>
  );
}
