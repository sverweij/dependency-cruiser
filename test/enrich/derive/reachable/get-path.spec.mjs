import { expect } from "chai";
import getPath from "../../../../src/enrich/derive/reachable/get-path.js";
import clearCaches from "../../../../src/enrich/clear-caches.js";

describe("[U] enrich/derive/reachable/getGraph - reachability detection", () => {
  beforeEach("set up", () => {
    clearCaches();
  });
  afterEach("tear down", () => {
    clearCaches();
  });

  it("does not explode when passed an empty graph", () => {
    expect(getPath([], "./src/index.js", "./src/hajoo.js")).to.deep.equal([]);
  });

  it("returns [] when from is a lonely module", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/hajoo.js")).to.deep.equal(
      []
    );
  });

  it("returns [from, to] when from is a direct dependency of from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/hajoo.js")).to.deep.equal([
      "./src/index.js",
      "./src/hajoo.js",
    ]);
  });

  it("returns [] when to == from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/index.js")).to.deep.equal(
      []
    );
  });

  it("returns [] when to is not in dependencies of from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/noooo.js",
          },
        ],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/hajoo.js")).to.deep.equal(
      []
    );
  });

  it("returns true when to is a dependency one removed of from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/hajoo.js")).to.deep.equal([
      "./src/index.js",
      "./src/intermediate.js",
      "./src/hajoo.js",
    ]);
  });

  it("doesn't get dizzy when a dep is circular (did not find to)", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/hajoo.js")).to.deep.equal(
      []
    );
  });

  it("doesn't get dizzy when a dep is circular (did find to)", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
    ];

    expect(getPath(lGraph, "./src/index.js", "./src/hajoo.js")).to.deep.equal([
      "./src/index.js",
      "./src/intermediate.js",
      "./src/hajoo.js",
    ]);
  });
});
