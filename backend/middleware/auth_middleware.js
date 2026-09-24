import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET ;

async function authenticate(req, res, next) {
  try {
    // 1. Extract token from the Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the short-lived access token
    const decoded = jwt.verify(token, ACCESS_SECRET);

    // 3. Attach user ID data to the request object for the next functions
    req.user = decoded;
    next();
    
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}

export default authenticate;
