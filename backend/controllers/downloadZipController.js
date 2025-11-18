import ytdl from 'ytdl-core';
import yts from 'yt-search';
import archiver from 'archiver';

export const downloadZip = async (req, res) => {
  const { tracks } = req.body;
  if (!tracks || !tracks.length) {
    return res.status(400).json({ error: "No tracks provided" });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=tracks.zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(500).end();
  });

  const downloadPromises = tracks.map(async ({ title, artist }) => {
    try {
      const searchResults = await yts(`${title} ${artist}`);
      if (!searchResults.videos.length) {
        console.error(`No video found for: ${title} - ${artist}`);
        return null;
      }

      const video = searchResults.videos[0];
      const fileName = `${title} - ${artist}.mp4`.replace(/[<>:"/\\|?*]/g, '_');

      return new Promise((resolve) => {
        const audioStream = ytdl(video.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
        });

        audioStream.on('error', (err) => {
          console.error(`Stream error for ${fileName}:`, err);
          resolve(null);
        });

        archive.append(audioStream, { name: fileName });
        resolve(fileName);
      });

    } catch (err) {
      console.error(`Failed to download ${title}:`, err);
      return null;
    }
  });

  // Wait for all downloads to be added to archive
  await Promise.all(downloadPromises);
  await archive.finalize();
};