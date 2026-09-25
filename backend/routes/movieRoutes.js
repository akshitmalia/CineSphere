import express from "express";
import authenticate from "../middleware/auth_middleware.js";
import {
  getTrending,
  getGenres,
  searchMovies,
  getMovieDetails,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/trending", authenticate, getTrending);
router.get("/genres", authenticate, getGenres);
router.get("/search", authenticate, searchMovies);
router.get("/:id", authenticate, getMovieDetails);  // ← must always be last

export default router;