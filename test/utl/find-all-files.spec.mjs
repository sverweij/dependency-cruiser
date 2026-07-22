import { deepEqual } from "node:assert/strict";
import { join } from "node:path";
import findAllFiles from "#utl/find-all-files.mjs";

const lBaseDirectory = "test/utl/__mocks__/find-all-files";

function sortStrings(pStrings) {
  return [...pStrings].sort();
}

describe("[U] utl/findAllFiles", () => {
  it("applies .gitignore files in nested folders relative to each folder", () => {
    deepEqual(
      sortStrings(
        findAllFiles(".", {
          baseDir: join(lBaseDirectory, "nested-gitignore-tree"),
        }),
      ),
      [
        "keep-root.txt",
        "nested/child/keep-child.txt",
        "nested/keep-nested.txt",
        "override-ignored.txt",
      ],
    );
  });

  it("keeps nested .gitignore handling when root ignore contents are overridden", () => {
    deepEqual(
      sortStrings(
        findAllFiles(".", {
          baseDir: join(lBaseDirectory, "nested-gitignore-tree"),
          ignoreFileContents: "override-ignored.txt\n.gitignore\n",
        }),
      ),
      [
        "keep-root.txt",
        "nested/child/keep-child.txt",
        "nested/keep-nested.txt",
        "root-ignored.txt",
      ],
    );
  });
});
