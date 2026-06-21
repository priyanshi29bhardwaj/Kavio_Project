"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * GlobeAnimation — Kaivo Global Presence Section (All-in-One)
 * ------------------------------------------------------------------
 * Self-contained section with:
 *   - Rotating dot-matrix globe (Three.js)
 *   - "KAIVO" giant watermark behind the globe
 *   - Headline, tagline, CTA buttons
 *   - Office city tags at the bottom
 *   - Animated flight-path connections between hub cities, with a
 *     glowing dot that travels from one location to the other
 *   - Atmospheric gradient background + grain texture
 *   - Scroll-triggered fade-in animations
 *   - Fully responsive: fluid type/spacing via clamp(), and the globe
 *     itself is rebuilt at the right proportions on resize/rotation,
 *     not just visually stretched
 *
 * Palette:
 *   Dark Teal    #0B2B2B  → background
 *   Icy Aqua     #A9E5E0  → globe dots, glow, wireframe
 *   Lemon Lime   #D4E157  → hub dots, ping rings, city markers, traveling flights
 *   Sweet Potato #E2725B  → flight arcs, rim light
 * ------------------------------------------------------------------
 * USAGE:
 *   import GlobeAnimation from "@/components/GlobeAnimation";
 *   <GlobeAnimation />
 * ------------------------------------------------------------------
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const KAIVO_COLORS = {
  aqua:   0xa9e5e0,
  lime:   0xd4e157,
  potato: 0xe2725b,
};



