import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTrending } from "../api/movies";
import { getPosterUrl } from "../utils/helpers";

const Landing = () => {
  const [posters, setPosters] = useState([]);

  // Fetch trending movies to use as background posters
  // We call this without auth — but our backend requires auth for /trending
  // So we just use static fallback poster colors if not logged in
  useEffect(() => {
    getTrending()
      .then((results) => setPosters(results.slice(0, 8)))
      .catch(() => setPosters([]));
  }, []);

  const features = [
    {
      icon: "🔍",
      title: "Smart Search",
      desc: "Search any movie by title and get instant results powered by TMDb",
    },
    {
      icon: "🎯",
      title: "Advanced Filters",
      desc: "Filter by genre, year, language and IMDb rating simultaneously",
    },
    {
      icon: "🎬",
      title: "Watch Trailers",
      desc: "Stream official YouTube trailers directly on the movie details page",
    },
    {
      icon: "❤️",
      title: "Your Watchlist",
      desc: "Save movies to your personal watchlist and access them anytime",
    },
  ];

  return (
    <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 3rem",
        background: "linear-gradient(to bottom, rgba(10,10,15,0.95), transparent)",
        backdropFilter: "blur(10px)",
      }}>
        <h1 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "1.8rem", color: "#e8b339",
          letterSpacing: "0.15em", margin: 0,
        }}>CineSphere</h1>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login" style={{
            padding: "0.6rem 1.5rem",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            color: "#f5f3ee",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => e.target.style.borderColor = "#e8b339"}
            onMouseLeave={(e) => e.target.style.borderColor = "#2a2a3a"}
          >
            Sign In
          </Link>
          <Link to="/register" style={{
            padding: "0.6rem 1.5rem",
            backgroundColor: "#e8b339",
            borderRadius: "8px",
            color: "#0a0a0f",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: "800",
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 1.5rem",
      }}>

        {/* Poster grid background */}
        {posters.length > 0 && (
          <div style={{
            position: "absolute", inset: 0,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "8px",
            opacity: 0.15,
            transform: "scale(1.05)",
            filter: "blur(2px)",
          }}>
            {posters.map((movie) => (
              <div key={movie.id} style={{
                backgroundImage: `url(${getPosterUrl(movie.posterPath, "w342")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
              }} />
            ))}
          </div>
        )}

        {/* Gradient overlays */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,0.95) 100%)",
        }} />
        {/* Gold glow top left */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(232,179,57,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        {/* Violet glow bottom right */}
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          maxWidth: "800px",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: "rgba(232,179,57,0.1)",
            border: "1px solid rgba(232,179,57,0.3)",
            borderRadius: "999px",
            padding: "0.4rem 1rem",
            marginBottom: "2rem",
          }}>
            <span style={{ fontSize: "0.75rem" }}>⭐</span>
            <span style={{ color: "#e8b339", fontSize: "0.8rem", fontWeight: "700", letterSpacing: "0.08em" }}>
              POWERED BY TMDB
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            lineHeight: 0.95,
            color: "#f5f3ee",
            margin: "0 0 1.5rem 0",
            letterSpacing: "0.02em",
          }}>
            Your Universe<br />
            <span style={{
              background: "linear-gradient(135deg, #e8b339, #f0c868)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Of Cinema
            </span>
          </h1>

          <p style={{
            color: "#8b8b9a",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
            maxWidth: "560px",
            margin: "0 auto 3rem",
          }}>
            Discover, filter and save movies from a library of thousands.
            Search by genre, year, language and rating — all in one place.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{
              padding: "1rem 2.5rem",
              backgroundColor: "#e8b339",
              color: "#0a0a0f",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "800",
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 0 30px rgba(232,179,57,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(232,179,57,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(232,179,57,0.3)";
              }}
            >
              🎬 Start Exploring
            </Link>
            <Link to="/login" style={{
              padding: "1rem 2.5rem",
              border: "1px solid #2a2a3a",
              color: "#f5f3ee",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e8b339";
                e.currentTarget.style.backgroundColor = "rgba(232,179,57,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a3a";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: "3rem", justifyContent: "center",
            marginTop: "4rem", flexWrap: "wrap",
          }}>
            {[
              { num: "500K+", label: "Movies" },
              { num: "Free", label: "To Use" },
              { num: "HD", label: "Trailers" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "2.2rem",
                  color: "#e8b339",
                  letterSpacing: "0.05em",
                }}>{s.num}</div>
                <div style={{ color: "#8b8b9a", fontSize: "0.85rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{
        padding: "6rem 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            color: "#f5f3ee",
            letterSpacing: "0.05em",
            margin: "0 0 1rem 0",
          }}>
            Everything You Need
          </h2>
          <p style={{ color: "#8b8b9a", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            One platform to search, discover and track all your favourite movies
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#14141c",
                border: "1px solid #2a2a3a",
                borderRadius: "16px",
                padding: "2rem",
                transition: "border-color 0.3s, transform 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e8b339";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a3a";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{
                color: "#f5f3ee",
                fontSize: "1.1rem",
                fontWeight: "700",
                margin: "0 0 0.75rem 0",
              }}>{f.title}</h3>
              <p style={{
                color: "#8b8b9a",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                margin: 0,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        margin: "0 2rem 6rem",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
        background: "linear-gradient(135deg, rgba(232,179,57,0.1), rgba(108,92,231,0.1))",
        border: "1px solid rgba(232,179,57,0.2)",
        borderRadius: "20px",
        padding: "4rem 2rem",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: "#f5f3ee",
          margin: "0 0 1rem 0",
          letterSpacing: "0.05em",
        }}>
          Ready to Explore?
        </h2>
        <p style={{ color: "#8b8b9a", marginBottom: "2rem", fontSize: "1rem" }}>
          Join CineSphere and start discovering your next favourite film
        </p>
        <Link to="/register" style={{
          padding: "1rem 3rem",
          backgroundColor: "#e8b339",
          color: "#0a0a0f",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: "800",
          boxShadow: "0 0 30px rgba(232,179,57,0.3)",
        }}>
          Create Free Account
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid #2a2a3a",
        padding: "2rem",
        textAlign: "center",
        color: "#8b8b9a",
        fontSize: "0.85rem",
      }}>
        <span style={{
          fontFamily: "Bebas Neue, sans-serif",
          color: "#e8b339",
          fontSize: "1.2rem",
          letterSpacing: "0.1em",
          marginRight: "1rem",
        }}>CineSphere</span>
        © 2025 · Built with TMDb API · All rights reserved
      </footer>
    </div>
  );
};

export default Landing;