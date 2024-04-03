import { deepEqual } from "node:assert/strict";
import extractStats from "#extract/tsc/extract-stats.mjs";
import { getStats } from "#extract/tsc/extract.mjs";

describe("[U] extract/tsc/extractStats", () => {
  it("should return stats for a given AST", () => {
    const lAST = {
      statements: [
        { type: "FunctionDeclaration" },
        { type: "VariableDeclaration" },
      ],
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

describe("[I] extract/tsc/extract - getStats", () => {
  it("should return stats  for a given file containing valid javascript", () => {
    const lStats = getStats(
      { baseDir: "./test/extract/tsc/__mocks__" },
      "extract-stats-testfile.mts",
      { extension: ".mts" },
    );
    deepEqual(lStats, {
      topLevelStatementCount: 5,
      size: 1045,
    });
  });
});
