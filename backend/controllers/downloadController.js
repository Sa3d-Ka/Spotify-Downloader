import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import pkg from 'youtube-search-api'; // ✅ fix here
const { search } = pkg;


export const downloadTrack = async (req, res, io) => {
  const { tracks, socketId } = req.body;
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0 || !socketId) {
    return res.status(400).json({ error: 'Missing tracks or socketId' });
  }

  res.json({ message: 'Download started', total: tracks.length });

  for (let i = 0; i < tracks.length; i++) {
    const { title, artist } = tracks[i];
    const query = `${title} ${artist} audio`;

    try {
      const results = await search(query, { type: "video" });
      if (!results.items || results.items.length === 0) {
        io.to(socketId).emit('download-failed', {
          track: title,
          message: 'No video found'
        });
        continue;
      }

      const video = results.items[0];
      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
      const fileName = `${title}-${artist}.mp3`;
      const filePath = path.resolve('./downloads', fileName);

      const stream = ytdl(videoUrl, { filter: 'audioonly' });
      stream.pipe(fs.createWriteStream(filePath));

      stream.on('progress', (_, __, downloaded, total) => {
        const percent = Math.floor((downloaded / total) * 100);
        io.to(socketId).emit('download-progress', {
          index: i,
          title,
          percent
        });
      });

      await new Promise((resolve, reject) => {
        stream.on('end', () => {
          io.to(socketId).emit('download-complete', {
            index: i,
            title,
            file: fileName
          });
          resolve();
        });
        stream.on('error', reject);
      });

    } catch (err) {
      io.to(socketId).emit('download-error', {
        title,
        message: 'Failed to download'
      });
    }
  }
};
