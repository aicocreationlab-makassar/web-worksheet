import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
const root = process.cwd();
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(file)));
    else out.push(file);
  }
  return out;
}
const buildId = (
  await readFile(join(root, ".next", "BUILD_ID"), "utf8")
).trim();
const assets = (await walk(join(root, ".next", "static")))
  .filter((p) => /\.(js|css|woff2?)$/.test(p))
  .map(
    (p) => "/" + p.slice(join(root, ".next").length + 1).replaceAll("\\", "/"),
  )
  .map((p) => "/_next" + p);
const routes = [
  "/",
  "/create",
  "/result",
  "/templates",
  "/examples",
  "/history",
  "/how-it-works",
  "/offline",
];
const icons = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/manifest.webmanifest",
  "/icon.svg",
];
const template = await readFile(
  join(root, "scripts", "service-worker.template.js"),
  "utf8",
);
await mkdir(join(root, "public"), { recursive: true });
await writeFile(
  join(root, "public", "sw.js"),
  template
    .replace("__CACHE_VERSION__", JSON.stringify("lembarceria-" + buildId))
    .replace(
      "__PRECACHE_ASSETS__",
      JSON.stringify([...routes, ...icons, ...assets]),
    )
    .replace("__DOCUMENT_ROUTES__", JSON.stringify(routes)),
);
console.log(
  "Service worker prepared: " +
    routes.length +
    " pages, " +
    assets.length +
    " build assets.",
);
