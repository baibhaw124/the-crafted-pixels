import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const projectRoot = resolve("contact-page-integration");
const distRoot = resolve("dist");
const assetSource = resolve(projectRoot, "assets");
const assetDestination = resolve(distRoot, "assets");

if (!existsSync(assetSource)) {
  console.error(`Missing asset directory: ${assetSource}`);
  process.exit(1);
}

mkdirSync(assetDestination, { recursive: true });
cpSync(assetSource, assetDestination, {
  recursive: true,
  force: true
});

const files = [
  ["contact.html", "contact.html"],
  ["1.jpeg", "1.jpeg"],
  ["21.png", "21.png"],
  ["css/contact.css", "css/contact.css"]
];

for (const [from, to] of files) {
  const source = resolve(projectRoot, from);
  const destination = resolve(distRoot, to);

  if (!existsSync(source)) {
    console.error(`Missing required file: ${source}`);
    process.exit(1);
  }

  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { force: true });
  console.log(`Copied ${from} -> dist/${to}`);
}

console.log("Production static assets copied successfully.");