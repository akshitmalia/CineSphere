import Favourite from "../models/favourite.js";

// GET /api/favourites
async function getFavourites(req, res) {
  try {
    const favourites = await Favourite.find({ userId: req.user.id })
                                      .sort({ createdAt: -1 });

    return res.status(200).json({ favourites });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not fetch favourites" });
  }
}

// POST /api/favourites
async function addFavourite(req, res) {
  try {
    const { tmdbMovieId, title, posterPath, releaseDate, voteAverage } = req.body;

    if (!tmdbMovieId || !title) {
      return res.status(400).json({ message: "tmdbMovieId and title are required" });
    }

    const fav = await Favourite.findOneAndUpdate(
      { userId: req.user.id, tmdbMovieId },
      { userId: req.user.id, tmdbMovieId, title, posterPath, releaseDate, voteAverage },
      { upsert: true, new: true }
    );

    return res.status(201).json({ message: "Added to favourites", favourite: fav });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not add favourite" });
  }
}

// DELETE /api/favourites/:tmdbMovieId
async function removeFavourite(req, res) {
  try {
    const { tmdbMovieId } = req.params;

    await Favourite.findOneAndDelete({
      userId: req.user.id,
      tmdbMovieId: Number(tmdbMovieId),
    });

    return res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not remove favourite" });
  }
}

export { getFavourites, addFavourite, removeFavourite };