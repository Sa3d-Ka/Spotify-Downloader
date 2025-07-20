import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import urlRoute from "./routes/urlRoute.js";
import downloadRoute from "./routes/downloadRouter.js";


const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// api endpoints
app.use("/api/playlist", urlRoute);
app.use("/api/download", downloadRoute(io));

// WebSocket
io.on("connection", (socket) => {
  console.log("✅ WebSocket Connected:", socket.id);
  downloadSocketHandler(socket);
});

app.listen(port, () => console.log("Server Started http://localhost:" + port));
