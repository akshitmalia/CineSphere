import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tmdbMovieId: {
    type: Number,
    required: true,
  },
  // Snapshot stored at time of saving — watchlist loads instantly from MongoDB
  title: { type: String, required: true },
  posterPath: { type: String },
  releaseDate: { type: String },
  voteAverage: { type: Number },
}, { timestamps: true });

// One user cannot save the same movie twice
favouriteSchema.index({ userId: 1, tmdbMovieId: 1 }, { unique: true });

const Favourite = mongoose.model("Favourite", favouriteSchema);
export default Favourite;