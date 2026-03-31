import { spawnSync } from "node:child_process";

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

console.log("Setting up highway-buddy...");
run("corepack", ["pnpm", "install", "--no-frozen-lockfile"]);
console.log("\nSetup complete.");
console.log("Next step: npm run docs:dev");
