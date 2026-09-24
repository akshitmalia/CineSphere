import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import User from './models/user.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from './routes/authRoutes.js';

const app=express();

app.use(express.json());
app.use(cookieParser()); // CRITICAL: Allows your app to read incoming refresh token cookies
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL later
  credentials: true // CRITICAL: Allows cross-origin cookies to flow back and forth
}));
const PORT=5000;


connectDB();

app.get("/",(req,res)=>{
    res.send("API is running fine");
});
app.use("/api/auth",authRouter);
 
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});