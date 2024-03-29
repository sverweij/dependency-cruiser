import { deepEqual } from "node:assert/strict";
import extractStats from "#extract/acorn/extract-stats.mjs";
import { getStats } from "#extract/acorn/extract.mjs";

describe("[U] extract/acorn/extractStats", () => {
  it("should return stats for a given AST", () => {
    const lAST = {
      body: [{ type: "FunctionDeclaration" }, { type: "VariableDeclaration" }],
      end: 100,
    };
    deepEqual(extractStats(lAST), {
      topLevelStatementCount: 2,
      size: 100,
    });
  });

  it("should return 0 for empty AST", () => {
    deepEqual(extractStats({}), {
      topLevelStatementCount: 0,
      size: 0,
    });
  });
});

describe("[I] extract/acorn/extract - getStats", () => {
  it("should return stats  for a given file containing valid javascript", () => {
    const lStats = getStats(
      { baseDir: "./test/extract/__mocks__" },
      "extract-stats-testfile.mjs",
      { extension: ".mjs" },
    );
    deepEqual(lStats, {
      topLevelStatementCount: 5,
      size: 1010,
    });
  });
});