// ─────────────────────────────────────────────────────────────────────────────
// Continent dot seeds [lat, lon]
// ─────────────────────────────────────────────────────────────────────────────
const CONTINENT_SEEDS: [number, number][] = [
  // North America
  [70,-140],[65,-155],[62,-150],[60,-145],[58,-135],[55,-130],[52,-127],
  [50,-125],[48,-124],[45,-122],[42,-122],[38,-122],[35,-120],[33,-117],
  [30,-110],[28,-110],[25,-105],[22,-100],[20,-98],[18,-95],[17,-92],
  [16,-90],[15,-88],[12,-85],[10,-84],[9,-79],
  [65,-130],[60,-120],[55,-115],[50,-110],[45,-108],[40,-107],[36,-105],
  [32,-106],[30,-104],[28,-100],[25,-100],[22,-99],
  [68,-100],[65,-100],[60,-98],[55,-95],[50,-90],[48,-88],[45,-84],
  [42,-82],[40,-82],[38,-84],[36,-85],[34,-87],[32,-88],[30,-90],[28,-92],
  [50,-75],[48,-70],[46,-65],[44,-63],[42,-70],[40,-74],[38,-77],
  [36,-80],[34,-78],[32,-80],[30,-82],[50,-57],[54,-58],[58,-60],
  [60,-65],[55,-72],[52,-68],[48,-65],[70,-90],[72,-80],[74,-100],
  [72,-115],[68,-105],[65,-90],[72,-70],[70,-55],
  // South America
  [11,-72],[10,-68],[8,-65],[6,-62],[4,-58],[2,-54],[0,-50],
  [-2,-47],[-5,-45],[-8,-38],[-10,-36],[-12,-38],[-15,-38],[-18,-40],
  [-20,-42],[-22,-43],[-25,-48],[-28,-49],[-30,-51],[-33,-53],[-35,-58],
  [-38,-62],[-40,-64],[-42,-63],[-45,-66],[-48,-68],[-50,-70],[-52,-68],
  [0,-75],[-5,-78],[-10,-78],[-15,-75],[-20,-70],[-25,-70],[-28,-68],
  [-32,-70],[-35,-71],[-38,-70],[-42,-72],[-2,-60],[-8,-62],[-12,-65],
  [-16,-62],[-20,-57],[-24,-57],[-28,-57],[-32,-60],[10,-62],[8,-62],
  [5,-56],[3,-52],[1,-44],[-4,-40],
  // Europe
  [71,26],[69,20],[68,16],[66,14],[64,20],[62,24],[60,18],[58,12],[56,10],
  [55,12],[54,10],[52,8],[50,8],[48,8],[46,8],[44,8],[42,14],[40,14],
  [38,14],[37,14],[36,14],[36,-5],[38,-5],[40,-5],[42,-2],[44,-1],[46,2],
  [48,2],[50,1],[52,4],[54,6],[56,12],[58,16],[60,22],[62,28],[64,28],
  [66,28],[48,22],[50,18],[52,18],[54,18],[56,22],[58,24],[60,26],[44,22],
  [46,22],[48,28],[50,28],[52,22],[54,22],[42,20],[44,16],[46,16],[38,20],
  [40,22],[42,24],[44,26],[42,28],[40,28],[38,26],
  // Africa
  [37,10],[35,8],[32,8],[30,8],[28,10],[25,12],[22,15],[18,18],[14,22],
  [10,25],[6,25],[2,25],[-2,25],[-5,28],[-8,28],[-12,28],[-16,28],
  [-20,28],[-24,28],[-28,28],[-32,26],[-34,24],[-33,18],[-30,18],
  [-26,18],[-22,18],[-18,18],[-14,18],[-10,18],[-6,18],[-2,18],[2,18],
  [6,18],[10,14],[14,14],[18,14],[22,14],[26,12],[30,10],[32,12],[35,12],
  [12,38],[8,38],[4,38],[0,38],[-4,38],[-8,38],[-12,38],[-16,38],
  [-20,38],[30,30],[25,32],[20,30],[15,32],[10,32],[5,32],[0,32],[-5,32],
  [-10,35],[-15,35],[-20,42],[-15,42],[-10,40],[-5,40],[0,42],[5,42],
  [10,42],[15,38],[20,42],[10,7],[5,5],[0,5],[-5,12],[-5,18],[5,2],[8,2],
  [4,2],[0,-2],[-2,-8],[-4,-14],[-6,-14],[14,2],[10,2],[6,-5],[4,-5],
  [15,8],[20,8],[25,8],[30,8],[-22,12],[-18,12],[-14,12],[-10,12],
  [-6,12],[-2,10],[2,14],[6,14],
  // Asia
  [10,78],[12,78],[15,78],[18,78],[20,78],[22,80],[24,88],[22,88],
  [20,90],[18,92],[16,98],[12,100],[10,102],[8,100],[6,100],[4,100],
  [2,102],[0,102],[-2,112],[-6,108],[-8,116],[-6,112],[25,90],[28,90],
  [30,92],[32,90],[35,80],[38,72],[40,68],[42,62],[40,58],[38,58],
  [36,54],[34,50],[32,48],[30,48],[28,48],[25,50],[22,58],[18,55],[15,50],
  [12,44],[10,42],[8,42],[42,48],[44,52],[46,60],[48,58],[50,58],[52,60],
  [54,64],[56,68],[58,70],[60,70],[62,68],[64,70],[62,74],[60,78],
  [58,78],[55,82],[55,88],[52,88],[50,88],[48,86],[46,84],[44,80],
  [42,78],[55,94],[52,96],[50,98],[48,98],[50,108],[52,108],[54,108],
  [56,108],[58,108],[58,112],[55,112],[52,116],[50,120],[48,122],[50,128],
  [52,128],[54,124],[56,120],[58,118],[60,120],[62,120],[64,120],[66,120],
  [62,130],[58,130],[55,130],[52,132],[48,134],[44,132],[42,130],[40,128],
  [38,128],[36,128],[35,136],[37,136],[38,140],[40,140],[42,142],[44,142],
  [43,134],[42,136],[38,136],[36,138],[35,132],[22,114],[24,116],[26,114],
  [28,112],[30,114],[32,118],[34,120],[36,122],[38,120],[40,122],[42,126],
  [25,118],[22,120],[20,110],[18,108],[16,108],[14,102],[12,100],[10,104],
  [8,98],[6,100],[4,100],[2,104],[-2,108],[-4,104],[-6,106],[-8,114],
  [-6,120],[-8,120],[-4,120],[-2,116],[0,108],[2,108],[4,104],[6,98],
  [36,50],[34,44],[32,42],[30,42],[28,46],[26,50],[22,54],[20,58],
  [18,52],[16,44],[14,44],[12,44],[10,44],[8,44],[6,42],[4,38],[2,38],
  [0,36],[-2,38],[-4,40],[40,62],[42,68],[44,68],[46,64],[48,64],[50,70],
  [42,72],[44,76],[46,76],[48,78],[50,78],[44,84],[42,80],[40,76],[38,68],
  [40,44],[38,46],[36,40],[34,36],[32,36],[30,36],[28,34],[26,30],[25,30],
  [30,66],[32,70],[34,74],[36,72],[38,72],
  // Australia & Oceania
  [-12,132],[-14,130],[-16,132],[-18,130],[-20,130],[-22,132],[-24,132],
  [-14,136],[-16,136],[-18,136],[-20,138],[-22,140],[-24,140],[-26,140],
  [-28,140],[-30,140],[-32,142],[-34,142],[-36,142],[-36,144],[-37,145],
  [-38,144],[-38,146],[-36,148],[-34,150],[-32,150],[-30,148],[-28,148],
  [-26,148],[-24,146],[-22,148],[-18,146],[-16,146],[-14,144],[-12,142],
  [-10,142],[-20,122],[-22,114],[-24,114],[-26,114],[-28,114],[-30,116],
  [-32,116],[-32,118],[-34,118],[-36,118],[-30,120],[-28,120],[-26,118],
  [-24,118],[-22,116],[-20,118],[-18,122],[-16,124],[-14,128],[-12,132],
  [-20,124],[-22,120],[-24,122],[-26,120],[-28,122],[-30,124],[-32,122],
  [-34,122],[-34,116],[-36,116],[-28,126],[-26,126],[-24,128],[-22,128],
  [-20,128],[-22,124],[-20,126],[-18,128],[-38,178],[-36,174],[-36,176],
  [-38,176],[-40,176],[-41,174],[-42,172],[-44,170],[-45,170],
  [-18,178],[-16,180],[-14,172],[-18,184],[-12,184],[-10,182],[-8,158],
  [-10,162],[-6,156],[-4,152],[-6,148],[-4,144],[-6,140],[-8,138],
  [-10,150],[-12,154],[-14,166],[-16,168],[-20,166],[-22,168],
];

