import { expect } from "chai";
import mergePackages from "../../../src/extract/resolve/merge-manifests.mjs";

const INPUT = {
  description: "testington",
  dependencies: {
    slodash: "0.4.2",
  },
  optionalDependencies: {
    hidash: "1.2.3",
    midash: "4.3.2",
  },
  devDependencies: {
    nodash: "6.6.6",
  },
  bundledDependencies: ["nodash", "slodash"],
};
const FIXTURE = {
  dependencies: {
    slodash: "0.4.2",
  },
  optionalDependencies: {
    hidash: "1.2.3",
    midash: "4.3.2",
  },
  devDependencies: {
    nodash: "6.6.6",
  },
  bundledDependencies: ["nodash", "slodash"],
};

const INPUT_FURTHER = {
  peerDependencies: {
    peerdash: "8.8.8",
  },
  dependencies: {
    slodash: "1.2.3",
    furtherdash: "0.6.9",
  },
  bundledDependencies: ["furtherdash", "slodash"],
};

const FIXTURE_MERGED = {
  dependencies: {
    slodash: "0.4.2",
    furtherdash: "0.6.9",
  },
  optionalDependencies: {
    hidash: "1.2.3",
    midash: "4.3.2",
  },
  devDependencies: {
    nodash: "6.6.6",
  },
  peerDependencies: {
    peerdash: "8.8.8",
  },
  bundledDependencies: ["nodash", "slodash", "furtherdash"],
};

describe("[U] extract/resolve/get-manifest-dependencies/merge-manifests", () => {
  it("merging empty packages yields {}", () => {
    expect(mergePackages({}, {})).to.deep.equal({});
  });

  it("merging close package with a further {} yields close package (without non-dependency-keys)", () => {
    expect(mergePackages(INPUT, {})).to.deep.equal(FIXTURE);
  });

  it("merging close {} package with a further yields further package (without non-dependency-keys)", () => {
    expect(mergePackages({}, INPUT)).to.deep.equal(FIXTURE);
  });

  it("merging two identical packages yields the package (without non-dependency-keys)", () => {
    expect(mergePackages(INPUT, INPUT)).to.deep.equal(FIXTURE);
  });

  it("merging a close package with a further one yields merged packages, where the close package wins", () => {
    expect(mergePackages(INPUT, INPUT_FURTHER)).to.deep.equal(FIXTURE_MERGED);
  });

  it("merges bundleDependencies and bundledDependencies into one", () => {
    expect(
      mergePackages(
        {
          bundleDependencies: ["foo", "bar"],
        },
        {
          bundledDependencies: ["bar", "baz", "qux"],
        }
      )
    ).to.deep.equal({
      bundledDependencies: ["foo", "bar", "baz", "qux"],
    });
  });
});
