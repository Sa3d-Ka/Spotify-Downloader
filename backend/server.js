import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import urlRoute from "./routes/urlRoute.js";
import downloadRouter from "./routes/downloadRouter.js";

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// ✅ Use routes
app.use("/api/playlist", urlRoute);
app.use("/api/download", downloadRouter);

server.listen(port, () =>
  console.log("Server Started http://localhost:" + port)
);
