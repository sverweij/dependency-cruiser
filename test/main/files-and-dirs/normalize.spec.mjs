import { win32, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import normalizeFilesAndDirectories from "../../../src/main/files-and-dirs/normalize.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[U] main/files-and-dirs", () => {
  it("Keeps an empty file dir array as is", () => {
    expect(normalizeFilesAndDirectories([])).to.deep.equal([]);
  });

  it("Keeps relative paths as is", () => {
    expect(normalizeFilesAndDirectories(["./src", "./test"])).to.deep.equal([
      "./src",
      "./test",
    ]);
  });

  it("Keeps relative paths as is - keeping globs in tact", () => {
    expect(normalizeFilesAndDirectories(["{src,test}/**/*.js"])).to.deep.equal([
      "{src,test}/**/*.js",
    ]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir", () => {
    expect(
      normalizeFilesAndDirectories([__dirname]).map(win32.normalize)
    ).to.deep.equal(["test\\main\\files-and-dirs"]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir keeping globs in tact", () => {
    expect(
      normalizeFilesAndDirectories([
        posix.join(__dirname, "**", "*.{js,ts}"),
      ]).map(win32.normalize)
    ).to.deep.equal(["test\\main\\files-and-dirs\\**\\*.{js,ts}"]);
  });

  it("Normalizes the current working dir passed as an absolute path to '.'", () => {
    expect(
      normalizeFilesAndDirectories([process.cwd()]).map(win32.normalize)
    ).to.deep.equal(["."]);
  });
});
