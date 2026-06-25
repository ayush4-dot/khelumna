"use client";

import { useState } from "react";

const globalStyles = `
  @keyframes rotateBall {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbitPlane {
    from { transform: rotateX(70deg) rotateY(-10deg) rotateZ(0deg); }
    to   { transform: rotateX(70deg) rotateY(-10deg) rotateZ(360deg); }
  }
  @keyframes cricketSpin {
    from { transform: rotateZ(0deg); }
    to   { transform: rotateZ(-360deg); }
  }
  @keyframes haloPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.1); }
  }
  @keyframes ballDepth {
    0%   { transform: translateX(-50%) rotateZ(0deg)    rotateX(-70deg) scale(0.65); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8)); }
    25%  { transform: translateX(-50%) rotateZ(-90deg)  rotateX(-70deg) scale(1.15); filter: drop-shadow(0 25px 25px rgba(222,49,99,0.65)); }
    50%  { transform: translateX(-50%) rotateZ(-180deg) rotateX(-70deg) scale(0.65); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8)); }
    75%  { transform: translateX(-50%) rotateZ(-270deg) rotateX(-70deg) scale(0.45); filter: drop-shadow(0 2px 3px rgba(0,0,0,0.9)); }
    100% { transform: translateX(-50%) rotateZ(-360deg) rotateX(-70deg) scale(0.65); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8)); }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── NAVBAR ── */
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 80px;
    gap: 16px;
  }
  .nav-links { display: flex; gap: 40px; }
  .nav-cta   { display: flex; align-items: center; background: rgba(30,41,59,0.08); padding: 4px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.3); }
  .hamburger { display: none; background: transparent; border: none; cursor: pointer; font-size: 24px; color: #1e293b; }
  .mobile-menu { display: none; flex-direction: column; gap: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.4); }
  .mobile-menu a { display: block; padding: 14px 24px; font-size: 15px; font-weight: 600; color: #1e293b; text-decoration: none; border-top: 1px solid rgba(0,0,0,0.06); }
  .mobile-menu-open { display: flex !important; }

  /* ── HERO ── */
  .hero-inner {
    display: flex;
    align-items: center;
    min-height: 90vh;
    padding: 40px 80px;
    gap: 40px;
    position: relative;
    z-index: 1;
  }
  .hero-ball {
    position: absolute;
    right: 4%;
    top: 50%;
    transform: translateY(-50%);
    width: clamp(260px, 38vw, 460px);
    height: clamp(260px, 38vw, 460px);
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1000px;
    flex-shrink: 0;
  }

  /* ── SECTIONS ── */
  .section-pad { padding: 80px 48px; }
  .section-pad-sm { padding: 64px 48px; }
  .sports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    max-width: 960px;
    margin: 0 auto;
  }
  .how-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
    max-width: 960px;
    margin: 0 auto;
  }
  .matches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 32px;
    max-width: 800px;
    margin: 0 auto;
  }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .nav-inner   { padding: 14px 20px; }
    .nav-links   { display: none; }
    .nav-cta     { display: none; }
    .hamburger   { display: block; }

    .hero-inner  {
      flex-direction: column;
      align-items: flex-start;
      padding: 24px 20px 280px;
      min-height: unset;
    }
    .hero-ball {
      position: absolute;
      right: 50%;
      transform: translateX(50%);
      bottom: 10px;
      top: unset;
      width: 240px;
      height: 240px;
    }

    .section-pad    { padding: 48px 20px; }
    .section-pad-sm { padding: 40px 20px; }

    .sports-grid  { grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .how-grid     { grid-template-columns: 1fr 1fr; gap: 14px; }
    .matches-grid { grid-template-columns: 1fr; }
    .stats-grid   { grid-template-columns: repeat(2, 1fr); gap: 24px; }

    .hero-card    { margin: 0 !important; max-width: 100% !important; }
    .cta-card     { padding: 32px 20px !important; }
    .matches-header { flex-direction: column; align-items: flex-start !important; }

    .hero-h1      { font-size: 32px !important; letter-spacing: -1px !important; }
    .section-h2   { font-size: 26px !important; }
    .cta-h2       { font-size: 28px !important; }
  }

  @media (max-width: 480px) {
    .sports-grid { grid-template-columns: repeat(2, 1fr); }
    .how-grid    { grid-template-columns: 1fr; }
  }
`;

