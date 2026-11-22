import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TYPESCRIPT_VERSION = "7.1.0-beta";
const PROJECT_ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const EXCLUDED_ROOT_ENTRIES = new Set([".git", "node_modules", "coverage"]);
const lTemporaryDirectory = mkdtempSync(
  join(tmpdir(), "dependency-cruiser-typescript-native-"),
);
const lWorkingDirectory = join(lTemporaryDirectory, "dependency-cruiser");

function run(pCommand, pArguments, pWorkingDirectory, pExtraEnv = {}) {
  const lResult = spawnSync(pCommand, pArguments, {
    cwd: pWorkingDirectory,
    env: { ...process.env, ...pExtraEnv },
    stdio: ["pipe", "inherit", "inherit"],
    input: "",
    shell: process.platform === "win32" && pCommand === "npm",
  });
  if (lResult.error) {
    throw lResult.error;
  }
  if (lResult.status !== 0) {
    throw new Error(
      `${pCommand} ${pArguments.join(" ")} failed (${lResult.signal ?? `exit ${lResult.status}`})`,
    );
  }
}

try {
  console.error(
    "Testing against typescript native compiler in separate folder",
  );
  console.error("\nInstalling\n----------");
  console.error(`  - git clone to temporary directory ${lTemporaryDirectory}`);
  run(
    "git",
    [
      "clone",
      "--no-checkout",
      "--no-hardlinks",
      "--quiet",
      "--",
      PROJECT_ROOT,
      lWorkingDirectory,
    ],
    lTemporaryDirectory,
  );
  console.error(`  - git reset to HEAD in ${lTemporaryDirectory}`);
  run("git", ["reset", "--mixed", "--quiet", "HEAD"], lWorkingDirectory);
  cpSync(PROJECT_ROOT, lWorkingDirectory, {
    recursive: true,
    verbatimSymlinks: true,
    filter: (pSource) =>
      !EXCLUDED_ROOT_ENTRIES.has(pSource.slice(PROJECT_ROOT.length + 1)),
  });
  console.error("  - npm ci");
  run(
    "npm",
    ["ci", "--legacy-peer-deps", "--ignore-scripts", "--no-audit", "--no-fund"],
    lWorkingDirectory,
  );
  console.error(`  - npm install --no-save typescript@${TYPESCRIPT_VERSION}`);
  run(
    "npm",
    [
      "install",
      "--no-save",
      "--package-lock=false",
      "--legacy-peer-deps",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      `typescript@${TYPESCRIPT_VERSION}`,
    ],
    lWorkingDirectory,
  );
  console.error("\nRunning the tests\n-----------------");
  run("node", ["--run", "test"], lWorkingDirectory, {
    DEPENDENCY_CRUISER_EXPECT_TYPESCRIPT_NATIVE: TYPESCRIPT_VERSION,
  });
} finally {
  console.error(
    `\nRemoving temporary folder ${lTemporaryDirectory}\n-------------------------`,
  );
  rmSync(lTemporaryDirectory, { recursive: true, force: true });
}
