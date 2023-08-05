import { strictEqual } from "node:assert";
import get from "lodash/get.js";
import { getASTFromSource } from "../../../src/extract/parse/to-javascript-ast.mjs";

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
describe("[U] extract/parse/to-javascript-ast", () => {
  it("recogizes 'preserve'd tsx as jsx", () => {
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
    strictEqual(
      get(
        lFoundAST,
        "body[0].declarations[0].init.body.type",
        "not a jsx element",
      ),
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

    const likelyTheArrowExpression = get(
      lFoundAST,
      "body[0].declarations.[0].init",
      {},
    );
    strictEqual(likelyTheArrowExpression.type, "ArrowFunctionExpression");
    strictEqual(
      get(
        likelyTheArrowExpression,
        "body.callee.type",
        "not a member expression",
      ),
      "MemberExpression",
    );
    strictEqual(
      get(likelyTheArrowExpression, "body.callee.object.name", "not react"),
      "React",
    );
    strictEqual(
      get(
        likelyTheArrowExpression,
        "body.callee.property.name",
        "not createElement",
      ),
      "createElement",
    );
  });
});
