const path = require("path");
const expect = require("chai").expect;
const pathToPosix = require("../../src/utl/path-to-posix");

describe("utl/pathToPosix on win32", () => {
  it('transforms win32 style paths to posix ones: ""', () => {
    expect(pathToPosix("", path.win32)).to.equal("");
  });

  it("transforms win32 style paths to posix ones: \\root\\sub\\file.txt", () => {
    expect(pathToPosix("\\root\\sub\\file.txt", path.win32)).to.equal(
      "/root/sub/file.txt"
    );
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    expect(pathToPosix("C:\\root\\sub\\file.txt", path.win32)).to.equal(
      "C:/root/sub/file.txt"
    );
  });

  it("keep posix style paths alone: /root/sub/file.txt", () => {
    expect(pathToPosix("/root/sub/file.txt", path.win32)).to.equal(
      "/root/sub/file.txt"
    );
  });
});

describe("extract/utl/pathToPosix  on posix", () => {
  it('leaves win32 style paths alone: ""', () => {
    expect(pathToPosix("", path.posix)).to.equal("");
  });

  it("leaves win32 style paths alone: \\root\\sub\\file.txt", () => {
    expect(pathToPosix("\\root\\sub\\file.txt", path.posix)).to.equal(
      "\\root\\sub\\file.txt"
    );
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    expect(pathToPosix("C:\\root\\sub\\file.txt", path.posix)).to.equal(
      "C:\\root\\sub\\file.txt"
    );
  });

  it("keeps posix style paths as-is: /root/sub/file.txt", () => {
    expect(pathToPosix("/root/sub/file.txt", path.posix)).to.equal(
      "/root/sub/file.txt"
    );
  });
});
