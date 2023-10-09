import { deepEqual } from "node:assert/strict";
import reportModules from "./__mocks__/report-modules.mjs";
import reportIndexModule from "./__fixtures__/reaches/report-index-module.mjs";
import multiModuleRegexResult from "./__fixtures__/reaches/multi-module-regex-result.mjs";
import highlightResult from "./__fixtures__/highlight/highlight-result.mjs";
import { applyFilters } from "#graph-utl/filter-bank.mjs";

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
    deepEqual(applyFilters(MODULES), MODULES);
  });

  it("returns the input when an empty collection of filters is passed ", () => {
    deepEqual(applyFilters(MODULES, {}), MODULES);
  });

  it("returns the input when empty filters are passed (exclude)", () => {
    deepEqual(
      applyFilters(MODULES, {
        exclude: {},
      }),
      MODULES,
    );
  });
  it("returns the input when empty filters are passed (includeOnly)", () => {
    deepEqual(
      applyFilters(MODULES, {
        includeOnly: {},
      }),
      MODULES,
    );
  });
  it("returns the input when empty filters are passed (focus)", () => {
    deepEqual(
      applyFilters(MODULES, {
        focus: {},
      }),
      MODULES,
    );
  });
});

describe("[U] graph-utl/filter-bank - exclude, includeOnly, reaches, highlight", () => {
  it("returns the input without excluded modules when exclude is passed ", () => {
    deepEqual(applyFilters(MODULES, { exclude: { path: "^excluded" } }), [
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
    deepEqual(applyFilters(MODULES, { includeOnly: { path: "included" } }), [
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
    deepEqual(
      applyFilters(reportModules, {
        reaches: { path: "this-module-does-not-exist" },
      }),
      [],
    );
  });

  it("reaches: regex selecting only a module without any dependents yields just that module", () => {
    deepEqual(
      applyFilters(reportModules, {
        reaches: { path: "src/report/index.js" },
      }),
      reportIndexModule,
    );
  });

  it("reaches: regex selecting a without any dependents yields just that module", () => {
    deepEqual(
      applyFilters(reportModules, {
        reaches: { path: "src/report/(utl/|anon/anonymize-path-element)" },
      }),
      multiModuleRegexResult,
    );
  });
  it("highlight: labels modules with matchesHighlight when they match the highlight", () => {
    deepEqual(
      applyFilters(reportModules, {
        highlight: { path: "src/report/(utl/|anon/anonymize-path-element)" },
      }),
      highlightResult,
    );
  });
});
