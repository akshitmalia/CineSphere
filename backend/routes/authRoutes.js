import express from 'express';
const router = express.Router();

import authenticate from '../middleware/auth_middleware.js';
import { register,login,logout,refresh } from '../controllers/auth.js';

router.post("/register", register);
router.post("/login", login);
router.post("/logout",logout);
router.post("/refresh", refresh);

export default router;