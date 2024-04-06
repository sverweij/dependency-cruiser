import { deepEqual, throws } from "node:assert/strict";
import extractStats from "#extract/extract-stats.mjs";

describe("[I] extract/extractStats", () => {
  it("should return stats  for a given file containing valid javascript", () => {
    const lStats = extractStats(
      "extract-stats-testfile.mjs",
      { baseDir: "./test/extract/__mocks__" },
      { extension: ".mjs" },
    );
    deepEqual(lStats, {
      topLevelStatementCount: 5,
      size: 1010,
    });
  });

  it("should return stats  for a given file containing valid typescript", () => {
    const lStats = extractStats(
      "extract-stats-testfile.mts",
      { baseDir: "./test/extract/tsc/__mocks__", tsPreCompilationDeps: true },
      { extension: ".mts" },
    );
    deepEqual(lStats, {
      topLevelStatementCount: 5,
      size: 1045,
    });
  });

  it("should throw an error if the file is not found", () => {
    throws(() => {
      extractStats(
        "non-existing-file.mjs",
        { baseDir: "./test/extract/__mocks__" },
        { extension: ".mjs" },
      );
    }, "Extracting stats ran afoul of...\n\n  ENOENT: no such file or directory, open 'test/extract/__mocks__/non-existing-file.mjs'\n... in test/extract/__mocks__/non-existing-file.mjs\n\n");
  });
});
