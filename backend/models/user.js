// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true }
// });


// const User=mongoose.model("User",userSchema);
// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    select: false    // ← only add this one line, never returned by default
  },
  refreshTokenHash: { 
    type: String, 
    default: null,
    select: false    // ← same here
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;