import { deepEqual } from "node:assert/strict";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import extract from "#extract/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("[I] extract/index - max depth", () => {
  /* eslint no-magic-numbers:0 */
  [0, 1, 2, 4].forEach((pDepth) =>
    it(`returns the correct graph when max-depth === ${pDepth}`, async () => {
      const lOptions = normalizeCruiseOptions({
        maxDepth: pDepth,
      });
      const lResolveOptions = await normalizeResolveOptions(
        {
          bustTheCache: true,
        },
        lOptions,
      );
      const lResult = extract(
        ["./test/extract/__mocks__/maxDepth/index.js"],
        lOptions,
        lResolveOptions,
      );
      /* eslint import/no-dynamic-require:0, security/detect-non-literal-require:0 */

      deepEqual(
        lResult,
        requireJSON(`./__fixtures__/max-depth-${pDepth}.json`),
      );
      // ajv.validate(resultSchema, lResult);
    }),
  );
});
/* eslint node/global-require: 0*/
