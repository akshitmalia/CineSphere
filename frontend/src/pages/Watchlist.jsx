import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getFavourites, removeFavourite } from "../api/favourites";
import { getPosterUrl, getYear, formatRating } from "../utils/helpers";

const Watchlist = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [removing, setRemoving]     = useState(null); // tracks which movie is being removed

  useEffect(() => {
    getFavourites()
      .then(setFavourites)
      .catch(() => setFavourites([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (tmdbMovieId, e) => {
    e.stopPropagation();
    setRemoving(tmdbMovieId);
    try {
      await removeFavourite(tmdbMovieId);
      setFavourites((prev) => prev.filter((f) => f.tmdbMovieId !== tmdbMovieId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>
      <Navbar />

      <div style={{ paddingTop: "80px", padding: "80px 2rem 4rem" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <h1 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#f5f3ee",
              letterSpacing: "0.05em",
              margin: "0 0 0.25rem 0",
            }}>
              My Watchlist
            </h1>
            <p style={{ color: "#8b8b9a", margin: 0, fontSize: "0.9rem" }}>
              {loading ? "Loading..." : `${favourites.length} movie${favourites.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>

          <button
            onClick={() => navigate("/search")}
            style={{
              padding: "0.65rem 1.4rem",
              backgroundColor: "#e8b339",
              border: "none",
              borderRadius: "8px",
              color: "#0a0a0f",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "Manrope, sans-serif",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            + Discover More
          </button>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1.25rem",
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                backgroundColor: "#14141c",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #2a2a3a",
              }}>
                <div style={{
                  aspectRatio: "2/3",
                  background: "linear-gradient(90deg, #14141c 25%, #1c1c28 50%, #14141c 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }} />
                <div style={{ padding: "0.85rem" }}>
                  <div style={{ height: "12px", backgroundColor: "#2a2a3a", borderRadius: "4px", marginBottom: "0.5rem" }} />
                  <div style={{ height: "10px", backgroundColor: "#2a2a3a", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            ))}
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && favourites.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "6rem 2rem",
          }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🎬</div>
            <h2 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "2rem", color: "#f5f3ee",
              letterSpacing: "0.05em", marginBottom: "0.75rem",
            }}>
              Your Watchlist is Empty
            </h2>
            <p style={{ color: "#8b8b9a", marginBottom: "2rem", fontSize: "0.95rem" }}>
              Start exploring and save movies you want to watch
            </p>
            <button
              onClick={() => navigate("/search")}
              style={{
                padding: "0.9rem 2.5rem",
                backgroundColor: "#e8b339",
                border: "none",
                borderRadius: "10px",
                color: "#0a0a0f",
                fontWeight: "800",
                fontSize: "1rem",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
                boxShadow: "0 0 30px rgba(232,179,57,0.3)",
              }}
            >
              🔍 Discover Movies
            </button>
          </div>
        )}

        {/* Favourites grid */}
        {!loading && favourites.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1.25rem",
          }}>
            {favourites.map((fav) => (
              <div
                key={fav.tmdbMovieId}
                onClick={() => navigate(`/movie/${fav.tmdbMovieId}`)}
                style={{
                  backgroundColor: "#14141c",
                  border: "1px solid #2a2a3a",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "#e8b339";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#2a2a3a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Poster */}
                <div style={{ position: "relative", aspectRatio: "2/3" }}>
                  <img
                    src={getPosterUrl(fav.posterPath)}
                    alt={fav.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/342x513/14141c/8b8b9a?text=No+Poster";
                    }}
                  />

                  {/* Rating badge */}
                  <div style={{
                    position: "absolute", top: "0.6rem", left: "0.6rem",
                    backgroundColor: "rgba(10,10,15,0.85)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(232,179,57,0.4)",
                    borderRadius: "6px",
                    padding: "0.2rem 0.5rem",
                    display: "flex", alignItems: "center", gap: "0.25rem",
                  }}>
                    <span style={{ fontSize: "0.7rem" }}>⭐</span>
                    <span style={{ color: "#e8b339", fontSize: "0.75rem", fontWeight: "700" }}>
                      {formatRating(fav.voteAverage)}
                    </span>
                  </div>

                  {/* No remove button on poster anymore */}
                </div>

                {/* Info + Remove button joined below poster */}
                <div style={{ padding: "0.75rem 0.85rem 0.85rem" }}>
                  <h3 style={{
                    color: "#f5f3ee",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    margin: "0 0 0.2rem 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {fav.title}
                  </h3>
                  <p style={{ color: "#8b8b9a", fontSize: "0.8rem", margin: "0 0 0.75rem 0" }}>
                    {getYear(fav.releaseDate)}
                  </p>

<button
  onClick={(e) => handleRemove(fav.tmdbMovieId, e)}
  disabled={removing === fav.tmdbMovieId}
  style={{
    width: "100%",
    padding: "0.55rem",
    backgroundColor: removing === fav.tmdbMovieId ? "#c0392b" : "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "0.78rem",
    fontWeight: "700",
    cursor: removing === fav.tmdbMovieId ? "wait" : "pointer",
    fontFamily: "Manrope, sans-serif",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
  }}
  onMouseEnter={(e) => {
    if (removing !== fav.tmdbMovieId)
      e.currentTarget.style.backgroundColor = "#c0392b";
  }}
  onMouseLeave={(e) => {
    if (removing !== fav.tmdbMovieId)
      e.currentTarget.style.backgroundColor = "#ef4444";
  }}
>
  {removing === fav.tmdbMovieId ? "Removing..." : "🗑 Remove"}
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;