import context from 'gl';
import { Canvas, Image } from 'canvas';
import THREE, { Texture } from 'three';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import PlayerModel from './models/PlayerModel';
import { ModelOptions, degrees_to_radians } from './models/ModelUtils';

const { window } = new JSDOM();

global.THREE = require("three");
global.document = window.document;

function toCanvas(image: Image, x: number = 0, y: number = 0, w: number = image.width, h: number = image.height): Canvas | null {
  if (!image) return null;
  if (imageScale(image.height) >= 32) return null;

  const canvas = new Canvas(w, h);
  const context = canvas.getContext('2d');
  context.drawImage(image, x, y, w, h, 0, 0, w, h);

  return canvas;
}

async function toImage(url: string): Promise<Image | null> {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(null);
    let image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function imageScale(height: number): number {
  if (height % 22 === 0) {
    return height / 22;
  } else if (height % 17 === 0) {
    return height / 17;
  } else if (height >= 32 && (height & (height - 1)) === 0) {
    return height / 32;
  } else {
    return Math.max(1, Math.floor(height / 22));
  }
}

async function generateCapeTexture(capeId: string): Promise<Texture | null> {
  try {
    const image: Image | null = await toImage(`https://textures.livzmc.net/${capeId}.png`);
    if (!image) return null;
    const canvas = toCanvas(image);
    if (!canvas) return null;
    const texture = new Texture(canvas as unknown as OffscreenCanvas);

    return texture;
  } catch (e) {
    return null;
  }
}

export async function render(
  wh: number,
  modelOptions: ModelOptions,
): Promise<Buffer | null> {
  const w: number = wh;
  const h: number = wh;

  const aspectRatio: number = w / h;
  const gl = context(w, h);

  const skinImage: Image | null = await toImage(`https://textures.livzmc.net/skins/${modelOptions.skinId}.png`);
  if (!skinImage) return null;
  const skinCanvas = toCanvas(skinImage);
  if (!skinCanvas) return null;
  const skinTexture = new Texture(skinCanvas as unknown as OffscreenCanvas);
  const capeTexture = modelOptions.capeId != null ? await generateCapeTexture(modelOptions.capeId) : null;
  const playerModel = new PlayerModel(
    skinTexture,
    capeTexture,
    modelOptions,
  );

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, aspectRatio, 0.1, 100);

  const renderer = new THREE.WebGLRenderer({
    context: gl,
    alpha: true,
    preserveDrawingBuffer: true,
  });

  renderer.setSize(w, h);

  camera.position.set(0, 10, 55);
  scene.add(camera);
  camera.lookAt(scene.position);

  playerModel.position.y = 0;
  playerModel.position.z = 0;

  playerModel.rotation.x += degrees_to_radians(0);
  playerModel.rotation.y += degrees_to_radians(28);

  const ambLight = new THREE.AmbientLight(0xffffff, 1);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(0, 8, 45);

  scene.add(ambLight);
  scene.add(dirLight);
  scene.add(playerModel);

  renderer.render(scene, camera);

  const buff = Buffer.alloc(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buff);

  return await sharp(buff, {
    raw: {
      width: w,
      height: h,
      channels: 4
    }
  })
    .flip(true) // DON'T ASK ME WHY, BUT THREE.JS MODEL IS FLIPPED ON THE Y AXIS? This is an easy workaround...
    //.resize(Math.floor(w / 2), Math.floor(h / 2))
    .png()
    .toBuffer();
}
