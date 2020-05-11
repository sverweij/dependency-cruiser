const expect = require("chai").expect;
const isOrphan = require("../../../../src/enrich/derive/orphan/is-orphan");

const ONE_MODULE_FIXTURE = require("./fixtures/oneModule.json");
const TWO_MODULES_FIXTURE = require("./fixtures/twoModule.json");

describe("enrich/derive/orphan/isOrphan", () => {
  it("flags a single module dependency graph as orphan", () => {
    expect(
      isOrphan({ source: "./lonely.js", dependencies: [] }, ONE_MODULE_FIXTURE)
    ).to.equal(true);
  });

  it("dismisses modules with at least one dependency", () => {
    expect(
      isOrphan(
        {
          source: "./snok.js",
          dependencies: [
            {
              resolved: "snak.js",
              coreModule: false,
              followable: true,
              couldNotResolve: false,
              dependencyTypes: ["local"],
              module: "./snak.js",
              moduleSystem: "cjs",
              matchesDoNotFollow: false,
            },
          ],
        },
        TWO_MODULES_FIXTURE
      )
    ).to.equal(false);
  });

  it("dismisses modules with at least one dependent", () => {
    expect(
      isOrphan(
        {
          source: "snak.js",
          dependencies: [],
        },
        TWO_MODULES_FIXTURE
      )
    ).to.equal(false);
  });
});
