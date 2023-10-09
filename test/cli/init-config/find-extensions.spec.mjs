import { deepEqual, throws } from "node:assert/strict";
import findExtensions from "#cli/init-config/find-extensions.mjs";

describe("[U] cli/init-config/find-extensions", () => {
  it("returns an empty array of extensions when passed no directories", () => {
    deepEqual(findExtensions([]), []);
  });

  it("throws when passed non-existent folders", () => {
    throws(() => {
      findExtensions(["yo-this-folder-does-not-exist", "and neither this one"]);
    }, /ENOENT/);
  });

  it("returns an empty array of extension when passed a directory with files that have no extensions", () => {
    const lFound = findExtensions(["no-extensions"], {
      baseDir: "test/cli/init-config/__mocks__/extensions",
      scannableExtensions: [".js", ".mjs", ".cjs", ".jsx"],
    });

    deepEqual(lFound, []);
  });

  it("filters scannable extensions from all extensions", () => {
    const lFound = findExtensions(["both-js-and-ts-extensions"], {
      baseDir: "test/cli/init-config/__mocks__/extensions",
      scannableExtensions: [".js", ".mjs", ".cjs", ".jsx"],
    });

    deepEqual(lFound, [".js", ".cjs"]);
  });

  it("sorts by the number of times the extension occurs", () => {
    const lFound = findExtensions(["both-js-and-ts-extensions"], {
      baseDir: "test/cli/init-config/__mocks__/extensions",
      scannableExtensions: [
        ".js",
        ".mjs",
        ".cjs",
        ".jsx",
        ".ts",
        ".mts",
        ".cts",
        ".tsx",
        ".d.ts",
        ".d.cts",
        ".d.mts",
      ],
    });

    deepEqual(lFound, [".js", ".ts", ".cjs", ".d.mts"]);
  });

  it("ignores path elements that aren't worth scanning", () => {
    const lFound = findExtensions(["both-js-and-ts-extensions"], {
      baseDir: "test/cli/init-config/__mocks__/extensions",
      ignoreFileContents:
        "# ignore everything in the javascript only folder\nonly-javascript/",
      scannableExtensions: [
        ".js",
        ".mjs",
        ".cjs",
        ".jsx",
        ".ts",
        ".mts",
        ".cts",
        ".tsx",
        ".d.ts",
        ".d.cts",
        ".d.mts",
      ],
    });

    deepEqual(lFound, [".ts", ".d.mts"]);
  });
});
