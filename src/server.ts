import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import { render } from './render';

const config = JSON.parse(fs.readFileSync('config.json').toString());

const CACHE_LOCATION = config.cache.location;
const CACHE_SKIN_IMAGES = config.cache.skins; // it's smart to cache the skin images for performance reasons. Though for debugging you probably would want to disable this

if (!fs.existsSync(CACHE_LOCATION)) fs.mkdirSync(CACHE_LOCATION, { recursive: true });

// create app
const app = express();

app.get('/body.png', async function (req, res) {
  try {
    const skinId: string = req.query.skin ? req.query.skin.toString() : 'alex'; // default skin is alex
    const capeId: string | null = req.query.cape ? req.query.cape.toString() : null;
    const slim: boolean = req.query.slim ? req.query.slim.toString().toLowerCase() == 'true' : false;
    const size: number = req.query.size ? parseInt(req.query.size.toString()) : 384;
    const key: string = `${size}x${skinId}-${capeId}-${slim}`;
    const isCached: boolean = fs.existsSync(`${CACHE_LOCATION}/${key}.png`);
    // you would want to modify this to go to your own texture server.
    // I am just using my own
    const skinBuffer: Buffer | null = isCached && CACHE_SKIN_IMAGES ? fs.readFileSync(`${CACHE_LOCATION}/${key}.png`) : await render(
      size,
      {
        skinId,
        capeId,
        slim,
      }
    );
    if (!skinBuffer) return res.sendStatus(404);
    res.setHeader('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=604800');
    res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': skinBuffer.length });
    res.end(skinBuffer);
    if (!isCached && CACHE_SKIN_IMAGES) fs.writeFileSync(`${CACHE_LOCATION}/${key}.png`, skinBuffer);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(process.env.PORT || 80, () => {
  console.log('Website is online');
});
