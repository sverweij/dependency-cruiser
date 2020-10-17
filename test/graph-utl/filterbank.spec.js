/* eslint-disable no-unused-expressions */
const { expect } = require("chai");
const filterbank = require("../../src/graph-utl/filterbank");

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

describe("utl/filterbank - null's, naughts, and zeros", () => {
  it("returns the input when no filter passed ", () => {
    expect(filterbank.applyFilters(MODULES)).to.deep.equal(MODULES);
  });

  it("returns the input when an empty collection of filters is passed ", () => {
    expect(filterbank.applyFilters(MODULES, {})).to.deep.equal(MODULES);
  });

  it("returns the input when empty filters are passed (exclude)", () => {
    expect(
      filterbank.applyFilters(MODULES, {
        exclude: {},
      })
    ).to.deep.equal(MODULES);
  });
  it("returns the input when empty filters are passed (includeOnly)", () => {
    expect(
      filterbank.applyFilters(MODULES, {
        includeOnly: {},
      })
    ).to.deep.equal(MODULES);
  });
  it("returns the input when empty filters are passed (focus)", () => {
    expect(
      filterbank.applyFilters(MODULES, {
        focus: {},
      })
    ).to.deep.equal(MODULES);
  });
});

describe("utl/filterbank - ", () => {
  it("returns the input without excluded modules when exclude is passed ", () => {
    expect(
      filterbank.applyFilters(MODULES, { exclude: { path: "^excluded" } })
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
      filterbank.applyFilters(MODULES, { includeOnly: { path: "included" } })
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
});
