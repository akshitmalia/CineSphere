import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// // 1. CRITICAL FIX: You must invoke dotenv to populate process.env
// dotenv.config();

// Define your token secrets from your .env file
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Register Controller
async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email or Password not provided" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    
    // FIX: User.create already saves to DB. (Removed the redundant newUser.save() line)
    const newUser = await User.create({ email: email, password: hashedPassword });

    // 2. Generate Access Token (Short lifespan)
    const accessToken = jwt.sign(
      { id: newUser._id },
      ACCESS_SECRET,
      { expiresIn: "15m" } 
    );

    // 3. Generate Refresh Token (Long lifespan)
    const refreshToken = jwt.sign(
      { id: newUser._id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Store the Long-Lived Refresh Token in a Secure HTTP-Only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
 
    // 5. Send the Short-Lived Access Token in the JSON Response
    // The frontend frontend framework will store this access token in application memory
    return res.status(201).json({
      message: "User registered successfully",
      accessToken, // Frontend reads this for API authorization headers
      user: { id: newUser._id, email: newUser.email}
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email or Password not provided" });
    }

    // ✅ FIX 2: .select("+password") because select:false in schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Compare manually here
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, email: user.email },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login Unsuccessful" });
  }
}

// Logout
async function logout(req,res){
    try{
        res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true, 
      sameSite: "None"    
      // no need to mention maxAge in it     
        });
     return res.status(200).json({message:"Logout Successful"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// Refresh Token Controller 
async function refresh(req, res) {
  try {
    // 1. Grab the refresh token from the secure cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Session expired. Please login again." });
    }

    // 2. Verify the token using the refresh secret
    jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired session key." });
      }

      // 3. Token is valid! Issue a brand new short-lived access token
      const accessToken = jwt.sign(
        { id: decoded.id }, 
        ACCESS_SECRET, 
        { expiresIn: "15m" }
      );

      return res.status(200).json({ accessToken });
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}




export { register,login, logout,refresh }; //exporting our controllers in nodejs
// How you import it: import { register, login } from "./controllers/auth.js";
// Why it's good: It forces you to use the exact function names, which prevents typos across your files.


//Another Method 
// const authController = { register, login, logout };
// export default authController;
// How you import it: import auth from "./controllers/auth.js";How you use it in your router: router.post("/login", auth.login);
