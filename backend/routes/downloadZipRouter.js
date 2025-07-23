import express from "express";
import { downloadZip } from "../controllers/downloadZipController.js";

const router = express.Router();
router.post("/", downloadZip);

export default router;
