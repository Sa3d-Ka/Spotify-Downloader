// downloadSocket.js
import search from "youtube-search-api";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const downloadSocketHandler = (socket) => {
  socket.on("download-tracks", async (tracks) => {
    for (const track of tracks) {
      const query = `${track.title} ${track.artist}`;
      const result = await search.GetListByKeyword(query, false, 1);
      const video = result.items?.[0];

      if (video) {
        const url = `https://www.youtube.com/watch?v=${video.id}`;
        
        for (let progress = 0; progress <= 100; progress += 10) {
          socket.emit("progress", { title: track.title, progress });
          await delay(400);
        }

        socket.emit("done", { title: track.title, url });
      } else {
        socket.emit("error", { title: track.title, message: "Not found" });
      }
    }
  });
};

export default downloadSocketHandler;
