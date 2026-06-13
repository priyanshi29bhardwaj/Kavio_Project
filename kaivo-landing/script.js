/* ============================================================
   KAIVO — scroll-linked immersive experience
   GSAP + ScrollTrigger + SplitText + CustomEase + Lenis
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/* ---------- 1. custom easing curves ---------- */
CustomEase.create("inOut", "0.76, 0, 0.24, 1");
CustomEase.create("out", "0.25, 1, 0.5, 1");
CustomEase.create("in", "0.5, 0, 0.75, 0");

/* ---------- 1b. Lenis smooth momentum scrolling ---------- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* hold scroll until the intro finishes */
lenis.stop();
window.scrollTo(0, 0);

/* ============================================================
   2. PRELOADER + WINDOW BLIND OPENING
   ============================================================ */

/* wrap each hero title line for the masked line-reveal */
document.querySelectorAll(".hero-s_title span").forEach((line) => {
  const i = document.createElement("i");
  i.textContent = line.textContent;
  line.textContent = "";
  line.appendChild(i);
});

const intro = gsap.timeline({
  delay: 0.35,
  onComplete: () => lenis.start(),
});

intro
  /* "Kaivo" blur/fade reveal */
  .to(".preloader_title", {
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.4,
    ease: "out",
  })
  .to(".preloader_sub", { opacity: 1, duration: 0.8, ease: "out" }, "-=0.7")
  .to(
    ".preloader_title",
    { opacity: 0, filter: "blur(18px)", duration: 0.7, ease: "in" },
    "+=0.55"
  )
  .to(".preloader_sub", { opacity: 0, duration: 0.4, ease: "in" }, "<")
  .to(".preloader", { opacity: 0, duration: 0.9, ease: "inOut" }, "-=0.15")
  .set(".preloader", { display: "none" })

  /* the window blind slides up, revealing the sky */
  .to(
    ".hero-w_bg_window_knob",
    { yPercent: -92, duration: 1.9, ease: "inOut" },
    "-=0.55"
  )

  /* hero UI enters */
  .to(
    ".hero-s_title span > i",
    { y: 0, duration: 1.25, ease: "out", stagger: 0.09 },
    "-=1.1"
  )
  .fromTo(
    [".hero-s_caption-l", ".hero-s_caption-r"],
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 1, ease: "out", stagger: 0.12 },
    "-=0.8"
  )
  .to(".nav", { opacity: 1, duration: 0.9, ease: "out" }, "-=0.9")
  .to(".cta-pill", { opacity: 1, duration: 0.9, ease: "out" }, "<");

/* idle cloud drift inside the porthole */
gsap.to(".hero-w_bg_back", {
  backgroundPosition: "58% 30%",
  duration: 16,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
});

/* ============================================================
   3 + 4. HERO ZOOM-THROUGH + DESCENT / COLOR-GRADE BRIDGE
   ============================================================ */
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero_scroll-area",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
  defaults: { ease: "none" },
});

heroTl
  /* fly out through the window: 1 -> 6.5 */
  .to(".hero-w_bg", { scale: 6.5, duration: 0.55, ease: "in" }, 0)

  /* titles blow up x8 and fly off both sides */
  .to(".hero-s", { scale: 8, duration: 0.55, ease: "in" }, 0)
  .to(".hero-s_title-l", { x: "-50vw", duration: 0.55, ease: "in" }, 0)
  .to(".hero-s_title-r", { x: "50vw", duration: 0.55, ease: "in" }, 0)
  .to(".hero-s", { opacity: 0, duration: 0.18 }, 0.2)
  .to(".nav", { opacity: 0, duration: 0.1 }, 0.08)

  /* cabin dissolves as the cutout swallows the viewport */
  .to(
    [".hero-w_bg_front", ".hero-w_bg_window", ".hero-w_bg_window_clip"],
    { opacity: 0, duration: 0.12 },
    0.42
  )

  /* descent sky takes over */
  .to(".sky-bg_hero", { opacity: 1, duration: 0.1 }, 0.46)
  .fromTo(
    ".sky-bg_hero_img",
    { scale: 1.3, yPercent: 0 },
    { scale: 1, yPercent: -16, duration: 0.54 },
    0.46
  )

  /* color-grading bridge into frame 2's solid #015AA9 */
  .to(".sky-bg_hero_grad-over", { opacity: 1, duration: 0.34 }, 0.58)
  .to(".sky-bg_hero_img", { opacity: 0.35, duration: 0.2 }, 0.8);

/* ============================================================
   5. ABOUT — OVERLAP PARALLAX + HIGHLIGHT TEXT REVEAL
   ============================================================ */
const aboutSplit = new SplitText(".about-s_text", {
  type: "words",
  wordsClass: "word",
});

const aboutTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sky-about",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
  defaults: { ease: "none" },
});

aboutTl
  /* section slides over the sky: -50vh -> -200vh */
  .fromTo(".about-s", { y: "-50vh" }, { y: "-200vh", duration: 1 }, 0)

  /* dimmed words light up sequentially as they cross ~75% viewport */
  .to(
    aboutSplit.words,
    { opacity: 1, stagger: 0.012, duration: 0.16 },
    0.06
  )

  /* feature cards rise in afterwards */
  .fromTo(
    ".about-s_card",
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, stagger: 0.03, duration: 0.16 },
    0.2
  );

/* ============================================================
   6. FLEET — BLUEPRINT SCANNING WIPE
   ============================================================ */
const fleetTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".fleet_scroll-area",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
  defaults: { ease: "none" },
});

fleetTl
  /* physical jet wiped away */
  .fromTo(
    ".img-jet",
    { "--mask-size": "100% 150%" },
    { "--mask-size": "100% 0%", duration: 0.8 },
    0.1
  )

  /* blueprint scanned into view */
  .fromTo(
    ".blueprint",
    { "--mask-size": "100% 0%", "--mask-y": "200%" },
    { "--mask-size": "100% 150%", "--mask-y": "50%", duration: 0.8 },
    0.1
  )

  /* blueprint-paper backdrop + scanner line ride along */
  .to(".fleet-bg_blue", { opacity: 1, duration: 0.6 }, 0.15)
  .to(".fleet-s_titles", { color: "#bfe2f5", duration: 0.6 }, 0.15)
  .to(".fleet-s_spec", { color: "#bfe2f5", duration: 0.6 }, 0.15)
  .fromTo(
    ".scanline",
    { top: "100%", opacity: 0 },
    { opacity: 1, duration: 0.05 },
    0.1
  )
  .to(".scanline", { top: "0%", duration: 0.75 }, 0.15)
  .to(".scanline", { opacity: 0, duration: 0.05 }, 0.9);

/* ============================================================
   misc
   ============================================================ */
/* anchor links route through Lenis */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.6 });
  });
});

window.addEventListener("load", () => ScrollTrigger.refresh());
