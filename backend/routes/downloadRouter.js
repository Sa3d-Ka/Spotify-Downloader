// routes/streamRoute.js
import express from "express";
import { trackDownload } from "../controllers/downloadController.js";


const downloadRouter = express.Router();

router.get("/", trackDownload);

export default downloadRouter;
