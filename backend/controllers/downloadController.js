import ytdl from "@distube/ytdl-core";
import ytsr from "@distube/ytsr";
import { sanitize } from "../utils/sanitize.js";

// Accept socket instance from router
export const trackDownload = (io) => async (req, res) => {
  const { title, artist, socketId, index } = req.query;

  if (!title || !artist || !socketId || index === undefined) {
    return res.status(400).send("Missing title, artist, index or socketId");
  }

  try {
    const search = await ytsr(`${title} ${artist} song`, { limit: 1 });
    const video = search.items[0];

    if (!video) return res.status(404).send("Video not found");

    const fileName = `${title} - ${artist}.mp3`;
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    const audioStream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    let downloaded = 0;
    let total = 0;

    audioStream.on("progress", (chunkLength, downloadedBytes, totalBytes) => {
      const percent = totalBytes
        ? Math.floor((downloadedBytes / totalBytes) * 100)
        : 0;

      io.to(socketId).emit("download-progress", {
        index: Number(index),
        percent,
      });

      // Optional debug log
      console.log(`Track ${index}: ${percent}% downloaded`);
    });

    audioStream.pipe(res);

    audioStream.on("end", () => {
      io.to(socketId).emit("download-complete", { index: Number(index) });
    });

    audioStream.on("error", (err) => {
      io.to(socketId).emit("download-error", {
        index: Number(index),
        message: err.message,
      });
    });
  } catch (err) {
    console.error("Streaming error:", err.message);
    io.to(socketId).emit("download-error", {
      index: Number(index),
      message: err.message,
    });
    res.status(500).send("Failed to stream");
  }
};
