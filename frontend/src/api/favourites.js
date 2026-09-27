import api from "./axios";

export const getFavourites = () =>
  api.get("/api/favourites").then((r) => r.data.favourites);

export const addFavourite = (movie) =>
  api.post("/api/favourites", {
    tmdbMovieId: movie.id,
    title:       movie.title,
    posterPath:  movie.posterPath,
    releaseDate: movie.releaseDate,
    voteAverage: movie.voteAverage,
  }).then((r) => r.data);

export const removeFavourite = (tmdbMovieId) =>
  api.delete(`/api/favourites/${tmdbMovieId}`).then((r) => r.data);
