import { expect } from "chai";

import {
  getAfferentCouplings,
  getEfferentCouplings,
} from "../../../../src/enrich/derive/metrics/module-utl.js";

describe("enrich/derive/metrics/module-utl - getAfferentCouplings", () => {
  it("no dependents => 0", () => {
    expect(
      getAfferentCouplings({ dependents: [] }, "src/whoopla").length
    ).to.equal(0);
  });

  it("dependents from the current folder => 0", () => {
    expect(
      getAfferentCouplings(
        { dependents: ["src/folder/do-things.mjs"] },
        "src/folder"
      ).length
    ).to.equal(0);
  });

  it("dependents from another folder => 1", () => {
    expect(
      getAfferentCouplings(
        { dependents: ["src/somewhere-else/do-things.mjs"] },
        "src/whoopla"
      ).length
    ).to.equal(1);
  });

  it("dependent from another folder that starts with a similar name => 1", () => {
    expect(
      getAfferentCouplings(
        { dependents: ["src/folder-some-more/do-things.mjs"] },
        "src/folder"
      ).length
    ).to.equal(1);
  });

  it("all together now", () => {
    expect(
      getAfferentCouplings(
        {
          dependents: [
            "src/folder-some-more/do-things.mjs",
            "src/folder/do-things.mjs",
            "test/folder/index.spec.mjs",
          ],
        },
        "src/folder"
      ).length
      // eslint-disable-next-line no-magic-numbers
    ).to.equal(2);
  });
});

describe("enrich/derive/metrics/module-utl - getEfferentCouplings", () => {
  it("no dependencies => 0", () => {
    expect(
      getEfferentCouplings({ dependencies: [] }, "src/whoopla").length
    ).to.equal(0);
  });
});
