const path = require("path");
const expect = require("chai").expect;
const normalizeFilesAndDirectories = require("~/src/main/files-and-dirs/normalize");

describe("main/files-and-dirs", () => {
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
      normalizeFilesAndDirectories([__dirname]).map(path.win32.normalize)
    ).to.deep.equal(["test\\main\\files-and-dirs"]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir keeping globs in tact", () => {
    expect(
      normalizeFilesAndDirectories([
        path.posix.join(__dirname, "**", "*.{js,ts}"),
      ]).map(path.win32.normalize)
    ).to.deep.equal(["test\\main\\files-and-dirs\\**\\*.{js,ts}"]);
  });

  it("Normalizes the current working dir passed as an absolute path to '.'", () => {
    expect(
      normalizeFilesAndDirectories([process.cwd()]).map(path.win32.normalize)
    ).to.deep.equal(["."]);
  });
});