const NAV_LINKS = ["Home", "Discover", "Host event", "League", "My card"];

const SPORTS = [
  { name: "Football", emoji: "⚽" },
  { name: "Cricket", emoji: "🏏" },
  { name: "Basketball", emoji: "🏀" },
  { name: "Volleyball", emoji: "🏐" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Tennis", emoji: "🎾" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Discover", desc: "Find matches and players near you.", icon: "📍" },
  { step: 2, title: "Join", desc: "Join games with a single click.", icon: "👥" },
  { step: 3, title: "Play", desc: "Play, compete and build lasting friendships.", icon: "🏆" },
  { step: 4, title: "Host", desc: "Create your own event and invite players.", icon: "🎯" },
];

const MATCHES = [
  { sport: "FOOTBALL", sportColor: "#22c55e", title: "Kathmandu Football League", date: "Sat, 25 May • 6:00 PM", venue: "Dasharath Stadium", players: 24, bg: "linear-gradient(135deg,#1a2a1a,#0f1f0f)" },
  { sport: "CRICKET", sportColor: "#f97316", title: "Weekend Cricket Cup", date: "Sun, 26 May • 9:00 AM", venue: "TU Cricket Ground", players: 18, bg: "linear-gradient(135deg,#2a1a0f,#1f0f0a)" },
  { sport: "BASKETBALL", sportColor: "#f59e0b", title: "Hoops Night", date: "Fri, 24 May • 7:00 PM", venue: "Golden Gate Court", players: 12, bg: "linear-gradient(135deg,#1a1a2a,#0f0f1f)" },
];

const STATS = [
  { icon: "👤", value: "1200+", label: "Active Players" },
  { icon: "🏆", value: "500+", label: "Games Hosted" },
  { icon: "🏅", value: "25+", label: "Sports" },
  { icon: "📍", value: "30+", label: "Cities" },
];

