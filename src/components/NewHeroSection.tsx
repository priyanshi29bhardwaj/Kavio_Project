import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { KaivoWordmark } from "./KaivoLogo";
import "./new-hero.css";

gsap.registerPlugin(ScrollTrigger, CustomEase);

if (!CustomEase.get("kInOut")) CustomEase.create("kInOut", "0.76, 0, 0.24, 1");
if (!CustomEase.get("kOut"))   CustomEase.create("kOut",   "0.25, 1, 0.5, 1");

interface NewHeroSectionProps {
  shutterOpen: boolean;
  onJoinWaitlist: () => void;
}

export function NewHeroSection({ shutterOpen, onJoinWaitlist }: NewHeroSectionProps) {
  const rootRef       = useRef<HTMLElement>(null);
  const stageRef      = useRef<HTMLDivElement>(null);
  const shutterRef    = useRef<HTMLImageElement>(null);
  const handleClipRef = useRef<HTMLDivElement>(null);
  const handleImgRef  = useRef<HTMLImageElement>(null);
  const cabinRef      = useRef<HTMLImageElement>(null);
  const skyVideoRef   = useRef<HTMLVideoElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const heroFgRef     = useRef<HTMLDivElement>(null);
  const brandRevRef   = useRef<HTMLDivElement>(null);
  const introPlayed   = useRef(false);

  // How far the shutter must translate upward (as % of its own height) so the
  // bottom edge of the panel clears the top inner edge of the window opening.
  function shutterLift() {
    const st = stageRef.current;
    if (!st || !st.clientHeight) return -68;
    const H = st.clientHeight, W = st.clientWidth;
    const scale = Math.max(W / 1672, H / 941);
    return -(((764 - 94) * scale / H) * 100 - 1);
  }

  // The knob settles slightly lower than a full lift so the tab peeks into the
  // glass rather than tucking fully behind the frame.
  function handleRest() {
    const st = stageRef.current;
    if (!st || !st.clientHeight) return -69;
    const H = st.clientHeight, W = st.clientWidth;
    const scale = Math.max(W / 1672, H / 941);
    return -(((764 - 110) * scale / H) * 100);
  }

  // ── scroll-driven animations ──────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // cabin + handle fly through the window on scroll.
      // immediateRender is left at its default (true for fromTo) so that at
      // scrub progress=0 the FROM state (scale:1) is always explicitly applied.
      // In a production Vite build there is only one effect mount (no Strict-Mode
      // double-invoke), so the FROM values must be locked in at tween creation.
      const zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      })
        .fromTo(cabinRef.current,      { scale: 1 }, { scale: 9,    duration: 0.6 }, 0)
        .fromTo(handleClipRef.current, { scale: 1 }, { scale: 9,    duration: 0.6 }, 0)
        .to(handleImgRef.current,  { opacity: 0, duration: 0.22 }, 0.3)
        .fromTo(skyVideoRef.current,   { scale: 1 }, { scale: 1.12, duration: 0.9 }, 0);

      // continuous descent — pan the sky video downward; deferred so sibling
      // sections (sky-about) are in the DOM before ScrollTrigger resolves them
      requestAnimationFrame(() => {
        gsap.fromTo(
          skyVideoRef.current,
          { objectPosition: "50% 44%" },
          {
            objectPosition: "50% 92%",
            ease: "none",
            overwrite: "auto",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              endTrigger: ".sky-about",
              end: "bottom bottom",
              scrub: 1.5,
            },
          }
        );
        ScrollTrigger.refresh();
      });

      // brand reveal fades in after the cabin zoom, then out before about
      gsap.fromTo(brandRevRef.current, { opacity: 0 }, {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "55% top", end: "65% top", scrub: 2 },
      });
      gsap.to(brandRevRef.current, {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "84% top", end: "bottom top", scrub: 2 },
      });

      // Ensure ScrollTrigger positions are measured after all assets are ready.
      // In a production CDN build, images/fonts can load after the first
      // useLayoutEffect run, so we refresh at a few checkpoints:
      //   1. rAF after mount (catches the common case)
      //   2. window.load (all resources including CDN images)
      //   3. document.fonts.ready (web fonts can shift element heights)
      //   4. 600 ms timeout (final safety net for slow CDN edge nodes)
      // NOTE: we intentionally do NOT add a manual window.resize -> refresh here.
      // ScrollTrigger already auto-refreshes on resize, and App.tsx sets
      // ScrollTrigger.config({ ignoreMobileResize: true }) so the mobile URL-bar
      // show/hide (which fires resize mid-scroll) doesn't retrigger a refresh and
      // jolt the pinned hero. A manual listener would bypass that protection.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts.ready.then(refresh);
      const safetyTimer = setTimeout(refresh, 600);
      if (document.readyState === "complete") {
        requestAnimationFrame(refresh);
      }

      // Title/FG fade is fine as a one-shot (gated by `hidden`). The cabin reset
      // must NOT be one-shot: the production freeze happened because a trailing,
      // stale scrub frame re-applied a mid-zoom scale AFTER the single reset ran,
      // and nothing corrected it again — the cabin stayed frozen on the homepage.
      let hidden = false;
      const onScroll = () => {
        const y = window.scrollY;
        if (y > 20) {
          if (!hidden) {
            hidden = true;
            gsap.to([titleRef.current, heroFgRef.current], { opacity: 0, duration: 0.25, ease: "power2.in", overwrite: true });
          }
        } else if (y < 5) {
          if (hidden) {
            hidden = false;
            gsap.to([titleRef.current, heroFgRef.current], { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: true });
          }
          // IDEMPOTENT hard-reset, fires on every scroll frame near the very top.
          // zoomTl.progress(0) snaps the cabin + handle-clip + sky back to scale 1
          // AND restores the knob opacity in one call — on the exact timeline the
          // scrub drives, so the scrub can't fight it (at scrollY≈0 the scrub's own
          // target is also progress 0). Re-running it every top frame guarantees a
          // stale/trailing scrub frame can never leave the hero stuck mid-zoom.
          zoomTl.progress(0);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("load", refresh);
        clearTimeout(safetyTimer);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // ── entrance animation (fires once the preloader hands off) ──────────────
  useEffect(() => {
    if (!shutterOpen || introPlayed.current) return;
    introPlayed.current = true;

    if (skyVideoRef.current) skyVideoRef.current.play().catch(() => {});

    // set starting states
    gsap.set([cabinRef.current, shutterRef.current, skyVideoRef.current], { scale: 1.12 });
    gsap.set(shutterRef.current,   { yPercent: 0 });
    gsap.set(handleImgRef.current, { yPercent: shutterLift(), opacity: 0 });
    gsap.set(titleRef.current,     { opacity: 0, y: 40 });
    gsap.set(heroFgRef.current,    { opacity: 0 });

    gsap.timeline()
      // settle the cabin + sky to scale 1
      .to([cabinRef.current, shutterRef.current, skyVideoRef.current], { scale: 1, duration: 1.7, ease: "kOut" })
      // lift the shutter panel
      .to(shutterRef.current, { yPercent: () => shutterLift(), duration: 3.4, ease: "kInOut" }, "-=1.7")
      // panel gone → knob-only layer takes over (no visible jump)
      .set(shutterRef.current,   { opacity: 0 })
      .set(handleImgRef.current, { opacity: 1 })
      // knob settles to its resting position
      .to(handleImgRef.current, { yPercent: () => handleRest(), duration: 0.35, ease: "kOut" })
      // reveal copy
      .to(titleRef.current,  { opacity: 1, y: 0, duration: 1.1, ease: "kOut" }, "-=1.2")
      .to(heroFgRef.current, { opacity: 1, duration: 1,   ease: "kOut" }, "-=1");
  }, [shutterOpen]);

  return (
    <>
      {/* ── persistent fixed sky (video) — sits behind every section ── */}
      <div className="sky-fixed" id="skyFixed">
        <video
          ref={skyVideoRef}
          className="sky-video"
          id="skyVideo"
          autoPlay
          muted
          loop
          playsInline
          poster="/kaivo-hero/sky-poster.jpg"
        >
          <source src="/kaivo-hero/sky.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── brand reveal (fixed overlay after zoom-through) ── */}
      <div className="brand-reveal" ref={brandRevRef} id="brandReveal">
        <KaivoWordmark height={72} color="#ffffff" style={{ width: "clamp(14rem,28vw,26rem)", height: "auto" }} />
        <p className="brand-reveal_tag">CONVERSATIONAL TRAVEL BOOKING</p>
      </div>

      {/* ── hero scroll area ── */}
      <section className="hero_scroll-area" ref={rootRef}>
        <div className="hero-w">
          <div className="hero-stage" ref={stageRef}>

            {/* window shutter — lifts on entrance, swaps to knob-only after */}
            <img ref={shutterRef} className="shutter" id="shutter" src="/kaivo-hero/cabin-shutter.png" alt="" />

            {/* knob clip scales with the cabin so it stays glued to the window */}
            <div ref={handleClipRef} className="handle-clip" id="handleClip">
              <img ref={handleImgRef} id="shutterHandle" src="/kaivo-hero/cabin-knob.png" alt="" style={{ opacity: 0 }} />
            </div>

            {/* cabin frame + wall with transparent window cutout */}
            <img ref={cabinRef} className="cabin" id="cabin" src="/kaivo-hero/cabin-full.png" alt="" />

            {/* hero title */}
            <h2 ref={titleRef} className="title title--r" id="titleL">
              AI-Powered.<br />
              Conversational<br />
              Travel&nbsp;Booking<br />
              Agent
            </h2>

            {/* bottom foreground row */}
            <div ref={heroFgRef} className="hero-fg" id="heroFg">
              <div className="hero-lead">
                <h3>Delegate &amp; Approve:<br />Book a Flight in 60&nbsp;Seconds</h3>
              </div>

              <button className="btn-pill" onClick={onJoinWaitlist}>
                <span>Join Waitlist</span>
                <span className="btn-pill_ico">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
                  </svg>
                </span>
              </button>

              <div className="hero-scroll">
                <span className="hero-scroll_rule"></span>
                <div className="hero-scroll_bar">
                  <div className="hero-scroll_left">
                    <span className="hero-scroll_chev"></span>
                    <span className="hero-scroll_label">Scroll Down</span>
                  </div>
                  <span className="hero-scroll_right">To Start The Journey</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
