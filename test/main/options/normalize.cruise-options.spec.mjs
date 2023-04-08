import { expect } from "chai";
import { normalizeCruiseOptions } from "../../../src/main/options/normalize.mjs";

describe("[U] main/options/normalize - cruise options", () => {
  it("ensures maxDepth is an int when passed an int", () => {
    expect(
      normalizeCruiseOptions({
        maxDepth: 42,
      }).maxDepth
    ).to.equal(42);
  });

  it("ensures maxDepth is an int when passed a string", () => {
    expect(
      normalizeCruiseOptions({
        maxDepth: "42",
      }).maxDepth
    ).to.equal(42);
  });

  it("makes doNotFollow strings into an object", () => {
    expect(
      normalizeCruiseOptions({
        doNotFollow: "42",
      }).doNotFollow
    ).to.deep.equal({
      path: "42",
    });
  });
  it("makes focus strings into an object", () => {
    expect(
      normalizeCruiseOptions({
        focus: "42",
      }).focus
    ).to.deep.equal({
      path: "42",
    });
  });

  it("makes exclude arrays into an object with a string", () => {
    expect(
      normalizeCruiseOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    expect(
      normalizeCruiseOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("de-arrayify's archi reporter options' collapsePattern", () => {
    expect(
      normalizeCruiseOptions({
        reporterOptions: {
          archi: {
            collapsePattern: ["^src/[^/]+", "^node_modules/[^/]+", "^bin/"],
          },
        },
      }).reporterOptions
    ).to.deep.equal({
      archi: {
        collapsePattern: "^src/[^/]+|^node_modules/[^/]+|^bin/",
      },
    });
  });

  it("de-arrayify's dot reporter options' filters", () => {
    expect(
      normalizeCruiseOptions({
        reporterOptions: {
          dot: {
            filters: {
              includeOnly: {
                path: ["^src", "^test", "^bin"],
              },
            },
          },
        },
      }).reporterOptions
    ).to.deep.equal({
      dot: {
        filters: { includeOnly: { path: "^src|^test|^bin" } },
      },
    });
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex", () => {
    expect(normalizeCruiseOptions({ collapse: 2 }, ["collapse"])).to.contain({
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex (digit in a string)", () => {
    expect(normalizeCruiseOptions({ collapse: "2" }, ["collapse"])).to.contain({
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: leaves non-single digits alone", () => {
    expect(normalizeCruiseOptions({ collapse: "22" }, ["collapse"])).to.contain(
      {
        collapse: "22",
      }
    );
  });

  it("collapse: leaves a normal string/ regex like alone", () => {
    expect(
      normalizeCruiseOptions({ collapse: "^packages/[^/]+" }, ["collapse"])
    ).to.contain({
      collapse: "^packages/[^/]+",
    });
  });

  it("calculates metrics when the selected reporter specifies to show metrics", () => {
    expect(
      normalizeCruiseOptions({
        outputType: "dot",
        reporterOptions: { dot: { showMetrics: true } },
      })
    ).to.contain({
      metrics: true,
    });
  });

  it("calculates metrics when the selected reporter specifies to not show metrics", () => {
    expect(
      normalizeCruiseOptions({
        outputType: "dot",
        reporterOptions: { dot: { showMetrics: false } },
      })
    ).to.contain({
      metrics: false,
    });
  });

  it("calculates metrics when the selected reporter doesn't specify to show metrics", () => {
    expect(
      normalizeCruiseOptions({
        outputType: "dot",
      })
    ).to.contain({
      metrics: false,
    });
  });
});

describe("[I] normalize cache options", () => {
  it("normalizes cache options into an object - true", () => {
    expect(normalizeCruiseOptions({ cache: true }).cache).to.deep.equal({
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "metadata",
    });
  });
  it("normalizes cache options into an object - string", () => {
    expect(
      normalizeCruiseOptions({ cache: "some/alternate/folder" }).cache
    ).to.deep.equal({
      folder: "some/alternate/folder",
      strategy: "metadata",
    });
  });
  it("normalizes cache options into an object - empty object", () => {
    expect(normalizeCruiseOptions({ cache: {} }).cache).to.deep.equal({
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "metadata",
    });
  });

  it("normalizes cache options into an object - partial object (strategy only)", () => {
    expect(
      normalizeCruiseOptions({ cache: { strategy: "content" } }).cache
    ).to.deep.equal({
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "content",
    });
  });
  it("normalizes cache options into an object - partial object (folder only)", () => {
    expect(
      normalizeCruiseOptions({
        cache: { folder: "some/alternate/folder" },
      }).cache
    ).to.deep.equal({
      folder: "some/alternate/folder",
      strategy: "metadata",
    });
  });
  it("passed false for cache - remains false (no object)", () => {
    expect(normalizeCruiseOptions({ cache: false }).cache).to.equal(false);
  });
  it("passed no cache - no cache property", () => {
    expect(normalizeCruiseOptions({})).to.not.haveOwnProperty("cache");
  });
});

/* eslint no-magic-numbers: 0*/
