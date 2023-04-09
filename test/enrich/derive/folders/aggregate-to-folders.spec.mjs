import { expect } from "chai";

import aggregateToFolders from "../../../../src/enrich/derive/folders/aggregate-to-folders.mjs";

function compareFolders(pLeftFolder, pRightFolder) {
  return pLeftFolder.name.localeCompare(pRightFolder.name);
}

describe("[U] enrich/derive/folders/aggregate-to-folders - folder stability metrics derivation", () => {
  it("no modules no metrics", () => {
    expect(aggregateToFolders([])).to.deep.equal([]);
  });

  it("no dependencies no dependents", () => {
    expect(
      aggregateToFolders([
        { source: "src/folder/index.js", dependencies: [], dependents: [] },
      ]).sort(compareFolders)
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
    ]);
  });

  it("dependencies no dependents", () => {
    expect(
      aggregateToFolders([
        {
          source: "src/folder/index.js",
          dependencies: [{ resolved: "src/other-folder/utensil.js" }],
          dependents: [],
        },
        {
          source: "src/other-folder/utensils.js",
          dependencies: [],
          dependents: ["src/folder/index.js"],
        },
      ]).sort(compareFolders)
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 2,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: [],
        dependencies: [
          { name: "src/other-folder", instability: 0, circular: false },
        ],
        afferentCouplings: 0,
        efferentCouplings: 1,
        instability: 1,
      },
      {
        name: "src/other-folder",
        moduleCount: 1,
        dependents: [
          {
            name: "src/folder",
          },
        ],
        dependencies: [],
        afferentCouplings: 1,
        efferentCouplings: 0,
        instability: 0,
      },
    ]);
  });

  it("dependencies no dependents - non-zero instability", () => {
    expect(
      aggregateToFolders([
        {
          source: "src/folder/index.js",
          dependencies: [
            { resolved: "src/other-folder/utensil.js" },
            { resolved: "src/yet-another-folder/thing.js" },
          ],
          dependents: [],
        },
        {
          source: "src/other-folder/uttensil.js",
          dependencies: [],
          dependents: [
            "src/folder/index.js",
            "src/yet-another-folder/thing.js",
          ],
        },
        {
          source: "src/yet-another-folder/thing.js",
          dependencies: [{ resolved: "src/other-folder/utensil.js" }],
          dependents: ["src/folder/index.js"],
        },
      ]).sort(compareFolders)
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 3,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: [],
        dependencies: [
          { name: "src/other-folder", instability: 0, circular: false },
          { name: "src/yet-another-folder", instability: 0.5, circular: false },
        ],
        afferentCouplings: 0,
        efferentCouplings: 2,
        instability: 1,
      },
      {
        name: "src/other-folder",
        moduleCount: 1,
        dependents: [
          { name: "src/folder" },
          {
            name: "src/yet-another-folder",
          },
        ],
        dependencies: [],
        afferentCouplings: 2,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/yet-another-folder",
        moduleCount: 1,
        dependents: [
          {
            name: "src/folder",
          },
        ],
        dependencies: [
          {
            instability: 0,
            name: "src/other-folder",
            circular: false,
          },
        ],
        afferentCouplings: 1,
        efferentCouplings: 1,
        instability: 0.5,
      },
    ]);
  });

  it("no dependencies but dependents", () => {
    expect(
      aggregateToFolders([
        {
          source: "src/folder/index.js",
          dependencies: [],
          dependents: ["src/other-folder/utensil.js"],
        },
      ]).sort(compareFolders)
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: [{ name: "src/other-folder" }],
        dependencies: [],
        afferentCouplings: 1,
        efferentCouplings: 0,
        instability: 0,
      },
    ]);
  });

  it("handling core modules", () => {
    expect(
      aggregateToFolders([
        {
          source: "src/index.js",
          dependencies: [{ resolved: "fs" }],
          dependents: [],
        },
      ]).sort(compareFolders)
    ).to.deep.equal([
      {
        dependencies: [],
        dependents: [],
        moduleCount: -1,
        name: "fs",
      },
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [{ name: "fs", instability: 0, circular: false }],
        afferentCouplings: 0,
        efferentCouplings: 1,
        instability: 1,
      },
    ]);
  });
});
