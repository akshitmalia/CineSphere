import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMovieDetails } from "../api/movies";
import { getFavourites, addFavourite, removeFavourite } from "../api/favourites";
import {
  getBackdropUrl, getPosterUrl, getProfileUrl,
  getYear, formatRuntime, formatRating,
} from "../utils/helpers";

const isMobileDevice = () => window.innerWidth < 768;

const MovieDetails = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const iframeRef = useRef(null);

  const [movie, setMovie]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [muted, setMuted]             = useState(true);
  const [isFav, setIsFav]             = useState(false);
  const [favLoading, setFavLoading]   = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [mobile, setMobile]           = useState(isMobileDevice());

  useEffect(() => {
    const onResize = () => setMobile(isMobileDevice());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setShowTrailer(false);
    setMuted(true);

    Promise.all([getMovieDetails(id), getFavourites()])
      .then(([movieData, favs]) => {
        setMovie(movieData);
        const favIds = new Set(favs.map((f) => f.tmdbMovieId));
        setIsFav(favIds.has(movieData.id));
        if (!isMobileDevice()) {
          setTimeout(() => setShowTrailer(true), 600);
        }
      })
      .catch(() => setError("Could not load movie details."))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      muted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}',
      "*"
    );
    setMuted(!muted);
  };

  const handleToggleFav = async () => {
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavourite(movie.id);
        setIsFav(false);
      } else {
        await addFavourite({
          id: movie.id,
          title: movie.title,
          posterPath: movie.posterPath,
          releaseDate: movie.releaseDate,
          voteAverage: movie.voteAverage,
        });
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh" }}>
        <Navbar />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "100vh", flexDirection: "column", gap: "1rem",
        }}>
          <div style={{
            width: "48px", height: "48px",
            border: "3px solid #2a2a3a",
            borderTopColor: "#e8b339",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#8b8b9a", fontFamily: "Manrope" }}>Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh" }}>
        <Navbar />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "80vh", flexDirection: "column", gap: "1rem",
        }}>
          <p style={{ color: "#f87171", fontFamily: "Manrope" }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "0.6rem 1.5rem", backgroundColor: "#e8b339",
              border: "none", borderRadius: "8px", color: "#0a0a0f",
              fontWeight: "700", cursor: "pointer", fontFamily: "Manrope",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const trailerSrc = movie.trailerKey
    ? "https://www.youtube.com/embed/" +
      movie.trailerKey +
      "?autoplay=1&mute=1&loop=1&playlist=" +
      movie.trailerKey +
      "&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
    : null;

  const useTrailer = !mobile && trailerSrc && showTrailer;

  const youtubeLink = movie.trailerKey
    ? "https://www.youtube.com/watch?v=" + movie.trailerKey
    : null;

  return (
    <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

        {/* Desktop trailer */}
        {useTrailer && (
          <iframe
            ref={iframeRef}
            src={trailerSrc}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "177.78vh",
              minWidth: "100%",
              height: "100vh",
              border: "none",
              pointerEvents: "none",
              filter: "brightness(0.75)",
            }}
          />
        )}

        {/* Backdrop image — mobile always, desktop fallback */}
        {!useTrailer && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(" + getBackdropUrl(movie.backdropPath) + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "brightness(0.6)",
          }} />
        )}

        {/* Gradient overlays */}
        <div style={{
          position: "absolute", inset: 0,
          background: mobile
            ? "linear-gradient(to bottom, rgba(10,10,15,0.5) 0%, rgba(10,10,15,0.9) 60%, rgba(10,10,15,1) 100%)"
            : "linear-gradient(to right, rgba(10,10,15,0.92) 35%, rgba(10,10,15,0.15) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 40%)",
        }} />

        {/* ── Content ── */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: mobile ? "flex-end" : "center",
          minHeight: "100vh",
          padding: mobile ? "90px 1.25rem 2.5rem" : "90px 3rem 3rem",
          boxSizing: "border-box",
          gap: "1.5rem",
        }}>

          {/* Mobile: poster centered at top */}
          {mobile && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={getPosterUrl(movie.posterPath, "w342")}
                alt={movie.title}
                style={{
                  width: "140px",
                  borderRadius: "12px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  border: "2px solid rgba(232,179,57,0.4)",
                }}
              />
            </div>
          )}

          {/* Info row */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "2.5rem",
            alignItems: "flex-start",
            maxWidth: mobile ? "100%" : "900px",
          }}>

            {/* Desktop poster */}
            {!mobile && (
              <img
                src={getPosterUrl(movie.posterPath, "w342")}
                alt={movie.title}
                style={{
                  width: "200px",
                  borderRadius: "12px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  flexShrink: 0,
                  border: "2px solid rgba(232,179,57,0.3)",
                }}
              />
            )}

            {/* Text info */}
            <div style={{ textAlign: mobile ? "center" : "left", width: "100%" }}>

              {/* Genres */}
              <div style={{
                display: "flex", gap: "0.5rem", flexWrap: "wrap",
                marginBottom: "0.75rem",
                justifyContent: mobile ? "center" : "flex-start",
              }}>
                {movie.genres && movie.genres.map((g) => (
                  <span key={g.id} style={{
                    backgroundColor: "rgba(232,179,57,0.1)",
                    border: "1px solid rgba(232,179,57,0.3)",
                    color: "#e8b339",
                    fontSize: "0.72rem", fontWeight: "700",
                    padding: "0.2rem 0.7rem",
                    borderRadius: "999px",
                  }}>
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: mobile ? "2rem" : "clamp(2.2rem, 5vw, 4rem)",
                color: "#f5f3ee",
                margin: "0 0 0.75rem 0",
                lineHeight: 1.05,
                letterSpacing: "0.02em",
              }}>
                {movie.title}
              </h1>

              {/* Meta */}
              <div style={{
                display: "flex", gap: "1rem", alignItems: "center",
                marginBottom: "1rem", flexWrap: "wrap",
                justifyContent: mobile ? "center" : "flex-start",
              }}>
                <span style={{ color: "#e8b339", fontWeight: "800", fontSize: "1rem" }}>
                  ⭐ {formatRating(movie.voteAverage)}
                </span>
                <span style={{ color: "#8b8b9a" }}>{getYear(movie.releaseDate)}</span>
                {movie.runtime > 0 && (
                  <span style={{ color: "#8b8b9a" }}>
                    🕐 {formatRuntime(movie.runtime)}
                  </span>
                )}
                <span style={{
                  backgroundColor: "#2a2a3a", padding: "0.15rem 0.5rem",
                  borderRadius: "4px", color: "#8b8b9a",
                  fontSize: "0.8rem", textTransform: "uppercase",
                }}>
                  {movie.originalLanguage}
                </span>
              </div>

              {/* Overview */}
              <p style={{
                color: "#d0cfc8", fontSize: "0.9rem",
                lineHeight: 1.75,
                maxWidth: mobile ? "100%" : "560px",
                marginBottom: "1.75rem",
                display: "-webkit-box",
                WebkitLineClamp: mobile ? 3 : 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textAlign: mobile ? "center" : "left",
              }}>
                {movie.overview}
              </p>

              {/* Buttons */}
              <div style={{
                display: "flex", gap: "0.75rem", flexWrap: "wrap",
                justifyContent: mobile ? "center" : "flex-start",
              }}>

                {/* Watchlist */}
                <button
                  onClick={handleToggleFav}
                  disabled={favLoading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: isFav ? "#e8b339" : "transparent",
                    border: isFav ? "2px solid #e8b339" : "2px solid rgba(232,179,57,0.5)",
                    borderRadius: "10px",
                    color: isFav ? "#0a0a0f" : "#e8b339",
                    fontSize: "0.9rem",
                    fontWeight: "800",
                    cursor: favLoading ? "wait" : "pointer",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    transition: "all 0.25s",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {isFav ? "❤️ In Watchlist" : "🤍 Add to Watchlist"}
                </button>

                {/* Mobile: Watch on YouTube button */}
{mobile && youtubeLink && (
  <button
    onClick={() => window.open(youtubeLink, "_blank")}
    style={{
      padding: "0.75rem 1.2rem",
      backgroundColor: "#ff0000",
      border: "none",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "0.85rem",
      fontWeight: "700",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      fontFamily: "Manrope, sans-serif",
    }}
  >
    ▶ Watch Trailer
  </button>
)}

                {/* Desktop: mute toggle */}
                {!mobile && movie.trailerKey && showTrailer && (
                  <button
                    onClick={toggleMute}
                    style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      color: "#f5f3ee",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    {muted ? "🔇" : "🔊"}
                  </button>
                )}

                {/* Back */}
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    padding: "0.75rem 1.2rem",
                    backgroundColor: "transparent",
                    border: "1px solid #2a2a3a",
                    borderRadius: "10px",
                    color: "#8b8b9a",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontFamily: "Manrope, sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f5f3ee";
                    e.currentTarget.style.color = "#f5f3ee";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a3a";
                    e.currentTarget.style.color = "#8b8b9a";
                  }}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer badge — desktop only, bottom right */}
        {useTrailer && (
          <div style={{
            position: "absolute", bottom: "1.5rem", right: "1.5rem", zIndex: 10,
            backgroundColor: "rgba(10,10,15,0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            padding: "0.4rem 0.8rem",
            color: "#8b8b9a", fontSize: "0.75rem",
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}>
            <span style={{ color: "#ef4444", fontSize: "0.6rem" }}>●</span>
            Official Trailer Playing
          </div>
        )}
      </div>

      {/* ── CAST ── */}
      {movie.cast && movie.cast.length > 0 && (
        <section style={{ padding: "3rem 1.5rem 2rem" }}>
          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "1.8rem", color: "#f5f3ee",
            letterSpacing: "0.05em", margin: "0 0 1.5rem 0",
          }}>
            Cast
          </h2>
          <div style={{
            display: "flex", gap: "1rem",
            overflowX: "auto", paddingBottom: "1rem",
            scrollbarWidth: "thin",
            scrollbarColor: "#2a2a3a #0a0a0f",
          }}>
            {movie.cast.map((person) => (
              <div
                key={person.id}
                style={{
                  flexShrink: 0, width: "120px",
                  textAlign: "center",
                  backgroundColor: "#14141c",
                  border: "1px solid #2a2a3a",
                  borderRadius: "12px",
                  padding: "1rem 0.75rem",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#e8b339"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a3a"}
              >
                <div style={{
                  width: "68px", height: "68px",
                  borderRadius: "50%", overflow: "hidden",
                  margin: "0 auto 0.75rem",
                  border: "2px solid #2a2a3a",
                  backgroundColor: "#0a0a0f",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.5rem",
                }}>
                  {person.profilePath ? (
                    <img
                      src={getProfileUrl(person.profilePath)}
                      alt={person.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.textContent = "🎭";
                      }}
                    />
                  ) : "🎭"}
                </div>
                <p style={{
                  color: "#f5f3ee", fontSize: "0.75rem",
                  fontWeight: "700", margin: "0 0 0.3rem 0",
                  lineHeight: 1.3, wordBreak: "break-word",
                }}>
                  {person.name}
                </p>
                <p style={{
                  color: "#8b8b9a", fontSize: "0.68rem",
                  margin: 0, lineHeight: 1.3, wordBreak: "break-word",
                }}>
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── OVERVIEW ── */}
      <section style={{ padding: "2rem 1.5rem", maxWidth: "800px" }}>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "1.8rem", color: "#f5f3ee",
          letterSpacing: "0.05em", margin: "0 0 1rem 0",
        }}>
          Overview
        </h2>
        <p style={{ color: "#8b8b9a", fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
          {movie.overview || "No overview available."}
        </p>
      </section>

      {/* ── DETAILS ── */}
      <section style={{ padding: "2rem 1.5rem 5rem" }}>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "1.8rem", color: "#f5f3ee",
          letterSpacing: "0.05em", margin: "0 0 1.5rem 0",
        }}>
          Details
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem", maxWidth: "700px",
        }}>
          {[
            { label: "Release Date", value: movie.releaseDate || "N/A" },
            { label: "Runtime",      value: formatRuntime(movie.runtime) },
            { label: "TMDb Rating",  value: "⭐ " + formatRating(movie.voteAverage) + " / 10" },
            { label: "Language",     value: movie.originalLanguage ? movie.originalLanguage.toUpperCase() : "N/A" },
          ].map((item) => (
            <div key={item.label} style={{
              backgroundColor: "#14141c",
              border: "1px solid #2a2a3a",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
            }}>
              <p style={{
                color: "#8b8b9a", fontSize: "0.72rem", fontWeight: "700",
                margin: "0 0 0.3rem 0", textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                {item.label}
              </p>
              <p style={{ color: "#f5f3ee", fontSize: "0.95rem", fontWeight: "700", margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;