import api from "./axios";

export const getTrending = () =>
  api.get("/api/movies/trending").then((r) => r.data.results);

export const getGenres = () =>
  api.get("/api/movies/genres").then((r) => r.data.genres);

// filters: { query, genre, year, language, minRating, page }
export const searchMovies = (filters) =>
  api.get("/api/movies/search", { params: filters }).then((r) => r.data);

export const getMovieDetails = (id) =>
  api.get(`/api/movies/${id}`).then((r) => r.data);
