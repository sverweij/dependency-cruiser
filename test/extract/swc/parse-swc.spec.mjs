import { equal, notEqual, throws } from "node:assert/strict";
import { join } from "node:path";
import { clearCache, getASTCached } from "#extract/swc/parse.mjs";

describe("[U] extract/swc - parse ", () => {
  beforeEach(() => {
    clearCache();
  });
  afterEach(() => {
    clearCache();
  });
  it("parses regular javascript", () => {
    const lAST = getASTCached(
      join(import.meta.dirname, "__mocks__", "javascript.js"),
    );
    equal(lAST.type, "Module");
  });
  it("parses regular typescript", () => {
    const lAST = getASTCached(
      join(import.meta.dirname, "__mocks__", "typescript.ts"),
    );
    equal(lAST.type, "Module");
  });
  it("parses jsx", () => {
    const lAST = getASTCached(
      join(import.meta.dirname, "__mocks__", "jsx.jsx"),
    );
    equal(lAST.type, "Module");
  });
  it("parses tsx", () => {
    const lAST = getASTCached(
      join(import.meta.dirname, "__mocks__", "tsx.tsx"),
    );
    equal(lAST.type, "Module");
  });
  it("returns the cached AST when asked for the same file twice in a row", () => {
    const lFileName = join(import.meta.dirname, "__mocks__", "typescript.ts");
    const lAST = getASTCached(lFileName);

    equal(getASTCached(lFileName), lAST);
  });
  it("only keeps the AST of the last parsed file", () => {
    const lFileName = join(import.meta.dirname, "__mocks__", "typescript.ts");
    const lAST = getASTCached(lFileName);
    getASTCached(join(import.meta.dirname, "__mocks__", "javascript.js"));
    const lReparsedAST = getASTCached(lFileName);

    notEqual(lReparsedAST, lAST);
    equal(lReparsedAST.type, "Module");
  });
  it("throws on syntactically erroneous file contents", () => {
    throws(() => {
      const _lAST = getASTCached(
        join(import.meta.dirname, "__mocks__", "brol.ts"),
      );
    });
  });
});
