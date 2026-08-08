import { deepEqual } from "node:assert/strict";
import { join } from "node:path";
import findAllFiles from "#utl/find-all-files.mjs";
import { writeFileSync } from "node:fs";

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
    // we have to write this file each time this test runs; it's in the .gitignore,
    // so git will indeed ignore it, and the ci won't have it for sure.
    writeFileSync(
      join(lBaseDirectory, "nested-gitignore-tree", "root-ignored.txt"),
      "",
    );
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

  it("lets deeper .gitignore negations re-include files in scope", () => {
    deepEqual(
      sortStrings(
        findAllFiles(".", {
          baseDir: join(lBaseDirectory, "negation-tree"),
        }),
      ),
      [".gitignore", "nested/.gitignore", "nested/important.log", "root.txt"],
    );
  });

  it("uses ignoreFileContents as override for the start directory", () => {
    deepEqual(
      sortStrings(
        findAllFiles("nested", {
          baseDir: join(lBaseDirectory, "nested-start-override-tree"),
          ignoreFileContents: "override-ignored.txt\n.gitignore\n",
        }),
      ),
      ["nested/disk-ignored.txt", "nested/keep.txt"],
    );
  });

  it("applies additionalIgnorePatterns throughout traversal", () => {
    deepEqual(
      sortStrings(
        findAllFiles(".", {
          baseDir: join(lBaseDirectory, "additional-patterns-tree"),
          additionalIgnorePatterns: ["vendor"],
        }),
      ),
      ["keep.txt"],
    );
  });

  it("combines ignore handling with include/exclude filters", () => {
    deepEqual(
      sortStrings(
        findAllFiles(".", {
          baseDir: join(lBaseDirectory, "nested-gitignore-tree"),
          excludeFilterFn: (pPath) => !pPath.includes("child"),
          includeOnlyFilterFn: (pPath) =>
            !pPath.includes("/") || pPath.endsWith(".txt"),
        }),
      ),
      ["keep-root.txt", "nested/keep-nested.txt", "override-ignored.txt"],
    );
  });

  it("builds ancestor rules for deep non-root starts", () => {
    deepEqual(
      sortStrings(
        findAllFiles("level1/level2/level3", {
          baseDir: join(lBaseDirectory, "deep-start-tree"),
        }),
      ),
      ["level1/level2/level3/keep.txt"],
    );
  });
});
