import ytdl from '@distube/ytdl-core';
import fs from "fs";
import path from "path";
import archiver from "archiver";
import pkg from "youtube-search-api";
const { search } = pkg;

// Helper to sanitize filenames
const sanitizeFileName = (name) => name.replace(/[^a-z0-9\-]/gi, "_");

export const downloadTrack = async (req, res, io) => {
  const { tracks, socketId } = req.body;

  if (!tracks || !Array.isArray(tracks) || tracks.length === 0 || !socketId) {
    return res.status(400).json({ error: "Missing tracks or socketId" });
  }

  res.json({ message: "Download started", total: tracks.length });

  const downloadedFiles = [];

  for (let i = 0; i < tracks.length; i++) {
    const { title, artist } = tracks[i];
    const query = `${title} ${artist} song`;

    try {
      const results = await search(query, { type: "video" });
      if (!results.items || results.items.length === 0) {
        io.to(socketId).emit("download-failed", {
          track: title,
          message: "No video found",
        });
        continue;
      }

      const video = results.items[0];
      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
      const fileName = sanitizeFileName(`${title}-${artist}.mp3`);
      const filePath = path.resolve("../downloads", fileName);

      const stream = ytdl(videoUrl, { filter: "audioonly" });
      stream.pipe(fs.createWriteStream(filePath));

      stream.on("progress", (_, __, downloaded, total) => {
        const percent = Math.floor((downloaded / total) * 100);
        io.to(socketId).emit("download-progress", { index: i, title, percent });
      });

      await new Promise((resolve, reject) => {
        stream.on("end", () => {
          io.to(socketId).emit("download-complete", {
            index: i,
            title,
            file: fileName,
          });
          downloadedFiles.push({ title, artist, fileName });
          resolve();
        });
        stream.on("error", reject);
      });
    } catch (err) {
      console.error(`Download error for "${title}":`, err);
      io.to(socketId).emit("download-error", {
        index: i,
        title,
        message: err.message || "Failed to download",
      });
    }
  }

  // Create ZIP file
  const zipFileName = `tracks-${Date.now()}.zip`;
  const zipPath = path.resolve("../downloads", zipFileName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    io.to(socketId).emit("zip-complete", {
      file: zipFileName,
      size: archive.pointer(),
      message: "All tracks zipped successfully.",
    });
  });

  archive.on("error", (err) => {
    io.to(socketId).emit("zip-error", {
      message: "Zipping failed",
      error: err.message,
    });
  });

  archive.pipe(output);

  downloadedFiles.forEach(({ fileName }) => {
    const filePath = path.resolve("../downloads", fileName);
    archive.file(filePath, { name: fileName });
  });

  await archive.finalize();

  // Auto delete files after 10 minutes
  const DELETE_AFTER = 10 * 60 * 1000;
  [...downloadedFiles.map((f) => f.fileName), zipFileName].forEach((file) => {
    const filePath = path.resolve("../downloads", file);
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete ${filePath}:`, err.message);
        else console.log(`Deleted: ${filePath}`);
      });
    }, DELETE_AFTER);
  });
};
