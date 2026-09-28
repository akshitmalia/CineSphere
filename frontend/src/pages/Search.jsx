import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { searchMovies, getGenres } from "../api/movies";
import { getFavourites, addFavourite, removeFavourite } from "../api/favourites";

const ACCENT = "#e8b339";

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
  backgroundColor: "#0a0a0f",
  border: "1px solid #2a2a3a",
  borderRadius: "8px",
  padding: "0.7rem 1rem",
  color: "#f5f3ee",
  fontSize: "0.9rem",
  cursor: "pointer",
  outline: "none",
  fontFamily: "Manrope, sans-serif",
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const [showFilters, setShowFilters] = useState(false);

  // Reliable JS-based mobile detection using matchMedia — this replaces the
  // CSS @media approach that wasn't rendering the button at all in your build.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Live navbar height so the search bar always sticks right below it,
  // regardless of how tall Navbar renders on any given screen size.
  const navWrapRef = useRef(null);
  const [navHeight, setNavHeight] = useState(64);

  useEffect(() => {
    const el = navWrapRef.current;
    if (!el) return;
    const update = () => setNavHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const debounceRef = useRef(null);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
    getFavourites()
      .then((favs) => setFavouriteIds(new Set(favs.map((f) => f.tmdbMovieId))))
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = { query, genre, year, language, minRating, page };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, year, language, minRating, page]);

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
  const activeFilterCount = [genre, year, language, minRating].filter(Boolean).length;

  return (
    <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>

      {/* Navbar always stays on top of everything else */}
      <div
        ref={navWrapRef}
        style={{ position: "sticky", top: 0, zIndex: 200, backgroundColor: "#0a0a0f" }}
      >
        <Navbar />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* ── Search + Filters bar ── */}
      <div
        style={{
          backgroundColor: "#14141c",
          borderBottom: "1px solid #2a2a3a",
          padding: isMobile ? "0.85rem 1rem" : "1.25rem 2.5rem",
          position: "sticky",
          top: navHeight,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
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
              onFocus={(e) => e.target.style.borderColor = ACCENT}
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

          {/* Icon-only gear toggle — ONLY rendered when isMobile is true, so
              there's no CSS to fail to apply; it's a plain JS conditional. */}
          {isMobile && (
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Toggle filters"
              style={{
                position: "relative",
                width: "44px",
                height: "44px",
                padding: 0,
                backgroundColor: "#0a0a0f",
                border: "1px solid #2a2a3a",
                borderRadius: "10px",
                color: "#f5f3ee",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ⚙
              {activeFilterCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: ACCENT,
                  color: "#0a0a0f",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Desktop: filters inline, in normal flow */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginTop: "1rem" }}>
            <select value={genre} onChange={(e) => handleFilterChange(setGenre)(e.target.value)} style={{ ...selectStyle, minWidth: "140px" }}>
              <option value="">All Genres</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <select value={year} onChange={(e) => handleFilterChange(setYear)(e.target.value)} style={{ ...selectStyle, minWidth: "140px" }}>
              <option value="">All Years</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={language} onChange={(e) => handleFilterChange(setLanguage)(e.target.value)} style={{ ...selectStyle, minWidth: "140px" }}>
              <option value="">All Languages</option>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>

            <select value={minRating} onChange={(e) => handleFilterChange(setMinRating)(e.target.value)} style={{ ...selectStyle, minWidth: "140px" }}>
              {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>

            {hasFilters && (
              <button onClick={clearFilters} style={{
                padding: "0.6rem 1rem", backgroundColor: "transparent", border: "1px solid #ef4444",
                borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "Manrope, sans-serif",
              }}>
                ✕ Clear
              </button>
            )}

            {totalResults > 0 && !loading && (
              <span style={{ color: "#8b8b9a", fontSize: "0.85rem", marginLeft: "auto" }}>
                {totalResults.toLocaleString()} results
              </span>
            )}
          </div>
        )}

        {/* Mobile filter overlay — only in the DOM at all when isMobile && showFilters */}
        {isMobile && showFilters && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: "1rem",
            right: "1rem",
            marginTop: "0.5rem",
            backgroundColor: "#1c1c28",
            border: "1px solid #2a2a3a",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
            zIndex: 999,
          }}>
            <select value={genre} onChange={(e) => handleFilterChange(setGenre)(e.target.value)} style={selectStyle}>
              <option value="">All Genres</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <div style={{ display: "flex", gap: "0.65rem" }}>
              <select value={year} onChange={(e) => handleFilterChange(setYear)(e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 0 }}>
                <option value="">All Years</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={language} onChange={(e) => handleFilterChange(setLanguage)(e.target.value)} style={{ ...selectStyle, flex: 1, minWidth: 0 }}>
                <option value="">All Languages</option>
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            <select value={minRating} onChange={(e) => handleFilterChange(setMinRating)(e.target.value)} style={selectStyle}>
              {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>

            <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.25rem" }}>
              {hasFilters && (
                <button onClick={clearFilters} style={{
                  flex: 1, padding: "0.7rem", backgroundColor: "transparent", border: "1px solid #ef4444",
                  borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "Manrope, sans-serif",
                }}>
                  ✕ Clear
                </button>
              )}
              <button onClick={() => setShowFilters(false)} style={{
                flex: 1, padding: "0.7rem", backgroundColor: ACCENT, border: "none",
                borderRadius: "8px", color: "#0a0a0f", fontSize: "0.85rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "Manrope, sans-serif",
              }}>
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tap-outside backdrop, mobile-only */}
      {isMobile && showFilters && (
        <div
          onClick={() => setShowFilters(false)}
          style={{ position: "fixed", inset: 0, zIndex: 90, backgroundColor: "rgba(0,0,0,0.4)" }}
        />
      )}

      {isMobile && totalResults > 0 && !loading && (
        <div style={{ padding: "0.75rem 1rem 0", color: "#8b8b9a", fontSize: "0.8rem" }}>
          {totalResults.toLocaleString()} results
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ padding: isMobile ? "1rem" : "2rem 2.5rem", maxWidth: "1400px", margin: "0 auto" }}>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1.25rem" }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: "#14141c", borderRadius: "12px", overflow: "hidden", border: "1px solid #2a2a3a" }}>
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

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#f87171", fontSize: "1rem" }}>
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && totalResults === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎬</div>
            <h3 style={{ color: "#f5f3ee", fontSize: "1.3rem", marginBottom: "0.5rem" }}>No movies found</h3>
            <p style={{ color: "#8b8b9a" }}>Try different search terms or adjust your filters</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1.25rem" }}>
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavourite={favouriteIds.has(movie.id)}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default Search;