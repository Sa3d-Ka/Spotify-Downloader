import ytdl from '@distube/ytdl-core';
import fs from 'fs';

ytdl('https://www.youtube.com/watch?v=JGwWNGJdvx8', { filter: 'audioonly' })
  .pipe(fs.createWriteStream('test.mp3'))
  .on('finish', () => console.log('Done!'))
  .on('error', err => console.error('Error:', err.message));