// Hub cities for animated ping markers
const HUB_CITIES: [number, number][] = [
  [40.7, -74.0],  // New York
  [51.5,  -0.1],  // London
  [48.9,   2.3],  // Paris
  [52.5,  13.4],  // Berlin
  [55.8,  37.6],  // Moscow
  [25.2,  55.3],  // Dubai
  [19.1,  72.9],  // Mumbai
  [28.6,  77.2],  // Delhi
  [31.2, 121.5],  // Shanghai
  [35.7, 139.7],  // Tokyo
  [37.6, 127.0],  // Seoul
  [ 1.3, 103.8],  // Singapore
  [-33.9, 151.2], // Sydney
  [-23.5, -46.6], // Sao Paulo
  [34.1, -118.2], // Los Angeles
  [41.9,  -87.6], // Chicago
  [-33.9,  18.4], // Cape Town
  [-1.3,   36.8], // Nairobi
  [ 6.5,    3.4], // Lagos
  [30.1,   31.2], // Cairo
];

// Flight routes (indices into HUB_CITIES)
const FLIGHT_ROUTES: [number, number][] = [
  [0,  1],  // NY - London
  [1,  5],  // London - Dubai
  [5,  9],  // Dubai - Tokyo
  [11,12],  // Singapore - Sydney
  [14, 9],  // LA - Tokyo
  [3,  6],  // Berlin - Mumbai
  [7,  8],  // Delhi - Shanghai
  [2, 15],  // Paris - Chicago
  [16, 1],  // Cape Town - London
  [17, 5],  // Nairobi - Dubai
  [13, 2],  // Sao Paulo - Paris
  [10, 9],  // Seoul - Tokyo
  [0, 14],  // NY - LA
  [8, 11],  // Shanghai - Singapore
  [19, 5],  // Cairo - Dubai
  [18,17],  // Lagos - Nairobi
  [6, 11],  // Mumbai - Singapore
];

