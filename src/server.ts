import express from 'express';
import { render } from './render';

// create app
const app = express();

app.get('/body.png', async function (req, res) {
  try {
    const skinId: string = req.query.skin ? req.query.skin.toString() : 'alex'; // default skin is alex
    const capeId: string | null = req.query.cape ? req.query.cape.toString() : null;
    const slim: boolean = req.query.slim ? req.query.slim.toString().toLowerCase() == 'true' : false;
    // you would want to modify this to go to your own texture server.
    // I am just using my own
    const skinBuffer: Buffer | null = await render(
      384,
      {
        skinId,
        capeId,
        slim
      }
    );
    if (!skinBuffer) return res.sendStatus(404);
    res.setHeader('Content-Type', 'image/png');
    res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': skinBuffer.length });
    res.end(skinBuffer);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(80, () => {
  console.log('Website is online');
});
