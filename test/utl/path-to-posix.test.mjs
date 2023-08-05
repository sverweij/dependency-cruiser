import { strictEqual } from "node:assert";
import { win32, posix } from "node:path";
import { describe, it } from "node:test";
import pathToPosix from "../../src/utl/path-to-posix.mjs";

describe("[U] utl/pathToPosix on win32", () => {
  it('transforms win32 style paths to posix ones: ""', () => {
    strictEqual(pathToPosix("", win32), "");
  });

  it("transforms win32 style paths to posix ones: \\root\\sub\\file.txt", () => {
    strictEqual(
      pathToPosix("\\root\\sub\\file.txt", win32),
      "/root/sub/file.txt"
    );
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    strictEqual(
      pathToPosix("C:\\root\\sub\\file.txt", win32),
      "C:/root/sub/file.txt"
    );
  });

  it("keep posix style paths alone: /root/sub/file.txt", () => {
    strictEqual(pathToPosix("/root/sub/file.txt", win32), "/root/sub/file.txt");
  });
});

describe("[U] utl/pathToPosix  on posix", () => {
  it('leaves win32 style paths alone: ""', () => {
    strictEqual(pathToPosix("", posix), "");
  });

  it("leaves win32 style paths alone: \\root\\sub\\file.txt", () => {
    strictEqual(
      pathToPosix("\\root\\sub\\file.txt", posix),
      "\\root\\sub\\file.txt"
    );
  });

  it("leaves win32 style paths alone: C:\\root\\sub\\file.txt", () => {
    strictEqual(
      pathToPosix("C:\\root\\sub\\file.txt", posix),
      "C:\\root\\sub\\file.txt"
    );
  });

  it("keeps posix style paths as-is: /root/sub/file.txt", () => {
    strictEqual(pathToPosix("/root/sub/file.txt", posix), "/root/sub/file.txt");
  });
});
