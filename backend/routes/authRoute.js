// routes/auth.js
import express from "express";
import { exchangeSpotifyCode, getAuthStatus, loginWithSpotify, logout } from "../controllers/authController.js";


const router = express.Router();

router.get("/login", loginWithSpotify);
router.get("/callback", exchangeSpotifyCode);
router.get("/status", getAuthStatus);
router.post("/logout", logout);  

export default router;
