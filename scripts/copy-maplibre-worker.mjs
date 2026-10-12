// MapLibre loads its web worker from a URL. Bundlers (Turbopack here) don't
// emit it, so we serve the file from /public and point MapLibre at it with
// setWorkerUrl. Runs after `npm install` so the copy always matches the
// installed maplibre-gl version.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const source = "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs";
if (!existsSync(source)) process.exit(0);
mkdirSync("public/maplibre", { recursive: true });
copyFileSync(source, "public/maplibre/maplibre-gl-worker.js");
