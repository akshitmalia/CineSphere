import express from "express";
import authenticate from "../middleware/auth_middleware.js";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/fav.js";

const router = express.Router();

router.use(authenticate); // protects all routes below

router.get("/", getFavourites);
router.post("/", addFavourite);
router.delete("/:tmdbMovieId", removeFavourite);

export default router;