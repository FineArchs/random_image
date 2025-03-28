import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import imageList from './images.json';

const app = new Hono();
const extConvert = new Map<string, string>([
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['png', 'image/png'],
  ['webp', 'image/webp'],
  ['gif', 'image/gif'],
]);

app.use('/images/*', serveStatic({ root: './public/images' }));

app.use(
  '*',
  cors({
    origin: ['https://voskey.icalo.net'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
  }),
);

app.all('/random/*', async (c) => {
  const { searchParams } = new URL(c.req.raw.url);
  const cond = searchParams.get('cond') || '';
  const conds = cond.split(',');
  if (!conds) {
    return new Response('Not found', {
      status: 404,
    });
  }
  const force = searchParams.get('force') === 'true';

  const cache = caches.default;
  const cachedRes = await cache.match(c.req.raw);
  if (!force && cachedRes) {
    return cachedRes;
  }

  const filteredList = imageList.filter(p => p.startsWith(conds.join('/')));

  if (filteredList.length === 0) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const randomIndex = Math.floor(Math.random() * filteredList.length);
  const imagePath = filteredList[randomIndex];

  return c.redirect('images/' + imagePath, 302);
});

export default app;
