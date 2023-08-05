import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import deriveFolders from "../../../../src/enrich/derive/folders/index.mjs";

describe("[U] enrich/derive/folders - folder stability metrics derivation", () => {
  it("doesn't do anything when we're not asking for metrics (metrics nor outputType)", () => {
    deepStrictEqual(deriveFolders([], {}), {});
  });

  it("emits folders when we're asking for metrics", () => {
    deepStrictEqual(deriveFolders([], { metrics: true }), { folders: [] });
  });
});
