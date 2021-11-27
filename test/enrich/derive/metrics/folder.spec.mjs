import { expect } from "chai";

import deriveFolders from "../../../../src/enrich/derive/metrics/folder.js";

describe("enrich/derive/metrics/folder - folder stability metrics derivation", () => {
  it("doesn't do anything when we're not asking for metrics (metrics nor outputType)", () => {
    expect(deriveFolders([], {})).to.deep.equal({});
  });

  it("emits folders when we're asking for metrics", () => {
    expect(deriveFolders([], { metrics: true })).to.deep.equal({ folders: [] });
  });

  it("emits folders when we're asking for outputType === metrics", () => {
    expect(deriveFolders([], { outputType: "metrics" })).to.deep.equal({
      folders: [],
    });
  });
});