// ─────────────────────────────────────────────────────────────────────────────
// Three.js helpers
// ─────────────────────────────────────────────────────────────────────────────

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildDotGlobe(radius: number): THREE.Points {
  const positions: number[] = [];
  const colors:    number[] = [];
  const aqua = new THREE.Color(KAIVO_COLORS.aqua);
  const lime = new THREE.Color(KAIVO_COLORS.lime);

  CONTINENT_SEEDS.forEach(([lat, lon], i) => {
    for (let j = 0; j < 7; j++) {
      const jLat = lat + (Math.random() - 0.5) * 5;
      const jLon = lon + (Math.random() - 0.5) * 5;
      const v = latLonToVector3(jLat, jLon, radius);
      positions.push(v.x, v.y, v.z);
      const isLime = (i * 17 + j * 7) % 41 === 0;
      const c = isLime ? lime : aqua;
      colors.push(c.r, c.g, c.b);
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: radius * 0.016,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    sizeAttenuation: true,
    depthWrite: false,
  }));
}

function buildHubDots(radius: number): THREE.Points {
  const positions: number[] = [];
  const colors:    number[] = [];
  const lime = new THREE.Color(KAIVO_COLORS.lime);

  HUB_CITIES.forEach(([lat, lon]) => {
    const v = latLonToVector3(lat, lon, radius * 1.003);
    positions.push(v.x, v.y, v.z);
    colors.push(lime.r, lime.g, lime.b);
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));

  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: radius * 0.032,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    sizeAttenuation: true,
    depthWrite: false,
  }));
}

function buildCoreSphere(radius: number): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.95, 64, 40),
    new THREE.MeshStandardMaterial({ color: 0x0c3230, roughness: 0.88, metalness: 0.08 })
  );
}

function buildWireframe(radius: number): THREE.LineSegments {
  const geo   = new THREE.SphereGeometry(radius, 32, 20);
  const edges = new THREE.EdgesGeometry(geo, 1);
  return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: KAIVO_COLORS.aqua,
    transparent: true,
    opacity: 0.07,
  }));
}

function buildSprite(canvas: HTMLCanvasElement, scaleR: number): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scaleR, scaleR, 1);
  return sprite;
}

function buildAtmosphereGlow(radius: number): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(256, 256, 60, 256, 256, 256);
  g.addColorStop(0.0,  "rgba(169,229,224,0.00)");
  g.addColorStop(0.55, "rgba(169,229,224,0.22)");
  g.addColorStop(0.72, "rgba(169,229,224,0.45)");
  g.addColorStop(0.82, "rgba(169,229,224,0.18)");
  g.addColorStop(1.0,  "rgba(169,229,224,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  return buildSprite(c, radius * 2.9);
}

function buildCoreGlow(radius: number): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0.0,  "rgba(169,229,224,0.50)");
  g.addColorStop(0.35, "rgba(169,229,224,0.20)");
  g.addColorStop(0.65, "rgba(169,229,224,0.06)");
  g.addColorStop(1.0,  "rgba(169,229,224,0.00)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return buildSprite(c, radius * 2.4);
}

function buildPingSprite(radius: number): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(32, 32, 24, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(212,225,87,0.9)";
  ctx.lineWidth   = 4;
  ctx.stroke();
  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(radius * 0.09, radius * 0.09, 1);
  return s;
}

