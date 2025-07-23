import ytdl from '@distube/ytdl-core';
import ytsr from "@distube/ytsr";
import archiver from "archiver";
import { sanitize } from "../utils/sanitize.js";

export const downloadZip = async (req, res) => {
  const { tracks } = req.body;
  if (!tracks || !tracks.length) {
    return res.status(400).json({ error: "No tracks provided" });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=tracks.zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  for (let i = 0; i < tracks.length; i++) {
    const { title, artist } = tracks[i];
    try {
      const search = await ytsr(`${title} ${artist}`, { limit: 1 });
      const video = search.items[0];

      const fileName = sanitize(`${title} - ${artist}.mp3`);
      const stream = ytdl(video.url, {
        filter: "audioonly",
        quality: "highestaudio",
      });

      archive.append(stream, { name: fileName });
    } catch (err) {
      console.error(`Failed to download ${title}: ${err.message}`);
    }
  }

  archive.finalize();
};
