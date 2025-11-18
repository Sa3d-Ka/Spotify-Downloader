import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import playlistRoute from "./routes/playlistRoute.js";
import streamRoute from "./routes/streamRoute.js";
import downloadZipRouter from "./routes/downloadZipRouter.js";
import authRoute from "./routes/authRoute.js";

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// These are also important
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// ✅ Use routes
app.use("/api/playlist", playlistRoute);
app.use("/api/stream", streamRoute(io));
app.use("/api/download-zip", downloadZipRouter);
app.use("/api/auth", authRoute);

server.listen(port, () =>
  console.log("Server Started http://localhost:" + port)
);
