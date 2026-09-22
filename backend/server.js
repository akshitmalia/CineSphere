import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app=express();

app.use(express.json());
const PORT=5000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}
connectDB();

app.get("/",(req,res)=>{
    res.send("API is running fine");
});
 
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});