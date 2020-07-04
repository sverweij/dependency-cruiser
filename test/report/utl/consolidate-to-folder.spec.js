const { expect } = require("chai");
const consolidateToFolder = require("~/src/report/utl/consolidate-to-folder");

describe("report/utl/consolidateToFolder", () => {
  it("source gets squashed to its folder", () => {
    const lInput = [
      {
        source: "some/folder/thing.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: "some/folder",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [],
      },
    ];

    expect(consolidateToFolder(lInput)).to.deep.equal(lOutput);
  });

  it("files in the root go to '.'", () => {
    const lInput = [
      {
        source: "thing.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: ".",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [],
      },
    ];

    expect(consolidateToFolder(lInput)).to.deep.equal(lOutput);
  });

  it("dependencies' resolved names go to their dirname as well ", () => {
    const lInput = [
      {
        source: "thing.js",
        rules: [],
        valid: true,
        dependencies: [
          {
            resolved: "some/folder/bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
        ],
      },
      {
        source: "some/folder/bla.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: ".",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [
          {
            resolved: "some/folder",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
        ],
      },
      {
        source: "some/folder",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [],
      },
    ];

    expect(consolidateToFolder(lInput)).to.deep.equal(lOutput);
  });
});
