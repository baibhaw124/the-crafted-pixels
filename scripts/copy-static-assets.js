import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("contact-page-integration/assets");
const destination = resolve("dist/assets");

if (!existsSync(source)) {
  console.error(`Asset source folder not found: ${source}`);
  process.exit(1);
}

mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true, force: true });

console.log("Static TCP assets copied into dist/assets.");
