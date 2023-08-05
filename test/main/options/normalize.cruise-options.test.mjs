import { deepStrictEqual, ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { normalizeCruiseOptions } from "../../../src/main/options/normalize.mjs";

describe("[U] main/options/normalize - cruise options", () => {
  it("ensures maxDepth is an int when passed an int", () => {
    strictEqual(normalizeCruiseOptions({ maxDepth: 42 }).maxDepth, 42);
  });

  it("ensures maxDepth is an int when passed a string", () => {
    strictEqual(normalizeCruiseOptions({ maxDepth: "42" }).maxDepth, 42);
  });

  it("makes doNotFollow strings into an object", () => {
    deepStrictEqual(normalizeCruiseOptions({ doNotFollow: "42" }).doNotFollow, {
      path: "42",
    });
  });
  it("makes focus strings into an object", () => {
    deepStrictEqual(normalizeCruiseOptions({ focus: "42" }).focus, {
      path: "42",
    });
  });

  it("makes exclude arrays into an object with a string", () => {
    deepStrictEqual(
      normalizeCruiseOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude,
      {
        path: "^aap|^noot|mies$",
      }
    );
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    deepStrictEqual(
      normalizeCruiseOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude,
      {
        path: "^aap|^noot|mies$",
      }
    );
  });

  it("de-arrayify's archi reporter options' collapsePattern", () => {
    deepStrictEqual(
      normalizeCruiseOptions({
        reporterOptions: {
          archi: {
            collapsePattern: ["^src/[^/]+", "^node_modules/[^/]+", "^bin/"],
          },
        },
      }).reporterOptions,
      {
        archi: {
          collapsePattern: "^src/[^/]+|^node_modules/[^/]+|^bin/",
        },
      }
    );
  });

  it("de-arrayify's dot reporter options' filters", () => {
    deepStrictEqual(
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
      }).reporterOptions,
      {
        dot: {
          filters: { includeOnly: { path: "^src|^test|^bin" } },
        },
      }
    );
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex", () => {
    strictEqual(
      normalizeCruiseOptions({ collapse: 2 }, ["collapse"]).collapse,
      "node_modules/[^/]+|^[^/]+/[^/]+/"
    );
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex (digit in a string)", () => {
    strictEqual(
      normalizeCruiseOptions({ collapse: "2" }).collapse,
      "node_modules/[^/]+|^[^/]+/[^/]+/"
    );
  });

  it("collapse: leaves non-single digits alone", () => {
    strictEqual(
      normalizeCruiseOptions({ collapse: "22" }, ["collapse"]).collapse,
      "22"
    );
  });

  it("collapse: leaves a normal string/ regex like alone", () => {
    strictEqual(
      normalizeCruiseOptions({ collapse: "^packages/[^/]+" }, ["collapse"])
        .collapse,
      "^packages/[^/]+"
    );
  });

  it("calculates metrics when the selected reporter specifies to show metrics", () => {
    strictEqual(
      normalizeCruiseOptions({
        outputType: "dot",
        reporterOptions: { dot: { showMetrics: true } },
      }).metrics,
      true
    );
  });

  it("calculates metrics when the selected reporter specifies to not show metrics", () => {
    strictEqual(
      normalizeCruiseOptions({
        outputType: "dot",
        reporterOptions: { dot: { showMetrics: false } },
      }).metrics,
      false
    );
  });

  it("calculates metrics when the selected reporter doesn't specify to show metrics", () => {
    strictEqual(
      normalizeCruiseOptions({
        outputType: "dot",
      }).metrics,
      false
    );
  });
});

describe("[I] normalize cache options", () => {
  it("normalizes cache options into an object - true", () => {
    deepStrictEqual(normalizeCruiseOptions({ cache: true }).cache, {
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "metadata",
    });
  });
  it("normalizes cache options into an object - string", () => {
    deepStrictEqual(
      normalizeCruiseOptions({ cache: "some/alternate/folder" }).cache,
      {
        folder: "some/alternate/folder",
        strategy: "metadata",
      }
    );
  });
  it("normalizes cache options into an object - empty object", () => {
    deepStrictEqual(normalizeCruiseOptions({ cache: {} }).cache, {
      folder: "node_modules/.cache/dependency-cruiser",
      strategy: "metadata",
    });
  });

  it("normalizes cache options into an object - partial object (strategy only)", () => {
    deepStrictEqual(
      normalizeCruiseOptions({ cache: { strategy: "content" } }).cache,
      {
        folder: "node_modules/.cache/dependency-cruiser",
        strategy: "content",
      }
    );
  });
  it("normalizes cache options into an object - partial object (folder only)", () => {
    deepStrictEqual(
      normalizeCruiseOptions({
        cache: { folder: "some/alternate/folder" },
      }).cache,
      {
        folder: "some/alternate/folder",
        strategy: "metadata",
      }
    );
  });
  it("passed false for cache - remains false (no object)", () => {
    strictEqual(normalizeCruiseOptions({ cache: false }).cache, false);
  });
  it("passed no cache - no cache property", () => {
    ok(!normalizeCruiseOptions({}).hasOwnProperty("cache"));
  });
});

/* eslint no-magic-numbers: 0*/
