const { expect } = require("chai");
const _get = require("lodash/get");
const {
  getASTFromSource,
} = require("../../../src/extract/parse/to-javascript-ast");

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
describe("extract/parse/to-javascript-ast", () => {
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
      }
    );
    expect(
      _get(
        lFoundAST,
        "body[0].declarations[0].init.body.type",
        "not a jsx element"
      )
    ).to.equal("JSXElement");
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
      }
    );

    const likelyTheArrowExpression = _get(
      lFoundAST,
      "body[0].declarations.[0].init",
      {}
    );
    expect(likelyTheArrowExpression.type).to.equal("ArrowFunctionExpression");
    expect(
      _get(
        likelyTheArrowExpression,
        "body.callee.type",
        "not a member expression"
      )
    ).to.equal("MemberExpression");
    expect(
      _get(likelyTheArrowExpression, "body.callee.object.name", "not react")
    ).to.equal("React");
    expect(
      _get(
        likelyTheArrowExpression,
        "body.callee.property.name",
        "not createElement"
      )
    ).to.equal("createElement");
  });
});
