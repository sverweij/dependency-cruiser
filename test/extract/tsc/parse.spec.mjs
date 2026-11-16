import { deepEqual, equal, notEqual } from "node:assert/strict";
import { join } from "node:path";
import { clearCache, getASTCached } from "#extract/tsc/parse.mjs";

describe("[U] extract/tsc/parse - getASTCached", () => {
  const lFileName = join(
    import.meta.dirname,
    "__mocks__",
    "extract-stats-testfile.mts",
  );
  const lOtherFileName = join(
    import.meta.dirname,
    "..",
    "__mocks__",
    "extract-stats-nop.mjs",
  );

  beforeEach(() => {
    clearCache();
  });
  afterEach(() => {
    clearCache();
  });

  it("returns the cached AST when asked for the same file twice in a row", () => {
    const lAST = getASTCached(lFileName);

    equal(getASTCached(lFileName), lAST);
  });

  it("only keeps the AST of the last parsed file", () => {
    const lAST = getASTCached(lFileName);
    getASTCached(lOtherFileName);
    const lReparsedAST = getASTCached(lFileName);

    notEqual(lReparsedAST, lAST);
    deepEqual(lReparsedAST, lAST);
  });
});
