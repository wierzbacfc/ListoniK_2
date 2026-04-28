import https from 'https';
import fs from 'fs';

const url = 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png';
const file = fs.createWriteStream('public/icon-512x512.png');

https.get(url, (response) => {
  response.pipe(file);
});
