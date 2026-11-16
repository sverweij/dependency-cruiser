import { deepEqual, equal, notEqual } from "node:assert/strict";
import { join } from "node:path";
import {
  clearCache,
  getASTCached,
  getASTFromSource,
} from "#extract/acorn/parse.mjs";

const TSCONFIG_CONSTANTS = {
  ESNEXT: 99,
  PRESERVE_JSX: 1,
  REACT_JSX: 2,
};

const TSX_SOURCE = `
    const Index = () => (
    <div>This has an import keyword in a tag that shall not be recognized as an import</div>
    );

    export default Index;
    `;
describe("[U] extract/acorn/parse", () => {
  it("recognizes 'preserve'd tsx as jsx", () => {
    const lFoundAST = getASTFromSource(
      {
        source: TSX_SOURCE,
        filename: "./some-page.tsx",
        extension: ".tsx",
      },
      {
        tsConfig: {
          options: {
            module: TSCONFIG_CONSTANTS.ESNEXT,
            target: TSCONFIG_CONSTANTS.ESNEXT,
            jsx: TSCONFIG_CONSTANTS.PRESERVE_JSX,
            baseUrl: ".",
            skipLibCheck: true,
            noEmit: true,
            isolatedModules: true,
          },
        },
      },
    );
    equal(
      lFoundAST?.body[0]?.declarations[0]?.init?.body?.type ??
        "not a jsx element",
      "JSXElement",
    );
  });

  it("doesn't have any weird imports when tsx gets transpiled as non-'preserve' ", () => {
    const lFoundAST = getASTFromSource(
      {
        source: TSX_SOURCE,
        filename: "./some-page.tsx",
        extension: ".tsx",
      },
      {
        tsConfig: {
          options: {
            module: TSCONFIG_CONSTANTS.ESNEXT,
            target: TSCONFIG_CONSTANTS.ESNEXT,
            jsx: TSCONFIG_CONSTANTS.REACT_JSX,
            baseUrl: ".",
            skipLibCheck: true,
            noEmit: true,
            isolatedModules: true,
          },
        },
      },
    );

    const lLikelyTheArrowExpression =
      lFoundAST?.body[0]?.declarations?.[0]?.init ?? {};
    equal(lLikelyTheArrowExpression.type, "ArrowFunctionExpression");
    equal(
      lLikelyTheArrowExpression?.body?.callee?.type ??
        "not a member expression",
      "MemberExpression",
    );
    equal(
      lLikelyTheArrowExpression?.body?.callee?.object?.name ?? "not react",
      "React",
    );
    equal(
      lLikelyTheArrowExpression?.body?.callee?.property?.name ??
        "not createElement",
      "createElement",
    );
  });
});

describe("[U] extract/acorn/parse - getASTCached", () => {
  const lFileName = join(
    import.meta.dirname,
    "..",
    "__mocks__",
    "extract-stats-testfile.mjs",
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
