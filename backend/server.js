import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import User from './models/user.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import movieRoutes from "./routes/movieRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";

const app=express(); 

app.use(express.json());
app.use(cookieParser()); // CRITICAL: Allows your app to read incoming refresh token cookies
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
const PORT=5000;


connectDB();

app.get("/",(req,res)=>{
    res.send("API is running fine");
});

app.use("/api/auth",authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/favourites", favouriteRoutes);
 
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});