export default function Home() {
  const [activeSport, setActiveSport] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      background: "url('/back.avif') center/cover no-repeat fixed",
      color: "#1e293b",
      fontFamily: "'Inter','Segoe UI',system-ui,-apple-system,sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{globalStyles}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: "rgba(255,255,255,0.4)",
        backdropFilter: "blur(32px) saturate(150%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.5)",
      }}>
        <div className="nav-inner">
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>Khelum</span>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#de3163" }}> Na.</span>
          </div>

          {/* Desktop links */}
          <div className="nav-links">
            {NAV_LINKS.map((link, i) => (
              <a key={link} href="#" style={{
                color: i === 0 ? "#de3163" : "#1e293b",
                textDecoration: "none", fontSize: "15px", fontWeight: 600,
              }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#de3163")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = i === 0 ? "#de3163" : "#1e293b")}
              >{link}</a>
            ))}
          </div>

          {/* Desktop CTA pill */}
          <div className="nav-cta">
            <button style={{ background: "#fff", border: "none", color: "#1e293b", padding: "8px 20px", borderRadius: "24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              Find game
            </button>
            <button style={{ background: "transparent", border: "none", color: "#1e293b", padding: "8px 20px", borderRadius: "24px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Host event
            </button>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? " mobile-menu-open" : ""}`}>
          {NAV_LINKS.map((link, i) => (
            <a key={link} href="#" style={{ color: i === 0 ? "#de3163" : "#1e293b" }}
              onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
          <div style={{ display: "flex", gap: "10px", padding: "14px 24px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <button style={{ flex: 1, background: "#de3163", border: "none", color: "#fff", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              Find game
            </button>
            <button style={{ flex: 1, background: "rgba(30,41,59,0.08)", border: "none", color: "#1e293b", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Host event
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        {/* Subtle overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.15)", zIndex: 0, pointerEvents: "none" }} />

        <div className="hero-inner">
          {/* Left card */}
          <div className="hero-card" style={{
            padding: "32px 36px", zIndex: 2, maxWidth: "520px",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(16px)",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            flexShrink: 0,
          }}>
            <h1 className="hero-h1" style={{
              fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 900,
              lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-1.5px",
            }}>
              Find your game.<br />
              <span style={{ color: "#de3163" }}>Show up and play.</span>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(30,41,59,0.85)", marginBottom: "24px", lineHeight: 1.6 }}>
              Anyone can organize or join real sports events nearby — football, basketball, volleyball and more. Book your slot in 30 seconds.
            </p>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <button style={{
                background: "#de3163", color: "#fff", border: "none",
                padding: "12px 22px", borderRadius: "10px", fontSize: "15px",
                fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(222,49,99,0.35)",
              }}>
                Find events →
              </button>
              <button style={{
                background: "rgba(30,41,59,0.08)", color: "#1e293b", border: "none",
                padding: "12px 22px", borderRadius: "10px", fontSize: "15px",
                fontWeight: 600, cursor: "pointer",
              }}>
                Host an event
              </button>
            </div>
          </div>

          {/* Football animation */}
          <div className="hero-ball">
            {/* Glow */}
            <div style={{
              position: "absolute", width: "220px", height: "220px", borderRadius: "50%",
              background: "radial-gradient(circle,rgba(222,49,99,0.3) 0%,transparent 65%)",
              filter: "blur(24px)", animation: "haloPulse 3s ease-in-out infinite", pointerEvents: "none",
            }} />
            {/* Orbit ring */}
            <div style={{
              position: "absolute", width: "90%", height: "90%", borderRadius: "50%",
              border: "1.5px dashed rgba(222,49,99,0.35)", transform: "rotateX(72deg)",
              pointerEvents: "none", zIndex: 1,
            }} />
            {/* Football */}
            <div style={{ position: "relative", zIndex: 2, width: "clamp(160px,22vw,230px)", height: "clamp(160px,22vw,230px)", borderRadius: "50%", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, animation: "rotateBall 5s linear infinite", transformOrigin: "center center" }}>
                <img src="/football.png?v=3" alt="Football" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            {/* Cricket ball orbit */}
            <div style={{ position: "absolute", inset: 0, perspective: "1200px", pointerEvents: "none", zIndex: 4 }}>
              <div style={{
                position: "absolute", width: "100%", height: "100%",
                transformStyle: "preserve-3d",
                transform: "rotateX(70deg) rotateY(-10deg)",
                animation: "orbitPlane 6s linear infinite",
              }}>
                <div style={{
                  position: "absolute", top: "-29px", left: "50%",
                  transformStyle: "preserve-3d",
                  animation: "ballDepth 6s linear infinite",
                }}>
                  <img src="/ball.png?v=1" alt="Cricket Ball" style={{
                    width: "48px", height: "48px", display: "block", borderRadius: "50%",
                    objectFit: "cover", animation: "cricketSpin 1.2s linear infinite",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHOOSE SPORT ── */}
      <section className="section-pad" style={{ background: "transparent" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ color: "#de3163", fontSize: "13px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>
            CHOOSE YOUR SPORT
          </p>
          <h2 className="section-h2" style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
            What do you want to play?
          </h2>
        </div>

        <div className="sports-grid">
          {SPORTS.map((sport, i) => (
            <button key={sport.name} onClick={() => setActiveSport(i)} style={{
              background: activeSport === i ? "rgba(222,49,99,0.15)" : "rgba(0,0,0,0.45)",
              border: activeSport === i ? "1.5px solid #de3163" : "1.5px solid rgba(0,0,0,0.25)",
              borderRadius: "16px", padding: "22px 12px 16px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              transition: "all 0.2s", color: "#fff",
            }}>
              <span style={{ fontSize: "36px" }}>{sport.emoji}</span>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{sport.name}</span>
              <span style={{
                width: "26px", height: "26px", borderRadius: "50%",
                border: `1.5px solid ${activeSport === i ? "#de3163" : "rgba(255,255,255,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", color: activeSport === i ? "#de3163" : "rgba(255,255,255,0.5)",
              }}>→</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad" style={{ background: "transparent" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{
            display: "inline-block", background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(16px)", color: "#de3163",
            fontSize: "14px", fontWeight: 700, letterSpacing: "1px",
            padding: "10px 28px", borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.3)",
          }}>
            Connect Through Sports
          </span>
        </div>

        <div className="how-grid">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} style={{
              background: "rgba(0,0,0,0.45)", border: "1px solid rgba(0,0,0,0.25)",
              borderRadius: "20px", padding: "28px 22px", color: "#fff",
            }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%", background: "#de3163",
                color: "#fff", fontWeight: 800, fontSize: "14px",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
              }}>{item.step}</div>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>{item.title}</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR MATCHES ── */}
      <section className="section-pad" style={{ background: "transparent" }}>
        <div className="matches-header" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: "28px", gap: "16px", flexWrap: "wrap",
        }}>
          <div>
            <p style={{ color: "#de3163", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>
              FEATURED THIS WEEK
            </p>
            <h2 className="section-h2" style={{ fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Popular Matches Near You
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {["←", "→"].map((a) => (
              <button key={a} style={{
                width: "38px", height: "38px", borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.15)",
                color: "#fff", cursor: "pointer", fontSize: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{a}</button>
            ))}
          </div>
        </div>

        <div className="matches-grid">
          {MATCHES.map((match) => (
            <div key={match.title} style={{
              background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,0,0,0.25)",
              borderRadius: "20px", overflow: "hidden", color: "#fff",
            }}>
              <div style={{
                height: "140px",
                background: `linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),${match.bg}`,
                position: "relative", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "56px",
              }}>
                {match.sport === "FOOTBALL" && "⚽"}
                {match.sport === "CRICKET" && "🏏"}
                {match.sport === "BASKETBALL" && "🏀"}
                <span style={{
                  position: "absolute", top: "10px", left: "10px",
                  background: match.sportColor, color: "#1e293b",
                  fontSize: "10px", fontWeight: 800, padding: "4px 10px",
                  borderRadius: "6px", letterSpacing: "1px",
                }}>{match.sport}</span>
              </div>
              <div style={{ padding: "18px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>{match.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "6px" }}>📅 {match.date}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 14px", display: "flex", alignItems: "center", gap: "6px" }}>📍 {match.venue}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex" }}>
                      {[0, 1].map((i) => (
                        <div key={i} style={{
                          width: "22px", height: "22px", borderRadius: "50%",
                          background: `hsl(${i * 80 + 200},60%,55%)`,
                          border: "2px solid #0d0d0d", marginLeft: i > 0 ? "-6px" : "0",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>+{match.players}</span>
                  </div>
                  <button style={{
                    background: "#de3163", border: "none", color: "#fff",
                    padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
                    fontWeight: 700, cursor: "pointer",
                  }}>Join Match</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-pad-sm" style={{
        background: "transparent",
        borderTop: "1px solid rgba(222,49,99,0.15)",
        borderBottom: "1px solid rgba(222,49,99,0.15)",
      }}>
        <p style={{
          textAlign: "center", color: "#de3163", fontSize: "12px", fontWeight: 700,
          letterSpacing: "3px", textTransform: "uppercase", marginBottom: "36px",
        }}>OUR COMMUNITY IN NUMBERS</p>
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#1e293b", letterSpacing: "-1px", lineHeight: 1, marginBottom: "6px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "rgba(30,41,59,0.7)", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="section-pad" style={{ background: "transparent", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", fontSize: "160px", opacity: 0.05, userSelect: "none", lineHeight: 1 }}>🏃</div>
        <div className="cta-card" style={{
          position: "relative", zIndex: 1, margin: "0 auto",
          padding: "48px 40px", maxWidth: "560px",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}>
          <h2 className="cta-h2" style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-1px" }}>
            Ready to play?
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(30,41,59,0.7)", marginBottom: "28px", lineHeight: 1.6 }}>
            Join Nepal&apos;s fastest growing sports community today.
          </p>
          <button style={{
            background: "#de3163", border: "none", color: "#fff",
            padding: "14px 32px", borderRadius: "12px", fontSize: "16px",
            fontWeight: 700, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 16px rgba(222,49,99,0.35)",
          }}>
            Create Account →
          </button>
        </div>
      </section>
    </div>
  );
}
