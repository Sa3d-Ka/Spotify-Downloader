// routes/auth.js
import express from "express";
import { exchangeSpotifyCode, loginWithSpotify } from "../controllers/authController.js";


const router = express.Router();

router.get("/login", loginWithSpotify);
router.get("/callback", exchangeSpotifyCode);

export default router;
