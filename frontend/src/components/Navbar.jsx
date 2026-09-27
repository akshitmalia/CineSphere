import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 1.5rem",
        backgroundColor: "rgba(10,10,15,0.95)",
        borderBottom: "1px solid #2a2a3a",
        backdropFilter: "blur(10px)",
      }}>
        {/* Logo */}
        <Link to="/search" style={{ textDecoration: "none" }}>
          <h1 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "1.6rem", color: "#e8b339",
            letterSpacing: "0.15em", margin: 0,
          }}>CineSphere</h1>
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          display: window.innerWidth < 768 ? "none" : "flex",
        }}>
          <Link to="/watchlist" style={{
            padding: "0.5rem 1.2rem",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            color: "#f5f3ee",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: "600",
            display: "flex", alignItems: "center", gap: "0.4rem",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#e8b339"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a3a"}
          >
            ❤️ Watchlist
          </Link>

          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.4rem 0.75rem",
            backgroundColor: "#14141c",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
          }}>
            <div style={{
              width: "28px", height: "28px",
              backgroundColor: "#e8b339",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "800", fontSize: "0.75rem", color: "#0a0a0f",
            }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <span style={{
              color: "#8b8b9a", fontSize: "0.8rem",
              maxWidth: "160px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.email}
            </span>
          </div>

          <button onClick={handleLogout} style={{
            padding: "0.5rem 1.2rem",
            backgroundColor: "transparent",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            color: "#8b8b9a",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "color 0.2s, border-color 0.2s",
            fontFamily: "Manrope, sans-serif",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.borderColor = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8b8b9a";
              e.currentTarget.style.borderColor = "#2a2a3a";
            }}
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: window.innerWidth >= 768 ? "none" : "flex",
            flexDirection: "column", gap: "5px",
            background: "none", border: "none",
            cursor: "pointer", padding: "0.5rem",
          }}
        >
          <span style={{
            display: "block", width: "22px", height: "2px",
            backgroundColor: menuOpen ? "#e8b339" : "#f5f3ee",
            transition: "all 0.3s",
            transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
          }} />
          <span style={{
            display: "block", width: "22px", height: "2px",
            backgroundColor: menuOpen ? "#e8b339" : "#f5f3ee",
            transition: "all 0.3s",
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: "block", width: "22px", height: "2px",
            backgroundColor: menuOpen ? "#e8b339" : "#f5f3ee",
            transition: "all 0.3s",
            transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
          }} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
          backgroundColor: "#14141c",
          borderBottom: "1px solid #2a2a3a",
          padding: "1.25rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          {/* User email */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.75rem",
            backgroundColor: "#0a0a0f",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
          }}>
            <div style={{
              width: "32px", height: "32px",
              backgroundColor: "#e8b339",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "800", fontSize: "0.85rem", color: "#0a0a0f",
              flexShrink: 0,
            }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <span style={{
              color: "#f5f3ee", fontSize: "0.9rem",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.email}
            </span>
          </div>

          <Link
            to="/watchlist"
            onClick={() => setMenuOpen(false)}
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: "#0a0a0f",
              border: "1px solid #2a2a3a",
              borderRadius: "8px",
              color: "#f5f3ee",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}
          >
            ❤️ My Watchlist
          </Link>

          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              color: "#ef4444",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "Manrope, sans-serif",
              textAlign: "left",
            }}
          >
         Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;