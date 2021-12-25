import { expect } from "chai";

import aggregateToFolders from "../../../../src/enrich/derive/folders/aggregate-to-folders.js";

function compareFolders(pLeftFolder, pRightFolder) {
  return pLeftFolder.name.localeCompare(pRightFolder.name);
}

describe("enrich/derive/folders/aggregate-to-folders - folder stability metrics derivation", () => {
  it("no modules no metrics", () => {
    expect(aggregateToFolders([])).to.deep.equal([]);
  });

  it("no dependencies no dependents", () => {
    expect(
      aggregateToFolders([
        { source: "src/folder/index.js", dependencies: [], dependents: [] },
      ])
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
        dependencies: [{ name: "src/other-folder", instability: 0 }],
        afferentCouplings: 0,
        efferentCouplings: 1,
        instability: 1,
      },
      {
        name: "src/other-folder",
        moduleCount: 1,
        dependencies: [],
        dependents: [{ name: "src/folder" }],
        afferentCouplings: 1,
        efferentCouplings: 0,
        instability: 0,
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
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [{ name: "fs", instability: 0 }],
        afferentCouplings: 0,
        efferentCouplings: 1,
        instability: 1,
      },
    ]);
  });
});
