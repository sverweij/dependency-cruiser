import { expect } from "chai";
import normalize from "../../../src/main/options/normalize.js";

describe("[U] main/options/normalize - cruise options", () => {
  it("ensures maxDepth is an int when passed an int", () => {
    expect(
      normalize.normalizeCruiseOptions({
        maxDepth: 42,
      }).maxDepth
    ).to.equal(42);
  });

  it("ensures maxDepth is an int when passed a string", () => {
    expect(
      normalize.normalizeCruiseOptions({
        maxDepth: "42",
      }).maxDepth
    ).to.equal(42);
  });

  it("makes doNotFollow strings into an object", () => {
    expect(
      normalize.normalizeCruiseOptions({
        doNotFollow: "42",
      }).doNotFollow
    ).to.deep.equal({
      path: "42",
    });
  });
  it("makes focus strings into an object", () => {
    expect(
      normalize.normalizeCruiseOptions({
        focus: "42",
      }).focus
    ).to.deep.equal({
      path: "42",
    });
  });

  it("makes exclude arrays into an object with a string", () => {
    expect(
      normalize.normalizeCruiseOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    expect(
      normalize.normalizeCruiseOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("de-arrayify's archi reporter options' collapsePattern", () => {
    expect(
      normalize.normalizeCruiseOptions({
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
      normalize.normalizeCruiseOptions({
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
    expect(
      normalize.normalizeCruiseOptions({ collapse: 2 }, ["collapse"])
    ).to.contain({
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex (digit in a string)", () => {
    expect(
      normalize.normalizeCruiseOptions({ collapse: "2" }, ["collapse"])
    ).to.contain({
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: leaves non-single digits alone", () => {
    expect(
      normalize.normalizeCruiseOptions({ collapse: "22" }, ["collapse"])
    ).to.contain({
      collapse: "22",
    });
  });

  it("collapse: leaves a normal string/ regex like alone", () => {
    expect(
      normalize.normalizeCruiseOptions({ collapse: "^packages/[^/]+" }, [
        "collapse",
      ])
    ).to.contain({
      collapse: "^packages/[^/]+",
    });
  });

  it("calculates metrics when the selected reporter specifies to show metrics", () => {
    expect(
      normalize.normalizeCruiseOptions({
        outputType: "dot",
        reporterOptions: { dot: { showMetrics: true } },
      })
    ).to.contain({
      metrics: true,
    });
  });

  it("calculates metrics when the selected reporter specifies to not show metrics", () => {
    expect(
      normalize.normalizeCruiseOptions({
        outputType: "dot",
        reporterOptions: { dot: { showMetrics: false } },
      })
    ).to.contain({
      metrics: false,
    });
  });

  it("calculates metrics when the selected reporter doesn't specify to show metrics", () => {
    expect(
      normalize.normalizeCruiseOptions({
        outputType: "dot",
      })
    ).to.contain({
      metrics: false,
    });
  });
});

describe("[I] normalize cache options", () => {
  it("normalizes cache options into an object - true", () => {
    expect(
      normalize.normalizeCruiseOptions({ cache: true }).cache
    ).to.deep.equal({
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "metadata",
    });
  });
  it("normalizes cache options into an object - string", () => {
    expect(
      normalize.normalizeCruiseOptions({ cache: "some/alternate/folder" }).cache
    ).to.deep.equal({
      folder: "some/alternate/folder",
      strategy: "metadata",
    });
  });
  it("normalizes cache options into an object - empty object", () => {
    expect(normalize.normalizeCruiseOptions({ cache: {} }).cache).to.deep.equal(
      {
        folder: "node_modules/.cache/dependency-cruiser",
        strategy: "metadata",
      }
    );
  });

  it("normalizes cache options into an object - partial object (strategy only)", () => {
    expect(
      normalize.normalizeCruiseOptions({ cache: { strategy: "content" } }).cache
    ).to.deep.equal({
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "content",
    });
  });
  it("normalizes cache options into an object - partial object (folder only)", () => {
    expect(
      normalize.normalizeCruiseOptions({
        cache: { folder: "some/alternate/folder" },
      }).cache
    ).to.deep.equal({
      folder: "some/alternate/folder",
      strategy: "metadata",
    });
  });
  it("passed false for cache - remains false (no object)", () => {
    expect(normalize.normalizeCruiseOptions({ cache: false }).cache).to.equal(
      false
    );
  });
  it("passed no cache - no cache property", () => {
    expect(normalize.normalizeCruiseOptions({})).to.not.haveOwnProperty(
      "cache"
    );
  });
});

/* eslint no-magic-numbers: 0*/
