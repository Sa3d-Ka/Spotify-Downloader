import express from "express";
import fetchPlaylistFromUrl from "../controllers/urlController.js";
import { fetchPlaylistsFromUser } from "../controllers/userPlaylistController.js";

const playlistRoute = express.Router();

playlistRoute.post("/url", fetchPlaylistFromUrl);
playlistRoute.get("/user", fetchPlaylistsFromUser);

export default playlistRoute;