// ── Flight-path connection arcs ────────────────────────────────────────────
// Builds the great-circle-ish bezier curve that lifts off the globe surface
// between two lat/lon points, used both for the static line and for sampling
// the position of the traveling "flight" dot along the route.
function buildArcCurve(
  from: [number, number],
  to:   [number, number],
  radius: number
): THREE.QuadraticBezierCurve3 {
  const sv = latLonToVector3(from[0], from[1], radius);
  const ev = latLonToVector3(to[0],   to[1],   radius);
  const chord = sv.distanceTo(ev);
  // Taller lift than a flat surface line so the connection reads clearly
  // as an arc looping above the globe, similar to a flight path.
  const lift = 1 + chord / (radius * 1.25);
  const mid  = sv.clone().add(ev).multiplyScalar(0.5).normalize().multiplyScalar(radius * lift);
  return new THREE.QuadraticBezierCurve3(sv, mid, ev);
}

interface ArcLineData {
  line:      THREE.Line;
  colorAttr: THREE.Float32BufferAttribute;
  numPoints: number;
}

// Builds the visible arc line. Vertex colors carry a dim "always on" base
// brightness (so the route is faintly visible as a connection) which then
// gets brightened frame-by-frame around the traveling dot's position to
// create a flowing light effect along the path.
function buildArcLine(curve: THREE.QuadraticBezierCurve3, segments = 64): ArcLineData {
  const pts = curve.getPoints(segments);
  const positions = new Float32Array(pts.length * 3);
  const colors    = new Float32Array(pts.length * 3);
  const potato    = new THREE.Color(KAIVO_COLORS.potato);
  const baseBrightness = 0.12;

  pts.forEach((p, i) => {
    positions[i * 3]     = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    colors[i * 3]     = potato.r * baseBrightness;
    colors[i * 3 + 1] = potato.g * baseBrightness;
    colors[i * 3 + 2] = potato.b * baseBrightness;
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const colorAttr = new THREE.Float32BufferAttribute(colors, 3);
  geo.setAttribute("color", colorAttr);

  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent:  true,
    opacity:      0.85,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
  }));

  return { line, colorAttr, numPoints: pts.length };
}

