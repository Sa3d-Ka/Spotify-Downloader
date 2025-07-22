import ytdl from '@distube/ytdl-core';
import ytsr from "@distube/ytsr";
import { sanitize } from "../utils/sanitize.js";


export const trackDownload = async (req, res) => {
  const { title, artist } = req.query;
  if (!title || !artist) return res.status(400).send("Missing title or artist");

  try {
    const search = await ytsr(`${title} ${artist}`, { limit: 1 });
    const video = search.items[0];

    const fileName = sanitize(`${title} - ${artist}.mp3`);

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
    }).pipe(res);
  } catch (err) {
    console.error("Streaming error:", err.message);
    res.status(500).send("Failed to stream");
  }
}