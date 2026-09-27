import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { searchMovies, getGenres } from "../api/movies";
import { getFavourites, addFavourite, removeFavourite } from "../api/favourites";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "zh", label: "Chinese" },
  { code: "ta", label: "Tamil" },
];

const YEARS = Array.from({ length: 35 }, (_, i) => 2025 - i);
const RATINGS = [
  { value: "", label: "Any Rating" },
  { value: "9", label: "9+ ⭐ Masterpiece" },
  { value: "8", label: "8+ ⭐ Excellent" },
  { value: "7", label: "7+ ⭐ Good" },
  { value: "6", label: "6+ ⭐ Decent" },
];

const selectStyle = {
  backgroundColor: "#14141c",
  border: "1px solid #2a2a3a",
  borderRadius: "8px",
  padding: "0.6rem 1rem",
  color: "#f5f3ee",
  fontSize: "0.85rem",
  cursor: "pointer",
  outline: "none",
  fontFamily: "Manrope, sans-serif",
  minWidth: "140px",
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL so filters survive refresh + are shareable
  const [query, setQuery]       = useState(searchParams.get("query") || "");
  const [genre, setGenre]       = useState(searchParams.get("genre") || "");
  const [year, setYear]         = useState(searchParams.get("year") || "");
  const [language, setLanguage] = useState(searchParams.get("language") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [page, setPage]         = useState(Number(searchParams.get("page")) || 1);

  const [movies, setMovies]     = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [genres, setGenres]     = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const debounceRef = useRef(null);

  // Load genres and favourites once on mount
  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
    getFavourites()
      .then((favs) => setFavouriteIds(new Set(favs.map((f) => f.tmdbMovieId))))
      .catch(() => {});
  }, []);

  // Fetch movies whenever filters change
  const fetchMovies = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (params.query)     filters.query     = params.query;
      if (params.genre)     filters.genre     = params.genre;
      if (params.year)      filters.year      = params.year;
      if (params.language)  filters.language  = params.language;
      if (params.minRating) filters.minRating = params.minRating;
      filters.page = params.page || 1;

      const data = await searchMovies(filters);
      setMovies(data.results || []);
      setTotalPages(Math.min(data.totalPages || 1, 500));
      setTotalResults(data.totalResults || 0);
    } catch {
      setError("Failed to fetch movies. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search — waits 500ms after user stops typing
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = { query, genre, year, language, minRating, page };

      // Sync to URL
      const urlParams = {};
      if (query)     urlParams.query     = query;
      if (genre)     urlParams.genre     = genre;
      if (year)      urlParams.year      = year;
      if (language)  urlParams.language  = language;
      if (minRating) urlParams.minRating = minRating;
      if (page > 1)  urlParams.page      = String(page);
      setSearchParams(urlParams, { replace: true });

      fetchMovies(params);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query, genre, year, language, minRating, page]);

  // Reset to page 1 when any filter changes
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFavourite = async (movie) => {
    if (favouriteIds.has(movie.id)) {
      await removeFavourite(movie.id);
      setFavouriteIds((prev) => { const s = new Set(prev); s.delete(movie.id); return s; });
    } else {
      await addFavourite(movie);
      setFavouriteIds((prev) => new Set(prev).add(movie.id));
    }
  };

  const clearFilters = () => {
    setQuery(""); setGenre(""); setYear("");
    setLanguage(""); setMinRating(""); setPage(1);
  };

  const hasFilters = query || genre || year || language || minRating;

  return (
    <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>
      <Navbar />

      <div style={{ paddingTop: "80px" }}>

        {/* ── Search + Filters bar ── */}
        <div style={{
          backgroundColor: "#14141c",
          borderBottom: "1px solid #2a2a3a",
          padding: "1.25rem 2.5rem",
          position: "sticky", top: "64px", zIndex: 50,
        }}>
          {/* Search input */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <span style={{
              position: "absolute", left: "1rem", top: "50%",
              transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => handleFilterChange(setQuery)(e.target.value)}
              placeholder="Search movies by title..."
              style={{
                width: "100%",
                backgroundColor: "#0a0a0f",
                border: "1px solid #2a2a3a",
                borderRadius: "10px",
                padding: "0.85rem 1rem 0.85rem 2.75rem",
                color: "#f5f3ee",
                fontSize: "1rem",
                outline: "none",
                fontFamily: "Manrope, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#e8b339"}
              onBlur={(e) => e.target.style.borderColor = "#2a2a3a"}
            />
            {query && (
              <button onClick={() => handleFilterChange(setQuery)("")} style={{
                position: "absolute", right: "1rem", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#8b8b9a", cursor: "pointer", fontSize: "1.1rem",
              }}>✕</button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div style={{
            display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center",
          }}>
            {/* Genre */}
            <select
              value={genre}
              onChange={(e) => handleFilterChange(setGenre)(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={year}
              onChange={(e) => handleFilterChange(setYear)(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Language */}
            <select
              value={language}
              onChange={(e) => handleFilterChange(setLanguage)(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>

            {/* Min Rating */}
            <select
              value={minRating}
              onChange={(e) => handleFilterChange(setMinRating)(e.target.value)}
              style={selectStyle}
            >
              {RATINGS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Clear filters */}
            {hasFilters && (
              <button onClick={clearFilters} style={{
                padding: "0.6rem 1rem",
                backgroundColor: "transparent",
                border: "1px solid #ef4444",
                borderRadius: "8px",
                color: "#ef4444",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "Manrope, sans-serif",
              }}>
                ✕ Clear
              </button>
            )}

            {/* Results count */}
            {totalResults > 0 && !loading && (
              <span style={{ color: "#8b8b9a", fontSize: "0.85rem", marginLeft: "auto" }}>
                {totalResults.toLocaleString()} results
              </span>
            )}
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ padding: "2rem 2.5rem", maxWidth: "1400px", margin: "0 auto" }}>

          {/* Loading skeletons */}
          {loading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1.25rem",
            }}>
              {Array.from({ length: 20 }).map((_, i) => (
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
            </div>
          )}

          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>

          {/* Error */}
          {error && !loading && (
            <div style={{
              textAlign: "center", padding: "4rem",
              color: "#f87171", fontSize: "1rem",
            }}>
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && movies.length === 0 && (
            <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎬</div>
              <h3 style={{ color: "#f5f3ee", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
                No movies found
              </h3>
              <p style={{ color: "#8b8b9a" }}>
                Try different search terms or adjust your filters
              </p>
            </div>
          )}

          {/* Movie grid */}
          {!loading && movies.length > 0 && (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1.25rem",
              }}>
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavourite={favouriteIds.has(movie.id)}
                    onToggleFavourite={handleToggleFavourite}
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;