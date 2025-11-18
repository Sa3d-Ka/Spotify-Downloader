// import youtubedl from "youtube-dl-exec";
// import ffmpegPath from "ffmpeg-static";
// import ytsr from "@distube/ytsr";

export const trackDownload = (io) => async (req, res) => {
  // const { title, artist, socketId, index } = req.query;

  // if (!title || !artist || !socketId || index === undefined) {
  //   return res.status(400).send("Missing parameters");
  // }

  // try {
  //   const results = await ytsr(`${title} ${artist} song`, { limit: 5 });
  //   const video = results.items.find((i) => i.type === "video");

  //   if (!video) {
  //     return res.status(404).send("Video not found");
  //   }

  //   const fileName = `${title} - ${artist}.mp3`;
  //   res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  //   res.setHeader("Content-Type", "audio/mpeg");

  //   const audioStream = ytdl(video.url, {
  //     filter: "audioonly",
  //     quality: "highestaudio",
  //     requestOptions: {
  //       headers: {
  //         "User-Agent":
  //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  //       },
  //     },
  //   });

  //   audioStream.on("progress", (chunkLength, downloaded, total) => {
  //     const percent = total ? Math.floor((downloaded / total) * 100) : 0;

  //     io.to(socketId).emit("download-progress", {
  //       index: Number(index),
  //       percent,
  //     });
  //   });

  //   audioStream.on("error", (err) => {
  //     console.error("YTDL error:", err);

  //     if (!res.headersSent) {
  //       res.status(500).send("Stream error");
  //     }

  //     io.to(socketId).emit("download-error", {
  //       index: Number(index),
  //       message: err.message,
  //     });
  //   });

  //   audioStream.on("end", () => {
  //     io.to(socketId).emit("download-complete", {
  //       index: Number(index),
  //     });
  //   });

  //   audioStream.pipe(res);
  // } catch (err) {
  //   console.error("Fatal error:", err);
  //   if (!res.headersSent) {
  //     res.status(500).send("Failed to stream");
  //   }
  // }
};
