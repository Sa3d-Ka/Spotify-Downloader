import express from "express";
import { trackDownload } from "../controllers/downloadController.js";

export default (io) => {
  const router = express.Router();
  router.get("/", trackDownload(io));
  return router;
};
