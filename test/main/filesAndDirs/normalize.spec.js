const path = require("path");
const expect = require("chai").expect;
const normalizeFilesAndDirs = require("../../../src/main/filesAndDirs/normalize");

describe("main/filesAndDirs", () => {
  it("Keeps an empty file dir array as is", () => {
    expect(normalizeFilesAndDirs([])).to.deep.equal([]);
  });

  it("Keeps relative paths as is", () => {
    expect(normalizeFilesAndDirs(["./src", "./test"])).to.deep.equal([
      "./src",
      "./test"
    ]);
  });

  it("Keeps relative paths as is - keeping globs in tact", () => {
    expect(normalizeFilesAndDirs(["{src,test}/**/*.js"])).to.deep.equal([
      "{src,test}/**/*.js"
    ]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir", () => {
    expect(
      normalizeFilesAndDirs([__dirname]).map(path.win32.normalize)
    ).to.deep.equal(["test\\main\\filesAndDirs"]);
  });

  it("Normalizes absolute paths to paths relative to the current working dir keeping globs in tact", () => {
    expect(
      normalizeFilesAndDirs([`${__dirname}/**/*.{js,ts}`]).map(
        path.win32.normalize
      )
    ).to.deep.equal(["test\\main\\filesAndDirs\\**\\*.{js,ts}"]);
  });

  it("Normalizes the current working dir passed as an absolute path to '.'", () => {
    expect(
      normalizeFilesAndDirs([process.cwd()]).map(path.win32.normalize)
    ).to.deep.equal(["."]);
  });
});
