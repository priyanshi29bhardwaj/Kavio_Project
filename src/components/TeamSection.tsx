import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Logo {
  src: string;
  alt: string;
}

interface Member {
  name: string;
  role: string;
  image: string | null;
  logos: Logo[];
  linkedin: string | null;
  bio: string;
}

const TEAM: Member[] = [
  {
    name: "Aragon M. v. B. Brettschneider",
    role: "CEO",
    image: "/aragon.png",
    logos: [
      { src: "/rocket-logo.webp", alt: "Rocket Internet" },
      { src: "/accenture.webp",   alt: "Accenture" },
    ],
    linkedin: "https://www.linkedin.com/in/aragonbrettschneider",
    bio: "Aragon brings a rare combination of entrepreneurial hustle and management consulting rigour. He led digital venture building at Rocket Internet, scaling startups across emerging markets in record time. At Accenture, he advised Fortune 500 companies on AI-driven digital transformation. Aragon founded Kaivo with a firm belief: booking a flight should take 60 seconds, not 60 minutes.",
  },
  {
    name: "Davide Nuessle",
    role: "COO",
    image: "/davide.png",
    logos: [
      { src: "/bain-and-company.webp", alt: "Bain & Company" },
      { src: "/blackrock-logo.webp",   alt: "BlackRock" },
    ],
    linkedin: "https://www.linkedin.com/in/davide-nuessle-b82860174/",
    bio: "Davide is the operational backbone of Kaivo. A strategy consultant at Bain & Company, he worked with leading travel and transportation companies on growth and efficiency. At BlackRock, he managed global investment portfolios and built rigorous analytical frameworks. At Kaivo, he ensures the platform runs — flawlessly, every day.",
  },
  {
    name: "Claire Cairns",
    role: "CMO",
    image: "/claire.png",
    logos: [
      { src: "/uber-logo.webp",       alt: "Uber" },
      { src: "/ibm-logo-18910.png",   alt: "IBM" },
    ],
    linkedin: "https://www.linkedin.com/in/clairecblockchain/",
    bio: "Claire has spent her career making complex technology feel effortless to everyday consumers. At Uber, she led growth marketing across 40+ cities, turning a novel concept into a global daily habit. At IBM, she drove go-to-market for AI-powered enterprise products. At Kaivo, she's defining what it means for millions of travellers to trust an AI agent with their next journey.",
  },
  {
    name: "Julian Mick",
    role: "CFO",
    image: "/julian.png",
    logos: [
      { src: "/thi-logo.webp", alt: "THI Investments" },
      { src: "/barclays.png",  alt: "Barclays" },
    ],
    linkedin: "https://www.linkedin.com/in/julianmick",
    bio: "Julian brings the financial discipline of global capital markets to Kaivo. At THI Investments, he backed 20+ high-growth technology companies across Europe and North America. At Barclays, he structured complex cross-border financial instruments and managed institutional relationships. At Kaivo, he's building the financial architecture for a new category of travel commerce.",
  },
  {
    name: "Michael Clark",
    role: "CPO",
    image: null,
    logos: [],
    linkedin: null,
    bio: "Michael brings deep product leadership from the world's most trusted financial platforms. At Mastercard, he led innovation across payment and loyalty products touching hundreds of millions of cardholders globally. At JP Morgan, he shaped platform product strategy at the intersection of fintech and enterprise software. At Kaivo, he's designing the AI-native product experience that makes delegation feel completely effortless.",
  },
];

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TeamCard({ member, delay }: { member: Member; delay: number }) {
  const [bioOpen, setBioOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const bioRef  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay,
          scrollTrigger: { trigger: cardRef.current, start: "top 88%" } }
      );
    });
    return () => ctx.revert();
  }, [delay]);

  useLayoutEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    if (bioOpen) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power2.in" });
    }
  }, [bioOpen]);

  const initials = member.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join("");

  return (
    <div
      ref={cardRef}
      className="team-card"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(27,74,90,0.12)",
        boxShadow: "0 4px 24px rgba(27,74,90,0.07)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Photo — tall enough to show full face + shoulders */}
      <div style={{ height: "300px", overflow: "hidden", background: "#dde8ec", flexShrink: 0 }}>
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "center 15%",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #ccdde4 0%, #b8cdd6 100%)",
          }}>
            <span style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 900, fontSize: "72px",
              color: "rgba(27,74,90,0.20)",
              letterSpacing: "-0.03em",
            }}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "24px 26px 28px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Role */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "16px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#1B4A5A",
          marginBottom: "8px",
        }}>
          {member.role}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Urbanist', sans-serif",
          fontWeight: 800, fontSize: "20px",
          lineHeight: 1.2, color: "#1B4A5A",
          marginBottom: "16px",
        }}>
          {member.name}
        </div>

        {/* Company logos */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px", minHeight: "32px" }}>
          {member.logos.length > 0 ? (
            member.logos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: logo.alt === "THI Investments" ? "52px" : "36px",
                  width: "auto",
                  maxWidth: logo.alt === "THI Investments" ? "160px" : "120px",
                  objectFit: "contain",
                  opacity: 1,
                  filter: logo.alt === "THI Investments" ? "brightness(0)" : "none",
                }}
              />
            ))
          ) : (
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase",
              color: "#1B4A5A", opacity: 0.55,
            }}>
              Mastercard · JP Morgan
            </span>
          )}
        </div>

        {/* Divider + Read Bio / LinkedIn */}
        <div style={{
          marginTop: "auto",
          paddingTop: "16px",
          borderTop: "1px solid rgba(27,74,90,0.09)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button
            onClick={() => setBioOpen(v => !v)}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#1B4A5A",
              transition: "opacity 0.2s",
              fontWeight: 700,
              opacity: bioOpen ? 1 : 0.75,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = bioOpen ? "1" : "0.75"; }}
          >
            {bioOpen ? "Close ↑" : "Read Bio ↓"}
          </button>

          {member.linkedin && (
            <a
              href={member.linkedin} target="_blank" rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              style={{ color: "#1B4A5A", display: "flex", alignItems: "center", transition: "opacity 0.2s", opacity: 1 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <LinkedInIcon size={22} />
            </a>
          )}
        </div>

        {/* Inline bio — slides open below */}
        <div ref={bioRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
          <div style={{
            paddingTop: "18px",
            marginTop: "16px",
            borderTop: "1px solid rgba(27,74,90,0.07)",
          }}>
            <p style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: "15px", lineHeight: 1.80,
              color: "#1B4A5A",
              margin: "0 0 18px",
            }}>
              {member.bio}
            </p>
            {member.linkedin && (
              <a
                href={member.linkedin} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase",
                  fontWeight: 600, color: "#1B4A5A", textDecoration: "none",
                  border: "1px solid rgba(27,74,90,0.28)", padding: "8px 18px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(27,74,90,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <LinkedInIcon size={13} /> View LinkedIn
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [eyebrowRef.current, headRef.current],
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.13,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const row1 = TEAM.slice(0, 3);
  const row2 = TEAM.slice(3);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#edf2f4",
        paddingBottom: "clamp(80px, 10vh, 130px)",
      }}
    >
      {/* ── Dark-to-light transition strip — blends with DelegationSection ── */}
      <div style={{
        width: "100%",
        height: "120px",
        background: "linear-gradient(to bottom, #0c1e2c 0%, #edf2f4 100%)",
        marginBottom: "0",
      }} />

      <div style={{ padding: "0 clamp(20px, 5vw, 60px)" }}>
        {/* ── Header ── */}
        <div style={{ maxWidth: "1160px", margin: "0 auto 64px", textAlign: "center" }}>
          <div
            ref={eyebrowRef}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              border: "1.5px solid rgba(27,74,90,0.18)",
              borderRadius: "100px",
              padding: "7px 18px",
              marginBottom: "18px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <circle cx="4.5" cy="4" r="2" stroke="rgba(27,74,90,0.45)" strokeWidth="1.2"/>
              <circle cx="8" cy="4" r="2" stroke="rgba(27,74,90,0.45)" strokeWidth="1.2"/>
              <path d="M1.5 10c0-1.66 1.34-3 3-3h3c1.66 0 3 1.34 3 3"
                stroke="rgba(27,74,90,0.45)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "10px",
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: "rgba(27,74,90,0.55)",
            }}>Team</span>
          </div>

          <h2
            ref={headRef}
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 5.5vw, 72px)",
              lineHeight: 1.04, color: "#1B4A5A", margin: 0,
            }}
          >
            The team building Kaivo
          </h2>
        </div>

        {/* ── Row 1: 3 cards ── */}
        <div className="team-row" style={{ marginBottom: "24px" }}>
          {row1.map((m, i) => <TeamCard key={m.name} member={m} delay={i * 0.08} />)}
        </div>

        {/* ── Row 2: 2 cards centred ── */}
        <div className="team-row">
          {row2.map((m, i) => <TeamCard key={m.name} member={m} delay={(3 + i) * 0.08} />)}
        </div>
      </div>
    </section>
  );
}
