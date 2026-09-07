import { clearCache, getASTCached } from "#extract/swc/parse.mjs";
import { equal, throws } from "node:assert/strict";
import { join } from "node:path";

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
  it("throws on syntactically erroneous file contents", () => {
    throws(() => {
      const _lAST = getASTCached(
        join(import.meta.dirname, "__mocks__", "brol.ts"),
      );
    });
  });
});
