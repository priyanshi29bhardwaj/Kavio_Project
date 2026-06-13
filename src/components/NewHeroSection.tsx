import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { KaivoWordmark } from "./KaivoLogo";
import "./new-hero.css";

gsap.registerPlugin(ScrollTrigger, CustomEase);

if (!CustomEase.get("kaivoInOut")) CustomEase.create("kaivoInOut", "0.76, 0, 0.24, 1");
if (!CustomEase.get("kaivoOut")) CustomEase.create("kaivoOut", "0.25, 1, 0.5, 1");
if (!CustomEase.get("kaivoIn")) CustomEase.create("kaivoIn", "0.5, 0, 0.75, 0");

interface NewHeroSectionProps {
  /** flips to true when the Preloader (frame 0) finishes */
  shutterOpen: boolean;
  onJoinWaitlist: () => void;
}

// ─── Frame 1: cabin-window zoom-through hero ─────────────────────────────────
// One pinned ScrollTrigger drives the whole shot. The cloud sky (.sky-stage)
// is mounted fixed *underneath* the cabin from the first paint. As the scroll
// progresses the composite cabin plate scales out through the window cutout
// while the titles blow up and fly off; near the end the cabin dissolves and
// .sky-stage crossfades to full opacity — so the viewer flies through the
// window into an endless sky as one uninterrupted cinematic shot. There is no
// fixed-height/sticky tail, so no brown or blue gap appears in either
// scroll direction.
export function NewHeroSection({ shutterOpen, onJoinWaitlist }: NewHeroSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const introPlayed = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          // scrub:true — the animation tracks Lenis's already-smoothed scroll
          // 1:1 with NO lag. (A numeric scrub lags, so on a fast scroll back to
          // top the cabin was caught mid-dissolve = the big flash.)
          scrub: true,
        },
        defaults: { ease: "none" },
      });

      heroTl
        // fly THROUGH the window: the cabin plate (frame + wall) scales out from
        // the window centre and flies past, revealing the sky that is ALREADY
        // behind it (.sky-stage) — same image, no swap/crossfade.
        // scale is capped at 4.8 so the layer never exceeds the GPU max texture
        // size (which caused tearing/fragmenting on reverse scroll)
        .to(".hero-w_bg", { scale: 4, duration: 0.45, ease: "power1.in" }, 0)
        // titles blow up and fly off both sides, then fade
        .to(".hero-s", { scale: 6, duration: 0.38, ease: "power1.in" }, 0)
        .to(".hero-s_title-l", { xPercent: -130, duration: 0.38, ease: "power1.in" }, 0)
        .to(".hero-s_title-r", { xPercent: 130, duration: 0.38, ease: "power1.in" }, 0)
        // fromTo with immediateRender:false — otherwise the scrub captures the
        // CSS opacity:0 at mount (before the intro reveals it) and the fade
        // becomes a 0→0 no-op, leaving the initial CTA stuck on screen behind
        // the post-zoom one
        .fromTo(
          ".hero-cta",
          { opacity: 1 },
          { opacity: 0, duration: 0.07, immediateRender: false },
          0.03
        )
        .to(".hero-s", { opacity: 0, duration: 0.14 }, 0.2)
        // the cabin frame/wall dissolves as it engulfs the frame — fully gone by
        // ~0.38 so the oversized layer never lingers
        .to(".hero-w_bg", { opacity: 0, duration: 0.12 }, 0.26)
        // post-zoom screen: Kaivo logo + tagline settle in over the open sky
        .fromTo(
          ".sky-hero",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
          0.38
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // intro: window blind opens once the preloader hands off
  useEffect(() => {
    if (!shutterOpen || introPlayed.current || !rootRef.current) return;
    introPlayed.current = true;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(".hero-w_bg_window_knob", {
          yPercent: -92,
          duration: 1.9,
          ease: "kaivoInOut",
        })
        .to(
          ".hero-s_title span > i",
          { y: 0, duration: 1.25, ease: "kaivoOut", stagger: 0.09 },
          "-=1.1"
        )
        .fromTo(
          [".hero-s_caption-l", ".hero-s_caption-r"],
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 1, ease: "kaivoOut", stagger: 0.12 },
          "-=0.8"
        )
        .to(".hero-cta", { opacity: 1, duration: 0.9, ease: "kaivoOut" }, "-=0.9");
    }, rootRef);

    return () => {
      ctx.kill();
    };
  }, [shutterOpen]);

  return (
    <div className="hero_scroll-area" ref={rootRef}>
      {/* persistent cloud scene — mounted underneath the cabin from the first
          paint and visible straight through the window cutout. Zooming the
          frame out reveals THIS exact image (no swap), and it stays put through
          the sky-about descent below */}
      <div className="sky-stage" aria-hidden>
        <div className="sky-stage_img" />
        <div className="sky-stage_grade" />
      </div>

      <section className="hero-w">
        {/* composite cabin window background (sky shows through the cutout) */}
        <div className="hero-w_bg">
          {/* window blind / shutter (clipped to the cutout) */}
          <div className="hero-w_bg_window_clip">
            <img className="hero-w_bg_window_knob" src="/new_hero/shutter.webp" alt="" />
          </div>
          {/* 2. window frame */}
          <img className="hero-w_bg_window" src="/new_hero/window-frame.png" alt="" />
          {/* 3. interior cabin paneling with transparent cutout */}
          <img className="hero-w_bg_front" src="/new_hero/cabin-front.webp" alt="" />
        </div>

        {/* hero titles */}
        <div className="hero-s">
          <div className="hero-s_brand">
            <KaivoWordmark height={26} color="#fdfcfa" />
          </div>

          <h2 className="hero-s_title hero-s_title-l">
            <span><i>AI powered</i></span>
            <span><i>conversational</i></span>
          </h2>
          <h2 className="hero-s_title hero-s_title-r">
            <span><i>travel booking</i></span>
            <span><i>agent</i></span>
          </h2>

          <div className="hero-s_caption-l">
            <p className="hero-s_caption-l_head">
              Delegate
              <br />
              and approve
            </p>
            <span className="hero-s_caption-l_rule" />
            <p className="hero-s_caption-l_body">Book a flight in 60 seconds.</p>
          </div>

          <div className="hero-s_caption-r">
            <span className="hero-s_caption-r_rule" />
            <div className="hero-s_caption-r_row">
              <span>Scroll down</span>
              <span>To start the journey</span>
            </div>
          </div>
        </div>

        {/* CTA pill */}
        <div className="hero-cta">
          <button onClick={onJoinWaitlist}>Join Waitlist</button>
        </div>

        {/* post-zoom screen — shown once we've flown through the window */}
        <div className="sky-hero">
          <KaivoWordmark height={32} color="#ffffff" />
          <h1 className="sky-hero_title">
            Conversational travel
            <br />
            booking agent
          </h1>
          <p className="sky-hero_sub">AI-powered. Book a flight in 60 seconds.</p>
          <button className="sky-hero_cta" onClick={onJoinWaitlist}>
            Join Waitlist
          </button>
        </div>
      </section>
    </div>
  );
}
