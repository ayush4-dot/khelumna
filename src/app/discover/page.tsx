"use client";
import { useState } from "react";
import {
    MapPin, Clock, Zap, CircleDot,
    Trophy, Activity, Wind, Target,
    ChevronRight, X, User,
    Home, Map, PlusCircle, CreditCard,
    Search, Menu, ArrowRight
} from "lucide-react";

const globalStyles = `
  * { box-sizing: border-box; }

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
  .mobile-menu { display: none; flex-direction: column; gap: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.4); }
  .mobile-menu a { display: block; padding: 14px 24px; font-size: 15px; font-weight: 600; color: #1e293b; text-decoration: none; border-top: 1px solid rgba(0,0,0,0.06); }
  .mobile-menu-open { display: flex !important; }

  .filter-bar { top: 65px; }

  .discover-section { padding: 1.5rem 2.5rem 0; }
  .discover-stage {
    display: grid;
    grid-template-columns: 390px 1fr;
    height: 72vh;
    min-height: 460px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    border: 1px solid rgba(255,255,255,0.4);
  }
  .discover-list {
    overflow-y: auto;
    padding: 1.25rem 1rem;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(14px);
    border-right: 1px solid rgba(0,0,0,0.06);
  }

  .cta-section { padding: 64px 48px 80px; text-align: center; }
  .cta-card {
    margin: 0 auto;
    padding: 48px 40px;
    max-width: 560px;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(16px);
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    .nav-inner   { padding: 14px 20px; }
    .nav-links   { display: none; }
    .nav-cta     { display: none; }
    .hamburger   { display: block; }
    .filter-bar  { top: 57px; }
    .discover-section { padding: 1rem 1rem 0; }
    .discover-stage { grid-template-columns: 1fr; height: auto; border-radius: 16px; }
    .discover-list  { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); max-height: 50vh; }
    .discover-map   { height: 50vh; }
    .cta-section { padding: 40px 20px 56px; }
    .cta-card    { padding: 32px 20px; }
    .cta-h2      { font-size: 28px !important; }
  }
`;

const NAV_LINKS = [
    { label: "Home", href: "/", icon: <Home size={15} /> },
    { label: "Discover", href: "/discover", icon: <Map size={15} /> },
    { label: "Host event", href: "/create", icon: <PlusCircle size={15} /> },
    { label: "League", href: "/league", icon: <Trophy size={15} /> },
    { label: "My card", href: "/profile", icon: <CreditCard size={15} /> },
];

const sports = [
    { label: "All sports", icon: <Activity size={15} /> },
    { label: "Football", icon: <CircleDot size={15} /> },
    { label: "Basketball", icon: <Target size={15} /> },
    { label: "Volleyball", icon: <Wind size={15} /> },
    { label: "Tennis", icon: <Activity size={15} /> },
    { label: "Cricket", icon: <Trophy size={15} /> },
    { label: "Running", icon: <Zap size={15} /> },
];

const events = [
    {
        id: 1,
        sport: "Basketball",
        title: "Need 2 players — Balaju court",
        time: "45 min",
        distance: "0.3 km",
        fee: "Free",
        slots: 2,
        totalSlots: 10,
        flash: true,
        color: "#E85D24",
        bg: "#FEF0EB",
    },
    {
        id: 2,
        sport: "Football",
        title: "Kalanki 5-a-side — Sunday 6 AM",
        time: "Sun 6:00 AM",
        distance: "0.8 km",
        fee: "Rs. 120",
        slots: 3,
        totalSlots: 10,
        flash: false,
        color: "#1a7a4a",
        bg: "#EBF7F1",
    },
    {
        id: 3,
        sport: "Volleyball",
        title: "Co-ed volleyball — Ratna Park",
        time: "Sat 4:30 PM",
        distance: "1.4 km",
        fee: "Rs. 80",
        slots: 2,
        totalSlots: 12,
        flash: false,
        color: "#6b3fa0",
        bg: "#F3EEFB",
    },
    {
        id: 4,
        sport: "Football",
        title: "Sundhara 7-a-side league match",
        time: "Sat 7:00 AM",
        distance: "2.1 km",
        fee: "Rs. 200",
        slots: 2,
        totalSlots: 14,
        flash: false,
        color: "#1a7a4a",
        bg: "#EBF7F1",
    },
    {
        id: 5,
        sport: "Tennis",
        title: "Doubles tennis — Pulchowk",
        time: "Sun 8:00 AM",
        distance: "2.8 km",
        fee: "Rs. 150",
        slots: 2,
        totalSlots: 4,
        flash: false,
        color: "#1c6fb5",
        bg: "#EBF3FB",
    },
];

