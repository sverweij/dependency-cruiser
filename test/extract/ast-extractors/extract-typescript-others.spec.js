const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const extractTypescriptFromAST = require("../../../src/extract/ast-extractors/extract-typescript-deps");

describe("ast-extractors/extract-typescript - others", () => {
  // see issue #167 - union types on tsc 2.8 and before don't deliver/
  // recognize union types - which made dependency-cruiser 4.27.1 choke
  // this ut ensures it won't regress
  it("doesn't barf on output from old compiler versions", () => {
    expect(
      extractTypescriptFromAST(
        JSON.parse(
          fs.readFileSync(
            path.join(__dirname, "typescript2.8-union-types-ast.json"),
            "utf8"
          )
        ),
        []
      )
    ).to.deep.equal([]);
  });
});
