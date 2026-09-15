import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url));
await mkdir(new URL("../public/icons/", import.meta.url), { recursive: true });
await Promise.all(
  [192, 512].map((size) =>
    sharp(svg)
      .resize(size, size)
      .png()
      .toFile(
        fileURLToPath(
          new URL("../public/icons/icon-" + size + ".png", import.meta.url),
        ),
      ),
  ),
);
await sharp(svg)
  .resize(320, 320)
  .extend({ top: 96, bottom: 96, left: 96, right: 96, background: "#28784f" })
  .png()
  .toFile(
    fileURLToPath(new URL("../public/icons/maskable-512.png", import.meta.url)),
  );
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(
    fileURLToPath(
      new URL("../public/icons/apple-touch-icon.png", import.meta.url),
    ),
  );
console.log("PWA icons generated.");
