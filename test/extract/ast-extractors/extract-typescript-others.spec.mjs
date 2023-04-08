import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import extractTypescriptFromAST from "../../../src/extract/ast-extractors/extract-typescript-deps.mjs";

describe("[U] ast-extractors/extract-typescript - others", () => {
  // see issue #167 - union types on tsc 2.8 and before don't deliver/
  // recognize union types - which made dependency-cruiser 4.27.1 choke
  // this ut ensures it won't regress
  it("doesn't barf on output from old compiler versions", () => {
    expect(
      extractTypescriptFromAST(
        JSON.parse(
          readFileSync(
            fileURLToPath(
              new URL(
                "__mocks__/typescript2.8-union-types-ast.json",
                import.meta.url
              )
            ),
            "utf8"
          )
        ),
        []
      )
    ).to.deep.equal([]);
  });
});
