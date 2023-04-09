import { win32, posix } from "node:path";
import { expect } from "chai";
import pathToPosix from "../../src/utl/path-to-posix.mjs";

describe("[U] utl/pathToPosix on win32", () => {
  it('transforms win32 style paths to posix ones: ""', () => {
    expect(pathToPosix("", win32)).to.equal("");
  });

  it("transforms win32 style paths to posix ones: \\root\\sub\\file.txt", () => {
    expect(pathToPosix("\\root\\sub\\file.txt", win32)).to.equal(
      "/root/sub/file.txt"
    );
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    expect(pathToPosix("C:\\root\\sub\\file.txt", win32)).to.equal(
      "C:/root/sub/file.txt"
    );
  });

  it("keep posix style paths alone: /root/sub/file.txt", () => {
    expect(pathToPosix("/root/sub/file.txt", win32)).to.equal(
      "/root/sub/file.txt"
    );
  });
});

describe("[U] utl/pathToPosix  on posix", () => {
  it('leaves win32 style paths alone: ""', () => {
    expect(pathToPosix("", posix)).to.equal("");
  });

  it("leaves win32 style paths alone: \\root\\sub\\file.txt", () => {
    expect(pathToPosix("\\root\\sub\\file.txt", posix)).to.equal(
      "\\root\\sub\\file.txt"
    );
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    expect(pathToPosix("C:\\root\\sub\\file.txt", posix)).to.equal(
      "C:\\root\\sub\\file.txt"
    );
  });

  it("keeps posix style paths as-is: /root/sub/file.txt", () => {
    expect(pathToPosix("/root/sub/file.txt", posix)).to.equal(
      "/root/sub/file.txt"
    );
  });
});
