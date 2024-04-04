import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "../backwards.utl.mjs";
import { normalizeCruiseOptions } from "#main/options/normalize.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import extract from "#extract/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("[I] extract/index - with experimentalStats", () => {
  it("extracts the dependencies and stats for a simple dependency", async () => {
    const lOptions = normalizeCruiseOptions({
      experimentalStats: true,
    });
    const lResolveOptions = await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions,
    );
    const lResult = extract(
      ["./test/extract/__mocks__/with-stats/"],
      lOptions,
      lResolveOptions,
    );
    const lExpected = requireJSON("./__fixtures__/with-stats/output.json");

    deepEqual(lResult, lExpected);
  });
});
