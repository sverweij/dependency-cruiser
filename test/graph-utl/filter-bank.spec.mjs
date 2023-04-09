import { expect } from "chai";
import { applyFilters } from "../../src/graph-utl/filter-bank.mjs";
import reportModules from "./__mocks__/report-modules.mjs";
import reportIndexModule from "./__fixtures__/reaches/report-index-module.mjs";
import multiModuleRegexResult from "./__fixtures__/reaches/multi-module-regex-result.mjs";
import highlightResult from "./__fixtures__/highlight/highlight-result.mjs";

const MODULES = [
  {
    source: "included/index.js",
    dependencies: [
      { resolved: "also-included/index.js" },
      { resolved: "included/hoepla.js" },
      { resolved: "excluded/index.js" },
      { resolved: "do-not-follow/index.js" },
    ],
  },
  {
    source: "also-included/index.js",
    dependencies: [
      { resolved: "also-included/one-step-down.js" },
      { resolved: "included/one-step-down-too.js" },
      { resolved: "do-not-follow/index.js" },
    ],
  },
  {
    source: "also-included/one-step-down.js",
    dependencies: [],
  },
  {
    source: "also-included/one-step-down-too.js",
    dependencies: [],
  },
  {
    source: "included/hoepla.js",
    dependencies: [],
  },
  {
    source: "excluded/hoepla.js",
    dependencies: [],
  },
  {
    source: "excluded/moov-it/hoepla.js",
    dependencies: [],
  },
  {
    source: "do-not-follow/index.js",
    dependencies: [{ resolved: "do-not-follow/one-step-down.js" }],
  },
  {
    source: "do-not-follow/one-step-down.js",
    dependencies: [],
  },
];

describe("[U] graph-utl/filter-bank - null's, naughts, and zeros", () => {
  it("returns the input when no filter passed ", () => {
    expect(applyFilters(MODULES)).to.deep.equal(MODULES);
  });

  it("returns the input when an empty collection of filters is passed ", () => {
    expect(applyFilters(MODULES, {})).to.deep.equal(MODULES);
  });

  it("returns the input when empty filters are passed (exclude)", () => {
    expect(
      applyFilters(MODULES, {
        exclude: {},
      })
    ).to.deep.equal(MODULES);
  });
  it("returns the input when empty filters are passed (includeOnly)", () => {
    expect(
      applyFilters(MODULES, {
        includeOnly: {},
      })
    ).to.deep.equal(MODULES);
  });
  it("returns the input when empty filters are passed (focus)", () => {
    expect(
      applyFilters(MODULES, {
        focus: {},
      })
    ).to.deep.equal(MODULES);
  });
});

describe("[U] graph-utl/filter-bank - exclude, includeOnly, reaches, highlight", () => {
  it("returns the input without excluded modules when exclude is passed ", () => {
    expect(
      applyFilters(MODULES, { exclude: { path: "^excluded" } })
    ).to.deep.equal([
      {
        source: "included/index.js",
        dependencies: [
          { resolved: "also-included/index.js" },
          { resolved: "included/hoepla.js" },
          { resolved: "do-not-follow/index.js" },
        ],
      },
      {
        source: "also-included/index.js",
        dependencies: [
          { resolved: "also-included/one-step-down.js" },
          { resolved: "included/one-step-down-too.js" },
          { resolved: "do-not-follow/index.js" },
        ],
      },
      {
        source: "also-included/one-step-down.js",
        dependencies: [],
      },
      {
        source: "also-included/one-step-down-too.js",
        dependencies: [],
      },
      {
        source: "included/hoepla.js",
        dependencies: [],
      },
      {
        source: "do-not-follow/index.js",
        dependencies: [{ resolved: "do-not-follow/one-step-down.js" }],
      },
      {
        source: "do-not-follow/one-step-down.js",
        dependencies: [],
      },
    ]);
  });

  it("returns the input with only the included modules when includeOnly is passed ", () => {
    expect(
      applyFilters(MODULES, { includeOnly: { path: "included" } })
    ).to.deep.equal([
      {
        source: "included/index.js",
        dependencies: [
          { resolved: "also-included/index.js" },
          { resolved: "included/hoepla.js" },
        ],
      },
      {
        source: "also-included/index.js",
        dependencies: [
          { resolved: "also-included/one-step-down.js" },
          { resolved: "included/one-step-down-too.js" },
        ],
      },
      {
        source: "also-included/one-step-down.js",
        dependencies: [],
      },
      {
        source: "also-included/one-step-down-too.js",
        dependencies: [],
      },
      {
        source: "included/hoepla.js",
        dependencies: [],
      },
    ]);
  });

  it("reaches: regex selecting no existing module yields an empty array", () => {
    expect(
      applyFilters(reportModules, {
        reaches: { path: "this-module-does-not-exist" },
      })
    ).to.deep.equal([]);
  });

  it("reaches: regex selecting only a module without any dependents yields just that module", () => {
    expect(
      applyFilters(reportModules, {
        reaches: { path: "src/report/index.js" },
      })
    ).to.deep.equal(reportIndexModule);
  });

  it("reaches: regex selecting a without any dependents yields just that module", () => {
    expect(
      applyFilters(reportModules, {
        reaches: { path: "src/report/(utl/|anon/anonymize-path-element)" },
      })
    ).to.deep.equal(multiModuleRegexResult);
  });
  it("highlight: labels modules with matchesHighlight when they match the highlight", () => {
    expect(
      applyFilters(reportModules, {
        highlight: { path: "src/report/(utl/|anon/anonymize-path-element)" },
      })
    ).to.deep.equal(highlightResult);
  });
});
