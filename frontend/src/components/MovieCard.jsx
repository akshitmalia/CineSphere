import { useNavigate } from "react-router-dom";
import { getPosterUrl, getYear, formatRating } from "../utils/helpers";

const MovieCard = ({ movie, isFavourite, onToggleFavourite }) => {
  const navigate = useNavigate();

  const handleFavClick = (e) => {
    e.stopPropagation(); // don't navigate when clicking heart
    onToggleFavourite(movie);
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
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
      <div style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}>
        <img
          src={getPosterUrl(movie.posterPath)}
          alt={movie.title}
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
            {formatRating(movie.voteAverage)}
          </span>
        </div>

        {/* Favourite button */}
        <button
          onClick={handleFavClick}
          style={{
            position: "absolute", top: "0.6rem", right: "0.6rem",
            backgroundColor: isFavourite ? "rgba(232,179,57,0.9)" : "rgba(10,10,15,0.85)",
            backdropFilter: "blur(4px)",
            border: "1px solid",
            borderColor: isFavourite ? "#e8b339" : "rgba(255,255,255,0.2)",
            borderRadius: "6px",
            padding: "0.25rem 0.4rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "all 0.2s",
            lineHeight: 1,
          }}
        >
          {isFavourite ? "❤️" : "🤍"}
        </button>

        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 50%)",
          opacity: 0,
          transition: "opacity 0.25s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
        >
          <div style={{
            position: "absolute", bottom: "1rem", left: 0, right: 0,
            textAlign: "center", color: "#e8b339",
            fontSize: "0.8rem", fontWeight: "700",
          }}>
            View Details →
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "0.85rem" }}>
        <h3 style={{
          color: "#f5f3ee",
          fontSize: "0.9rem",
          fontWeight: "700",
          margin: "0 0 0.3rem 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {movie.title}
        </h3>
        <p style={{ color: "#8b8b9a", fontSize: "0.8rem", margin: 0 }}>
          {getYear(movie.releaseDate)}
          {movie.originalLanguage && (
            <span style={{
              marginLeft: "0.5rem",
              backgroundColor: "#2a2a3a",
              borderRadius: "4px",
              padding: "0.1rem 0.4rem",
              fontSize: "0.7rem",
              textTransform: "uppercase",
            }}>
              {movie.originalLanguage}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;