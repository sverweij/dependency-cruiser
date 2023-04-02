import { expect } from "chai";
import findExtensions from "../../../src/cli/init-config/find-extensions.mjs";

describe("[U] cli/init-config/find-extensions", () => {
  it("returns an empty array of extensions when passed no directories", () => {
    expect(findExtensions([])).to.deep.equal([]);
  });

  it("throws when passed non-existent folders", () => {
    expect(() => {
      findExtensions(["yo-this-folder-does-not-exist", "and neither this one"]);
    }).to.throw(/ENOENT/);
  });

  it("returns an empty array of extension when passed a directory with files that have no extensions", () => {
    const lFound = findExtensions(["no-extensions"], {
      baseDir: "test/cli/init-config/__mocks__/extensions",
      scannableExtensions: [".js", ".mjs", ".cjs", ".jsx"],
    });

    expect(lFound).to.deep.equal([]);
  });

  it("filters scannable extensions from all extensions", () => {
    const lFound = findExtensions(["both-js-and-ts-extensions"], {
      baseDir: "test/cli/init-config/__mocks__/extensions",
      scannableExtensions: [".js", ".mjs", ".cjs", ".jsx"],
    });

    expect(lFound).to.deep.equal([".js", ".cjs"]);
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

    expect(lFound).to.deep.equal([".js", ".ts", ".cjs", ".d.mts"]);
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

    expect(lFound).to.deep.equal([".ts", ".d.mts"]);
  });
});
