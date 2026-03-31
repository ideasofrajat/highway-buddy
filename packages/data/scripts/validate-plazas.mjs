import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import fg from "fast-glob";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const rootDir = process.cwd();
const schemaPath = path.join(rootDir, "schema/plaza.schema.json");
const plazasGlob = "plazas/nh-*/**/*.json";

const schema = JSON.parse(await readFile(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const plazaFiles = await fg(plazasGlob, {
  cwd: rootDir,
  absolute: true
});

if (plazaFiles.length === 0) {
  console.error("No plaza files found for validation.");
  process.exit(1);
}

let hasErrors = false;

for (const filePath of plazaFiles) {
  const payload = JSON.parse(await readFile(filePath, "utf8"));
  const valid = validate(payload);
  if (!valid) {
    hasErrors = true;
    console.error(`Schema validation failed: ${path.relative(rootDir, filePath)}`);
    for (const error of validate.errors ?? []) {
      console.error(`  - ${error.instancePath || "/"} ${error.message ?? ""}`.trim());
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log(`Validated ${plazaFiles.length} plaza files successfully.`);
