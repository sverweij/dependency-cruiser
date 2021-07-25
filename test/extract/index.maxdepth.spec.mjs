import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import extract from "../../src/extract/index.js";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.js";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.js";
import { createRequireJSON } from "../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

use(chaiJSONSchema);

describe("extract/index - max depth", () => {
  /* eslint no-magic-numbers:0 */
  [0, 1, 2, 4].forEach((pDepth) =>
    it(`returns the correct graph when max-depth === ${pDepth}`, () => {
      const lOptions = normalizeCruiseOptions({
        maxDepth: pDepth,
      });
      const lResolveOptions = normalizeResolveOptions(
        {
          bustTheCache: true,
        },
        lOptions
      );
      const lResult = extract(
        ["./test/extract/fixtures/maxDepth/index.js"],
        lOptions,
        lResolveOptions
      );
      /* eslint import/no-dynamic-require:0, security/detect-non-literal-require:0 */

      expect(lResult).to.deep.equal(
        requireJSON(`./fixtures/maxDepth${pDepth}.json`)
      );
      // expect(lResult).to.be.jsonSchema(resultSchema);
    })
  );
});
/* eslint node/global-require: 0*/
