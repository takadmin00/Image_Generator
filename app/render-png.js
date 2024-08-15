import satori from "satori";
import { ImageGenerator } from "./ImageGenerator";

const convertSVGToPNG = (() => {
  if (typeof window === "undefined") {
    return;
  }

  console.log("Start worker", import.meta.url);

  const worker = new Worker(new URL("./resvg-worker.js", import.meta.url));

  const pending = new Map();

  worker.onmessage = (e) => {
    const resolve = pending.get(e.data._id);

    if (resolve) {
      resolve(e.data);
      pending.delete(e.data._id);
    }
  };

  return async ({ svg, width }) => {
    const message = {
      _id: Math.random(),
      svg,
      width,
    };

    worker.postMessage(message);

    return new Promise((resolve) => {
      pending.set(message._id, resolve);
    });
  };
})();

const CANVAS_SIZE = 400;

export async function renderPNG({ image, settings }) {
  const scale = image.width / CANVAS_SIZE;

  const newSettings = {
    padding: settings.padding * scale,
    shadow: settings.shadow * scale,
    radius: settings.radius * scale,
  };

  const svg = await satori(
    <ImageGenerator settings={newSettings} image={image} />,
    {
      width: image.width,
    }
  );

  const messageData = await convertSVGToPNG?.({
    svg,
    width: image.width,
  });

  return messageData;
}