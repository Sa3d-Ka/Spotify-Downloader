import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import urlRoute from "./routes/urlRoute.js";
import streamRoute from "./routes/streamRoute.js";
import downloadZipRouter from "./routes/downloadZipRouter.js";

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
    credentials: true, 
  }
});

app.use(cors({ origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// ✅ Use routes
app.use("/api/playlist", urlRoute);
app.use("/api/stream", streamRoute(io));
app.use("/api/download-zip", downloadZipRouter);

server.listen(port, () =>
  console.log("Server Started http://localhost:" + port)
);
