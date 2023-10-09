import { deepEqual } from "node:assert/strict";

import deriveFolders from "#enrich/derive/folders/index.mjs";

describe("[U] enrich/derive/folders - folder stability metrics derivation", () => {
  it("doesn't do anything when we're not asking for metrics (metrics nor outputType)", () => {
    deepEqual(deriveFolders([], {}), {});
  });

  it("emits folders when we're asking for metrics", () => {
    deepEqual(deriveFolders([], { metrics: true }), { folders: [] });
  });
});