// Small glowing dot sprite used as the "flight" traveling between two hubs.
function buildGlowDot(radius: number, hex: number): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const col = new THREE.Color(hex);
  const rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0.0,  `rgba(${rgb},1)`);
  g.addColorStop(0.25, `rgba(${rgb},0.85)`);
  g.addColorStop(0.6,  `rgba(${rgb},0.18)`);
  g.addColorStop(1.0,  `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(radius * 0.085, radius * 0.085, 1);
  return s;
}

interface Traveler {
  curve:     THREE.QuadraticBezierCurve3;
  colorAttr: THREE.Float32BufferAttribute;
  numPoints: number;
  dot:       THREE.Sprite;
  phase:     number;
  speed:     number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface GlobeAnimationProps {
  size?:          number;
  rotationSpeed?: number;
  className?:     string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function GlobeAnimation({
  size          = 0.62,
  rotationSpeed = 0.0009,
  className,
}: GlobeAnimationProps) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Three.js globe
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Mutable handles to whichever camera/renderer are currently live, so
    // the resize handler below can update them smoothly without needing
    // to wait for a full rebuild.
    let activeCamera:   THREE.PerspectiveCamera | null = null;
    let activeRenderer: THREE.WebGLRenderer     | null = null;
    let cleanupScene:    (() => void) | null = null;
    let builtWidth  = 0;
    let builtHeight = 0;

    // Builds (or rebuilds) the entire scene at a given container size.
    // Re-running this on meaningful resizes — not just nudging the camera
    // aspect — is what keeps the globe correctly proportioned on every
    // screen size, including live window resizes and device rotation.
    const buildScene = (width: number, height: number): (() => void) => {
      builtWidth  = width;
      builtHeight = height;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height || 1, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width || 1, height || 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      activeCamera   = camera;
      activeRenderer = renderer;

      // Radius — derived from the container's actual rendered size, with a
      // small boost on narrow viewports so the globe doesn't read as tiny
      // once side padding eats into the available width on phones.
      const vFov = (camera.fov * Math.PI) / 180;
      const visH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const visW = visH * ((width > 0 && height > 0) ? width / height : 1);
      const responsiveBoost = width < 480 ? 1.25 : width < 900 ? 1.1 : 1;
      const radius = (Math.min(visH, visW) / 2) * size * responsiveBoost;

      // Globe group
      const group = new THREE.Group();

      const atmosGlow = buildAtmosphereGlow(radius);
      const coreGlow  = buildCoreGlow(radius);
      const core      = buildCoreSphere(radius);
      const wireframe = buildWireframe(radius);
      const dots      = buildDotGlobe(radius);
      const hubDots   = buildHubDots(radius);
      group.add(atmosGlow, coreGlow, core, wireframe, dots, hubDots);

      // Arcs + traveling flight connections
      const arcsGroup = new THREE.Group();
      const travelers: Traveler[] = [];
      const potatoColor = new THREE.Color(KAIVO_COLORS.potato);

      FLIGHT_ROUTES.forEach(([a, b]) => {
        const curve = buildArcCurve(HUB_CITIES[a], HUB_CITIES[b], radius * 1.01);
        const { line, colorAttr, numPoints } = buildArcLine(curve);
        arcsGroup.add(line);

        const dot = buildGlowDot(radius, KAIVO_COLORS.lime);
        group.add(dot);

        travelers.push({
          curve,
          colorAttr,
          numPoints,
          dot,
          phase: Math.random(),
          speed: 0.16 + Math.random() * 0.10,
        });
      });
      group.add(arcsGroup);

      // Ping rings
      const pings: { sprite: THREE.Sprite; lat: number; lon: number; phase: number }[] = [];
      HUB_CITIES.forEach(([lat, lon], i) => {
        const sprite = buildPingSprite(radius);
        sprite.position.copy(latLonToVector3(lat, lon, radius * 1.025));
        group.add(sprite);
        pings.push({ sprite, lat, lon, phase: (i / HUB_CITIES.length) * Math.PI * 2 });
      });

      scene.add(group);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const key = new THREE.DirectionalLight(0xa9e5e0, 1.4);
      key.position.set(5, 3, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xe2725b, 0.4);
      rim.position.set(-5, -2, -4);
      scene.add(rim);
      const fill = new THREE.DirectionalLight(0xd4e157, 0.15);
      fill.position.set(0, 5, -4);
      scene.add(fill);

      // Animate
      let frameId = 0;
      let tick = 0;
      const sigma = 0.07; // width of the traveling glow highlight along each arc

      const animate = () => {
        tick += 0.012;
        group.rotation.y += rotationSpeed;

        // Traveling flight connections: brighten a moving window of each
        // arc's vertex colors, and slide a glowing dot along the same curve,
        // so each connection visibly travels from one location to the other.
        travelers.forEach(({ curve, colorAttr, numPoints, dot, phase, speed }) => {
          const headT = (tick * speed + phase) % 1;

          const arr = colorAttr.array as Float32Array;
          for (let i = 0; i < numPoints; i++) {
            const u = i / (numPoints - 1);
            const d = u - headT;
            const intensity = Math.exp(-(d * d) / (2 * sigma * sigma));
            const brightness = Math.min(1, 0.12 + intensity * 0.95);
            arr[i * 3]     = potatoColor.r * brightness;
            arr[i * 3 + 1] = potatoColor.g * brightness;
            arr[i * 3 + 2] = potatoColor.b * brightness;
          }
          colorAttr.needsUpdate = true;

          const p = curve.getPoint(Math.min(headT, 0.999));
          dot.position.copy(p);
          const fade = Math.min(1, Math.max(0, Math.sin(headT * Math.PI) * 1.4));
          (dot.material as THREE.SpriteMaterial).opacity = fade;
        });

        // Ping rings
        pings.forEach(({ sprite, lat, lon, phase }) => {
          const t   = ((tick * 0.5 + phase) % (Math.PI * 2)) / (Math.PI * 2);
          const sc  = radius * (0.08 + t * 0.18);
          sprite.scale.set(sc, sc, 1);
          (sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, 0.9 - t * 1.2);
          sprite.position.copy(latLonToVector3(lat, lon, radius * 1.025));
        });

        // Atmosphere pulse
        (atmosGlow.material as THREE.SpriteMaterial).opacity = 0.85 + Math.sin(tick * 0.4) * 0.12;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        cancelAnimationFrame(frameId);
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        [dots, hubDots, wireframe, core].forEach(obj => {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        });
        arcsGroup.children.forEach(c => {
          const l = c as THREE.Line;
          l.geometry.dispose();
          (l.material as THREE.Material).dispose();
        });
        travelers.forEach(({ dot }) => {
          const mat = dot.material as THREE.SpriteMaterial;
          mat.map?.dispose();
          mat.dispose();
        });
        pings.forEach(({ sprite }) => (sprite.material as THREE.Material).dispose());
        (atmosGlow.material as THREE.Material).dispose();
        (coreGlow  as THREE.Sprite).material.dispose();
        renderer.dispose();
        if (activeRenderer === renderer) {
          activeRenderer = null;
          activeCamera   = null;
        }
      };
    };

    // Initial build at the container's current size
    cleanupScene = buildScene(mount.clientWidth || 1, mount.clientHeight || 1);

    // On resize: update the live camera/renderer immediately so dragging a
    // window edge (or the keyboard opening on mobile) never looks stretched,
    // then — once the resize has settled and the change is big enough to
    // throw off the globe's proportions (device rotation, maximizing the
    // window, etc.) — fully rebuild the globe at the new size.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (w <= 0 || h <= 0) return;

      if (activeCamera && activeRenderer) {
        activeCamera.aspect = w / h;
        activeCamera.updateProjectionMatrix();
        activeRenderer.setSize(w, h);
      }

      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const widthChanged  = Math.abs(w - builtWidth)  / (builtWidth  || 1) > 0.08;
        const heightChanged = Math.abs(h - builtHeight) / (builtHeight || 1) > 0.08;
        if (widthChanged || heightChanged) {
          cleanupScene?.();
          cleanupScene = buildScene(w, h);
        }
      }, 220);
    });
    ro.observe(mount);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      cleanupScene?.();
    };
  }, [size, rotationSpeed]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        position:       "relative",
        width:          "100%",
        minHeight:      "100vh",
        overflow:       "hidden",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background: `
          radial-gradient(circle at 50% 40%, rgba(169,229,224,0.11) 0%, rgba(169,229,224,0.03) 38%, transparent 62%),
          radial-gradient(circle at 80% 88%, rgba(226,114,91,0.10) 0%, transparent 44%),
          radial-gradient(circle at 18% 80%, rgba(212,225,87,0.05) 0%, transparent 36%),
          linear-gradient(180deg, #0e3534 0%, #0b2b2b 50%, #071e1e 100%)
        `,
        fontFamily: "'Inter','Helvetica Neue',sans-serif",
      }}
    >

      {/* ── Grain texture overlay ── */}
      <div aria-hidden="true" style={{
        position:    "absolute",
        inset:       0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        opacity:     0.35,
        pointerEvents: "none",
        zIndex:      1,
      }} />

      {/* ── KAIVO watermark — centred, behind globe ── */}
      <div aria-hidden="true" style={{
        position:      "absolute",
        top:           "50%",
        left:          "50%",
        transform:     "translate(-50%, -50%)",
        zIndex:        2,
        whiteSpace:    "nowrap",
        userSelect:    "none",
        pointerEvents: "none",
        lineHeight:    1,
      }}>
        <span style={{
          fontSize:              "clamp(64px, 22vw, 310px)",
          fontWeight:            900,
          letterSpacing:         "-0.02em",
          color:                 "transparent",
          WebkitTextStroke:      "1px rgba(169,229,224,0.13)",
          background:            "linear-gradient(180deg, rgba(169,229,224,0.20) 0%, rgba(169,229,224,0.05) 55%, transparent 100%)",
          WebkitBackgroundClip:  "text",
          backgroundClip:        "text",
          display:               "block",
        }}>
          KAIVO
        </span>
      </div>

      {/* ── Eyebrow label ── */}
      <div style={{
        position:  "absolute",
        top:       "clamp(20px, 5vh, 52px)",
        left:      "50%",
        zIndex:    10,
        display:   "flex",
        alignItems: "center",
        gap:       "clamp(6px, 1.5vw, 10px)",
        padding:   "0 16px",
        maxWidth:  "100%",
        opacity:    visible ? 1 : 0,
        transform:  visible
          ? "translateX(-50%) translateY(0px)"
          : "translateX(-50%) translateY(28px)",
        transition: "opacity 0.9s ease 0.05s, transform 0.9s ease 0.05s",
      }}>
        <span style={{ display:"inline-block", width:"clamp(18px, 8vw, 36px)", height:"1px", background:"#A9E5E0", opacity:0.5, flexShrink: 0 }} />
        <span style={{
          fontSize:      "clamp(9px, 2.4vw, 11px)",
          fontWeight:    600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color:         "#A9E5E0",
          opacity:       0.7,
          whiteSpace:    "nowrap",
        }}>Global Presence</span>
        <span style={{ display:"inline-block", width:"clamp(18px, 8vw, 36px)", height:"1px", background:"#A9E5E0", opacity:0.5, flexShrink: 0 }} />
      </div>

      {/* ── Globe canvas + overlaid headline, grouped together so the
             text always lands in the same spot on the globe — a fixed
             percentage of the globe's own box — instead of a fixed
             percentage of the whole section, which drifted apart on
             screens with a different height than the one it was tuned
             on. ── */}
      <div style={{
        position: "relative",
        width:    "100%",
        height:   "clamp(360px, 88vh, 840px)",
      }}>

        {/* Three.js Globe canvas */}
        <div
          ref={mountRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset:    0,
            zIndex:   3,
          }}
        />

        {/* Headline + Tagline */}
        <div style={{
          position:  "absolute",
          bottom:    "clamp(36px, 12%, 160px)",
          left:      "50%",
          transform: visible
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(28px)",
          opacity:    visible ? 1 : 0,
          transition: "opacity 1s ease 0.35s, transform 1s ease 0.35s",
          zIndex:    10,
          textAlign: "center",
          padding:   "0 20px",
          maxWidth:  "680px",
          width:     "100%",
          boxSizing: "border-box",
        }}>

          {/* Headline */}
          <h2 style={{
            margin:        "0 0 14px",
            fontSize:      "clamp(24px, 6vw, 54px)",
            fontWeight:    800,
            lineHeight:    1.1,
            letterSpacing: "-0.025em",
            color:         "#ffffff",
          }}>
            Exploring Destinations{" "}
            <span style={{
              color: "#D4E157",
            }}>
              Worldwide
            </span>
          </h2>

          {/* Tagline */}
          <p style={{
            margin:      "0 0 30px",
            fontSize:    "clamp(13px, 2vw, 17px)",
            fontWeight:  400,
            lineHeight:  1.7,
            color:       "rgba(255, 255, 255, 0.68)",
            maxWidth:    "500px",
            marginLeft:  "auto",
            marginRight: "auto",
          }}>
            Kaivo helps you discover the best flights, compare fares, and book your next adventure with confidence. Travel smarter, faster, and hassle-free.
          </p>

        </div>
      </div>

      {/* ── Bottom gradient rule ── */}
      <div aria-hidden="true" style={{
        position:   "absolute",
        bottom:     0,
        left:       0,
        right:      0,
        height:     "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(169,229,224,0.18) 30%, rgba(212,225,87,0.22) 50%, rgba(169,229,224,0.18) 70%, transparent 100%)",
        zIndex:     10,
      }} />

    </section>
  );
}
