import { deepEqual } from "node:assert/strict";
import { join } from "node:path";
import findAllFiles from "#utl/find-all-files.mjs";
import { unlinkSync, writeFileSync } from "node:fs";
import { EOL } from "node:os";

const lBaseDirectory = "test/utl/__mocks__/find-all-files";

function sortStrings(pStrings) {
  return [...pStrings].sort();
}

describe("[U] utl/findAllFiles", () => {
  before(() => {
    // the .gitignore in the nested-gitnore-tree is itself in another .gitignore,
    // so it's ignored on commit, and the ci (or other dev envs that are clones)
    // won't have it available. Hence write it thusly
    writeFileSync(
      join(lBaseDirectory, "nested-gitignore-tree", ".gitignore"),
      `.gitignore${EOL}root-ignored.txt${EOL}`,
    );
    // same story for the root-ignored.txt
    writeFileSync(
      join(lBaseDirectory, "nested-gitignore-tree", "root-ignored.txt"),
      "",
    );
  });

  after(() => {
    try {
      unlinkSync(join(lBaseDirectory, "nested-gitignore-tree", ".gitignore"));
      unlinkSync(
        join(lBaseDirectory, "nested-gitignore-tree", "root-ignored.txt"),
      );
    } catch {
      // ignored - not a terrible thing to happen if they can't be removed
      // not worth stopping processing for
    }
  });
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
