import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;  // ← only change

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ACCESS_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}

export default authenticate;