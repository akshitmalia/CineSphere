// Build a full TMDb image URL from the path TMDb gives us
// TMDb never gives full URLs — always just a path like "/abc123.jpg"
// size options: w92, w154, w185, w342, w500, w780, original
export const getPosterUrl = (path, size = "w342") => {
  if (!path) return "/no-poster.png"; // fallback image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path, size = "w1280") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getProfileUrl = (path, size = "w185") => {
  if (!path) return "/no-profile.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// "2008-07-18" → "2008"
export const getYear = (dateStr) => {
  if (!dateStr) return "N/A";
  return dateStr.split("-")[0];
};

// "2008-07-18" → "Jul 18, 2008"
export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

// 162 → "2h 42m"
export const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// 7.842 → "7.8"
export const formatRating = (rating) => {
  if (!rating) return "N/A";
  return Number(rating).toFixed(1);
};
