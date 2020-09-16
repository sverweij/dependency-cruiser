/* eslint-disable node/global-require */
const fs = require("fs");
const chai = require("chai");
const extract = require("~/src/extract");
const { normalizeCruiseOptions } = require("~/src/main/options/normalize");
const normalizeResolveOptions = require("~/src/main/resolve-options/normalize");

const expect = chai.expect;

describe("extract/index - cache busting", () => {
  it("delivers a different output", () => {
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
    const lResolveOptions = normalizeResolveOptions({}, lOptions);
    const lFirstResultFixture = require("./fixtures/cache-busting-first-tree.json");
    const lSecondResultFixture = require("./fixtures/cache-busting-second-tree.json");

    fs.renameSync(
      "./test/extract/fixtures/cache-busting-first-tree",
      "./test/extract/fixtures/cache-busting"
    );

    const lFirstResult = extract(
      ["./test/extract/fixtures/cache-busting/index.ts"],
      lOptions,
      lResolveOptions
    );

    fs.renameSync(
      "./test/extract/fixtures/cache-busting",
      "./test/extract/fixtures/cache-busting-first-tree"
    );

    fs.renameSync(
      "./test/extract/fixtures/cache-busting-second-tree",
      "./test/extract/fixtures/cache-busting"
    );

    const lSecondResult = extract(
      ["./test/extract/fixtures/cache-busting/index.ts"],
      lOptions,
      lResolveOptions
    );

    fs.renameSync(
      "./test/extract/fixtures/cache-busting",
      "./test/extract/fixtures/cache-busting-second-tree"
    );

    expect(lFirstResult).to.deep.equal(lFirstResultFixture);
    expect(lSecondResult).to.deep.equal(lSecondResultFixture);
    expect(lSecondResult).to.not.deep.equal(lFirstResult);
  });
});
