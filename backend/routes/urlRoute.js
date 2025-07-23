import express from "express";
import fetchPlaylistFromUrl from "../controllers/urlController.js";

const urlRoute = express.Router();

urlRoute.post("/url", fetchPlaylistFromUrl);

export default urlRoute;
