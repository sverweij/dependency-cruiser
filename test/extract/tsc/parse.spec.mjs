import { deepEqual, equal, notEqual } from "node:assert/strict";
import { join } from "node:path";
import { clearCache, getASTCached } from "#extract/tsc/parse.mjs";
import typescript from "#utl/typescript-facade.mjs";

function getSyntaxTree(pNode) {
  const lChildren = [];
  typescript.forEachChild(pNode, (pChild) => {
    lChildren.push(getSyntaxTree(pChild));
  });
  return {
    kind: pNode.kind,
    pos: pNode.pos,
    end: pNode.end,
    flags: pNode.flags,
    children: lChildren,
  };
}

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
    if (typescript.isNative) {
      // Native AST backing data contains per-parse node and lease IDs.
      equal(lReparsedAST.fileName, lAST.fileName);
      equal(lReparsedAST.text, lAST.text);
      deepEqual(getSyntaxTree(lReparsedAST), getSyntaxTree(lAST));
    } else {
      deepEqual(lReparsedAST, lAST);
    }
  });
});
