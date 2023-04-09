import { expect } from "chai";

import deriveFolders from "../../../../src/enrich/derive/folders/index.mjs";

describe("[U] enrich/derive/folders - folder stability metrics derivation", () => {
  it("doesn't do anything when we're not asking for metrics (metrics nor outputType)", () => {
    expect(deriveFolders([], {})).to.deep.equal({});
  });

  it("emits folders when we're asking for metrics", () => {
    expect(deriveFolders([], { metrics: true })).to.deep.equal({ folders: [] });
  });
});