const mapPins = [
    { sport: "Basketball", top: "28%", left: "38%", flash: true },
    { sport: "Football", top: "45%", left: "52%", flash: false },
    { sport: "Volleyball", top: "32%", left: "65%", flash: false },
    { sport: "Football", top: "60%", left: "44%", flash: false },
    { sport: "Tennis", top: "50%", left: "72%", flash: false },
];

export default function Discover() {
    const [activeSport, setActiveSport] = useState("All sports");
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [showFlash, setShowFlash] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const filtered = activeSport === "All sports"
        ? events
        : events.filter(e => e.sport === activeSport);

    const getSportIcon = (sport: string, size = 14) => {
        switch (sport) {
            case "Basketball": return <Target size={size} />;
            case "Football": return <CircleDot size={size} />;
            case "Volleyball": return <Wind size={size} />;
            case "Tennis": return <Activity size={size} />;
            case "Cricket": return <Trophy size={size} />;
            case "Running": return <Zap size={size} />;
            default: return <CircleDot size={size} />;
        }
    };

    return (
        <div style={{
            background: "url('/back.avif') center/cover no-repeat fixed",
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
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
                    <a href="/" style={{ display: "flex", alignItems: "center", gap: "2px", textDecoration: "none", flexShrink: 0 }}>
                        <span style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>Khelum</span>
                        <span style={{ fontSize: "24px", fontWeight: 800, color: "#de3163" }}> Na.</span>
                    </a>

                    {/* Desktop links */}
                    <div className="nav-links">
                        {NAV_LINKS.map(link => (
                            <a key={link.label} href={link.href} style={{
                                color: link.href === "/discover" ? "#de3163" : "#1e293b",
                                textDecoration: "none",
                                fontSize: "15px",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#de3163")}
                                onMouseLeave={e => (e.currentTarget.style.color = link.href === "/discover" ? "#de3163" : "#1e293b")}
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA + avatar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="nav-cta">
                            <a href="/discover">
                                <button style={{ background: "#fff", border: "none", color: "#1e293b", padding: "8px 20px", borderRadius: "24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <Search size={14} /> Find game
                                </button>
                            </a>
                            <a href="/create">
                                <button style={{ background: "transparent", border: "none", color: "#1e293b", padding: "8px 20px", borderRadius: "24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <PlusCircle size={14} /> Host event
                                </button>
                            </a>
                        </div>
                        <a href="/profile" style={{ flexShrink: 0 }}>
                            <div style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: "#1e293b",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}>
                                <User size={16} color="#fff" />
                            </div>
                        </a>
                    </div>

                    {/* Hamburger */}
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <div className={`mobile-menu${menuOpen ? " mobile-menu-open" : ""}`}>
                    {NAV_LINKS.map(link => (
                        <a key={link.label} href={link.href}
                            style={{ color: link.href === "/discover" ? "#de3163" : "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.icon} {link.label}
                        </a>
                    ))}
                    <div style={{ display: "flex", gap: "10px", padding: "14px 24px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <a href="/discover" style={{ flex: 1 }}>
                            <button style={{ width: "100%", background: "#de3163", border: "none", color: "#fff", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                <Search size={14} /> Find game
                            </button>
                        </a>
                        <a href="/create" style={{ flex: 1 }}>
                            <button style={{ width: "100%", background: "rgba(30,41,59,0.08)", border: "none", color: "#1e293b", padding: "10px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                <PlusCircle size={14} /> Host event
                            </button>
                        </a>
                    </div>
                </div>
            </nav>

            {/* ── SPORT FILTER BAR ── */}
            <div className="filter-bar" style={{
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                padding: "0 2.5rem",
                display: "flex",
                gap: "0.25rem",
                overflowX: "auto",
                scrollbarWidth: "none",
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px)",
                position: "sticky",
                zIndex: 99,
            }}>
                {sports.map(s => (
                    <button
                        key={s.label}
                        onClick={() => setActiveSport(s.label)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "14px 16px",
                            background: "none",
                            border: "none",
                            borderBottom: activeSport === s.label
                                ? "2px solid #de3163"
                                : "2px solid transparent",
                            fontSize: "0.82rem",
                            fontWeight: activeSport === s.label ? 700 : 500,
                            color: activeSport === s.label ? "#de3163" : "#555",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            fontFamily: "'Inter', sans-serif",
                            transition: "all 0.15s",
                        }}
                    >
                        {s.icon}
                        {s.label}
                    </button>
                ))}
            </div>

            {/* ── MAIN STAGE — LIST + MAP ── */}
            <div className="discover-section">
                <p style={{
                    fontSize: "0.78rem",
                    color: "#475569",
                    margin: "0 0 0.75rem 0.25rem",
                    fontWeight: 600,
                }}>
                    {filtered.length} events within 5 km
                </p>

                <div className="discover-stage">

                    {/* ── LEFT — EVENT LIST ── */}
                    <div className="discover-list">
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                            {filtered.map(ev => (
                                <div
                                    key={ev.id}
                                    onClick={() => setSelectedEvent(ev.id === selectedEvent ? null : ev.id)}
                                    style={{
                                        background: "#fff",
                                        border: selectedEvent === ev.id
                                            ? "1.5px solid #de3163"
                                            : "1.5px solid #f0f0f0",
                                        borderRadius: "16px",
                                        padding: "1rem 1.1rem",
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                        boxShadow: selectedEvent === ev.id
                                            ? "0 4px 20px rgba(0,0,0,0.09)"
                                            : "0 1px 3px rgba(0,0,0,0.03)",
                                    }}
                                >
                                    {/* Top row */}
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.55rem",
                                    }}>
                                        {/* Sport badge */}
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            background: ev.bg,
                                            padding: "4px 10px",
                                            borderRadius: "100px",
                                            color: ev.color,
                                        }}>
                                            {getSportIcon(ev.sport)}
                                            <span style={{
                                                fontSize: "0.73rem",
                                                fontWeight: 700,
                                            }}>{ev.sport}</span>
                                        </div>

                                        {ev.flash ? (
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                background: "#E85D24",
                                                color: "#fff",
                                                fontSize: "0.68rem",
                                                fontWeight: 700,
                                                padding: "3px 9px",
                                                borderRadius: "100px",
                                            }}>
                                                <Zap size={10} fill="#fff" />
                                                Flash
                                            </div>
                                        ) : (
                                            <span style={{
                                                fontSize: "0.73rem",
                                                color: "#bbb",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "3px",
                                            }}>
                                                <MapPin size={11} />
                                                {ev.distance}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <p style={{
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        color: "#111",
                                        margin: "0 0 0.45rem 0",
                                        lineHeight: 1.3,
                                    }}>
                                        {ev.title}
                                    </p>

                                    {/* Meta */}
                                    <div style={{
                                        display: "flex",
                                        gap: "1rem",
                                        fontSize: "0.75rem",
                                        color: "#999",
                                        marginBottom: "0.85rem",
                                        alignItems: "center",
                                    }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                            <Clock size={11} /> {ev.time}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                            <CircleDot size={11} /> {ev.fee}
                                        </span>
                                        {ev.flash && (
                                            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                                <MapPin size={11} /> {ev.distance}
                                            </span>
                                        )}
                                    </div>

                                    {/* Slots + button */}
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem",
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                fontSize: "0.7rem",
                                                color: "#bbb",
                                                margin: "0 0 4px 0",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "3px",
                                            }}>
                                                <ChevronRight size={10} />
                                                {ev.slots} slot{ev.slots > 1 ? "s" : ""} left
                                            </p>
                                            <div style={{
                                                height: "3px",
                                                background: "#f0f0f0",
                                                borderRadius: "2px",
                                                overflow: "hidden",
                                            }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: `${((ev.totalSlots - ev.slots) / ev.totalSlots) * 100}%`,
                                                    background: ev.flash ? "#E85D24" : ev.color,
                                                    borderRadius: "2px",
                                                }} />
                                            </div>
                                        </div>

                                        <button style={{
                                            background: ev.flash ? "#E85D24" : "#111",
                                            color: "#fff",
                                            border: "none",
                                            padding: "8px 18px",
                                            borderRadius: "100px",
                                            fontSize: "0.78rem",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            fontFamily: "'Inter', sans-serif",
                                            whiteSpace: "nowrap",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            transition: "opacity 0.15s",
                                        }}
                                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"}
                                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
                                        >
                                            {ev.flash ? <><Zap size={11} /> Join now</> : "Book"}
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT — MAP ── */}
                    <div className="discover-map" style={{
                        position: "relative",
                        background: "#eef2eb",
                        overflow: "hidden",
                    }}>

                        {/* Grid */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `
                linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
              `,
                            backgroundSize: "48px 48px",
                        }} />

                        {/* Roads */}
                        {[
                            { top: "35%", left: "20%", width: "60%", height: "2px", rotate: "0deg" },
                            { top: "20%", left: "48%", width: "2px", height: "60%", rotate: "0deg" },
                            { top: "55%", left: "25%", width: "40%", height: "2px", rotate: "-8deg" },
                        ].map((r, i) => (
                            <div key={i} style={{
                                position: "absolute",
                                top: r.top, left: r.left,
                                width: r.width, height: r.height,
                                background: "rgba(255,255,255,0.7)",
                                borderRadius: "2px",
                                transform: `rotate(${r.rotate})`,
                            }} />
                        ))}

                        {/* Location badge */}
                        <div style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "8px 14px",
                            fontSize: "0.75rem",
                            color: "#555",
                            fontWeight: 600,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            zIndex: 10,
                        }}>
                            <MapPin size={13} color="#de3163" />
                            Kathmandu, Nepal
                        </div>

                        {/* MAP PINS */}
                        {mapPins.map((pin, i) => (
                            <div key={i} style={{
                                position: "absolute",
                                top: pin.top,
                                left: pin.left,
                                transform: "translate(-50%, -100%)",
                                cursor: "pointer",
                                zIndex: 10,
                                transition: "transform 0.15s",
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "translate(-50%, -100%) scale(1.1)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.transform = "translate(-50%, -100%) scale(1)";
                                }}
                            >
                                <div style={{
                                    background: pin.flash ? "#E85D24" : "#fff",
                                    border: pin.flash ? "none" : "1.5px solid #e0e0e0",
                                    borderRadius: "10px",
                                    padding: "6px 12px",
                                    fontSize: "0.73rem",
                                    fontWeight: 700,
                                    color: pin.flash ? "#fff" : "#111",
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                }}>
                                    {pin.flash
                                        ? <Zap size={11} fill="#fff" color="#fff" />
                                        : getSportIcon(pin.sport, 11)
                                    }
                                    {pin.sport}
                                </div>
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: "6px solid transparent",
                                    borderRight: "6px solid transparent",
                                    borderTop: pin.flash ? "7px solid #E85D24" : "7px solid #fff",
                                    margin: "0 auto",
                                }} />
                            </div>
                        ))}

                        {/* ── FLASH POPUP ── */}
                        {showFlash && (
                            <div style={{
                                position: "absolute",
                                bottom: "1.5rem",
                                right: "1.5rem",
                                background: "#fff",
                                border: "1.5px solid #E85D24",
                                borderRadius: "18px",
                                padding: "1.25rem",
                                width: "290px",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                                zIndex: 20,
                                animation: "slideUp 0.35s ease",
                            }}>
                                {/* Close */}
                                <button
                                    onClick={() => setShowFlash(false)}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#bbb",
                                        display: "flex",
                                        padding: "2px",
                                    }}
                                >
                                    <X size={16} />
                                </button>

                                {/* Header */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "0.75rem",
                                }}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        background: "#FEF0EB",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <Zap size={16} color="#E85D24" fill="#E85D24" />
                                    </div>
                                    <span style={{
                                        fontWeight: 800,
                                        fontSize: "0.88rem",
                                        color: "#E85D24",
                                    }}>
                                        Flash Match — 0.3 km away!
                                    </span>
                                </div>

                                <p style={{
                                    fontSize: "0.8rem",
                                    color: "#666",
                                    lineHeight: 1.55,
                                    margin: "0 0 0.75rem 0",
                                }}>
                                    Basketball at Balaju Park needs 2 players.
                                    Starting in 45 min. Free to join.
                                </p>

                                <div style={{
                                    fontSize: "2rem",
                                    fontWeight: 900,
                                    color: "#E85D24",
                                    textAlign: "center",
                                    margin: "0 0 1rem 0",
                                    letterSpacing: "0.06em",
                                    fontVariantNumeric: "tabular-nums",
                                }}>
                                    13:44
                                </div>

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button style={{
                                        flex: 1,
                                        background: "#E85D24",
                                        color: "#fff",
                                        border: "none",
                                        padding: "11px",
                                        borderRadius: "10px",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontFamily: "'Inter', sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "5px",
                                    }}>
                                        <Zap size={13} fill="#fff" /> I&apos;m in!
                                    </button>
                                    <button
                                        onClick={() => setShowFlash(false)}
                                        style={{
                                            flex: 1,
                                            background: "#f5f5f5",
                                            color: "#666",
                                            border: "none",
                                            padding: "11px",
                                            borderRadius: "10px",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                        Skip
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ── CTA FOOTER ── */}
            <section className="cta-section" style={{ position: "relative", overflow: "hidden", marginTop: "auto" }}>
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", opacity: 0.05, userSelect: "none", lineHeight: 1, pointerEvents: "none" }}>
                    <Activity size={160} />
                </div>
                <div className="cta-card" style={{ position: "relative", zIndex: 1 }}>
                    <h2 className="cta-h2" style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-1px", color: "#1e293b" }}>
                        Don&apos;t see your game?
                    </h2>
                    <p style={{ fontSize: "15px", color: "rgba(30,41,59,0.7)", marginBottom: "28px", lineHeight: 1.6 }}>
                        Host your own event and let Kathmandu&apos;s players come to you.
                    </p>
                    <a href="/create">
                        <button style={{
                            background: "#de3163", border: "none", color: "#fff",
                            padding: "14px 32px", borderRadius: "12px", fontSize: "16px",
                            fontWeight: 700, cursor: "pointer",
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            boxShadow: "0 4px 16px rgba(222,49,99,0.35)",
                        }}>
                            Host an event <ArrowRight size={18} />
                        </button>
                    </a>
                </div>
            </section>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e8e8e8; border-radius: 4px; }
      `}</style>

        </div>
    );
}
