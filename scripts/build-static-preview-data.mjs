import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const outputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(projectDir, "dist", "static-data.js");
const store = JSON.parse(fs.readFileSync(path.join(projectDir, "data", "store.json"), "utf8"));
const publicKeys = ["achievements", "demands", "experts", "techManagers", "agents", "matches", "videos"];
const publicData = Object.fromEntries(publicKeys.map((key) => [key, store[key] || []]));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `window.__HENAN_STATIC_DATA__ = ${JSON.stringify(publicData)};\n`, "utf8");
console.log(`Wrote ${outputPath}`);
