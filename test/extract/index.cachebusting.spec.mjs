import { renameSync } from "node:fs";
import { expect } from "chai";
import extract from "../../src/extract/index.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.mjs";

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
      "./__fixtures__/cache-busting-first-tree.json"
    );
    const lSecondResultFixture = requireJSON(
      "./__fixtures__/cache-busting-second-tree.json"
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting-first-tree",
      "./test/extract/__mocks__/cache-busting"
    );

    const lFirstResult = extract(
      ["./test/extract/__mocks__/cache-busting/index.ts"],
      lOptions,
      lResolveOptions
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting",
      "./test/extract/__mocks__/cache-busting-first-tree"
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting-second-tree",
      "./test/extract/__mocks__/cache-busting"
    );

    const lSecondResult = extract(
      ["./test/extract/__mocks__/cache-busting/index.ts"],
      lOptions,
      lResolveOptions
    );

    renameSync(
      "./test/extract/__mocks__/cache-busting",
      "./test/extract/__mocks__/cache-busting-second-tree"
    );

    expect(lFirstResult).to.deep.equal(lFirstResultFixture);
    expect(lSecondResult).to.deep.equal(lSecondResultFixture);
    expect(lSecondResult).to.not.deep.equal(lFirstResult);
  });
});
