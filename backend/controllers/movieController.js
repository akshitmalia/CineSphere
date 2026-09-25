//to retrieve the typed movie name
// showcase

import axios from "axios";

const TMDB_BASE = process.env.TMDB_BASE_URL;
const TMDB_KEY = process.env.TMDB_API_KEY;

// GET /api/movies/trending
async function getTrending(req, res) {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/trending/movie/week`, {
      params: { api_key: TMDB_KEY },
    });

    const results = data.results.slice(0, 10).map((m) => ({
      id: m.id,
      title: m.title,
      posterPath: m.poster_path,
      backdropPath: m.backdrop_path,
      voteAverage: m.vote_average,
      overview: m.overview,
    }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch trending movies" });
  }
}

// GET /api/movies/genres
async function getGenres(req, res) {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/genre/movie/list`, {
      params: { api_key: TMDB_KEY },
    });

    return res.status(200).json({ genres: data.genres });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch genres" });
  }
}

// GET /api/movies/search
// Query params: query, genre, year, language, minRating, page
async function searchMovies(req, res) {
  try {
    const { query, genre, year, language, minRating, page = 1 } = req.query;

    let url = "";
    let params = {
      api_key: TMDB_KEY,
      page,
      include_adult: false,
    };

    if (query) {
      // User typed a title — use search endpoint
      url = `${TMDB_BASE}/search/movie`;
      params.query = query;
      if (year) params.year = year;
    } else {
      // No title — use discover for full filter support
      url = `${TMDB_BASE}/discover/movie`;
      params.sort_by = "popularity.desc";
      if (genre) params.with_genres = genre;
      if (year) params.primary_release_year = year;
      if (language) params.with_original_language = language;
      if (minRating) params["vote_average.gte"] = minRating;
    }

    const { data } = await axios.get(url, { params });

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      posterPath: m.poster_path,
      backdropPath: m.backdrop_path,
      releaseDate: m.release_date,
      voteAverage: m.vote_average,
      genreIds: m.genre_ids,
      overview: m.overview,
      originalLanguage: m.original_language,
    }));

    return res.status(200).json({
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Movie search failed" });
  }
}

// GET /api/movies/:id
async function getMovieDetails(req, res) {
  try {
    const { id } = req.params;

    const { data } = await axios.get(`${TMDB_BASE}/movie/${id}`, {
      params: {
        api_key: TMDB_KEY,
        append_to_response: "credits,videos",
      },
    });

    const trailer = data.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    return res.status(200).json({
      id: data.id,
      title: data.title,
      overview: data.overview,
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      releaseDate: data.release_date,
      runtime: data.runtime,
      voteAverage: data.vote_average,
      genres: data.genres,
      originalLanguage: data.original_language,
      cast: data.credits?.cast?.slice(0, 10).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })),
      trailerKey: trailer ? trailer.key : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch movie details" });
  }
}

export { getTrending, getGenres, searchMovies, getMovieDetails };