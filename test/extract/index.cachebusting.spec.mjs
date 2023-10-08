import { renameSync } from "node:fs";
import { deepEqual, notDeepStrictEqual } from "node:assert/strict";
import { createRequireJSON } from "../backwards.utl.mjs";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.mjs";
import extract from "#extract/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("[I] extract/index - cache busting", () => {
  it("delivers a different output", async () => {
    const lOptions = normalizeCruiseOptions({
      ruleSet: {
        forbidden: [
          {
            name: "burp-on-core",
            severity: "error",
            from: {},
            to: {
              dependencyTypes: ["core"],
            },
          },
        ],
      },
      validate: true,
      tsPreCompilationDeps: true,
      moduleSystems: ["amd", "cjs", "es6"],
      doNotFollow: {
        dependencyTypes: [
          "npm",
          "npm-dev",
          "npm-optional",
          "npm-peer",
          "npm-bundled",
        ],
      },
    });
    const lResolveOptions = await normalizeResolveOptions({}, lOptions);
    const lFirstResultFixture = requireJSON(
      "./__fixtures__/cache-busting-first-tree.json",
    );
    const lSecondResultFixture = requireJSON(
      "./__fixtures__/cache-busting-second-tree.json",
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting-first-tree",
      "./test/extract/__mocks__/cache-busting",
    );

    const lFirstResult = extract(
      ["./test/extract/__mocks__/cache-busting/index.ts"],
      lOptions,
      lResolveOptions,
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting",
      "./test/extract/__mocks__/cache-busting-first-tree",
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting-second-tree",
      "./test/extract/__mocks__/cache-busting",
    );

    const lSecondResult = extract(
      ["./test/extract/__mocks__/cache-busting/index.ts"],
      lOptions,
      lResolveOptions,
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting",
      "./test/extract/__mocks__/cache-busting-second-tree",
    );

    deepEqual(lFirstResult, lFirstResultFixture);
    deepEqual(lSecondResult, lSecondResultFixture);
    notDeepStrictEqual(lSecondResult, lFirstResult);
  });
});
