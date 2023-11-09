import { win32, posix } from "node:path";
import { equal } from "node:assert/strict";
import pathToPosix from "#utl/path-to-posix.mjs";

describe("[U] utl/pathToPosix on win32", () => {
  it('transforms win32 style paths to posix ones: ""', () => {
    equal(pathToPosix("", win32), "");
  });

  it("transforms win32 style paths to posix ones: \\root\\sub\\file.txt", () => {
    equal(pathToPosix("\\root\\sub\\file.txt", win32), "/root/sub/file.txt");
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    equal(
      pathToPosix("C:\\root\\sub\\file.txt", win32),
      "C:/root/sub/file.txt",
    );
  });

  it("keep posix style paths alone: /root/sub/file.txt", () => {
    equal(pathToPosix("/root/sub/file.txt", win32), "/root/sub/file.txt");
  });
});

describe("[U] utl/pathToPosix  on posix", () => {
  it('leaves win32 style paths alone: ""', () => {
    equal(pathToPosix("", posix), "");
  });

  it("leaves win32 style paths alone: \\root\\sub\\file.txt", () => {
    equal(pathToPosix("\\root\\sub\\file.txt", posix), "\\root\\sub\\file.txt");
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    equal(
      pathToPosix("C:\\root\\sub\\file.txt", posix),
      "C:\\root\\sub\\file.txt",
    );
  });

  it("keeps posix style paths as-is: /root/sub/file.txt", () => {
    equal(pathToPosix("/root/sub/file.txt", posix), "/root/sub/file.txt");
  });
});
