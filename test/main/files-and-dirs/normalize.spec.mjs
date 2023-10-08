import { deepEqual } from "node:assert/strict";
import { win32, posix } from "node:path";
import { fileURLToPath } from "node:url";
import normalizeFilesAndDirectories from "#main/files-and-dirs/normalize.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[U] main/files-and-dirs", () => {
  it("Keeps an empty file dir array as is", () => {
    deepEqual(normalizeFilesAndDirectories([]), []);
  });

  it("Keeps relative paths as is", () => {
    deepEqual(normalizeFilesAndDirectories(["./src", "./test"]), [
      "./src",
      "./test",
    ]);
  });

  it("Keeps relative paths as is - keeping globs in tact", () => {
    deepEqual(normalizeFilesAndDirectories(["{src,test}/**/*.js"]), [
      "{src,test}/**/*.js",
    ]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir", () => {
    deepEqual(normalizeFilesAndDirectories([__dirname]).map(win32.normalize), [
      "test\\main\\files-and-dirs",
    ]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir keeping globs in tact", () => {
    deepEqual(
      normalizeFilesAndDirectories([
        posix.join(__dirname, "**", "*.{js,ts}"),
      ]).map(win32.normalize),
      ["test\\main\\files-and-dirs\\**\\*.{js,ts}"],
    );
  });

  it("Normalizes the current working dir passed as an absolute path to '.'", () => {
    deepEqual(
      normalizeFilesAndDirectories([process.cwd()]).map(win32.normalize),
      ["."],
    );
  });
});
