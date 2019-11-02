const path = require("path");
const expect = require("chai").expect;
const readPackageDeps = require("../../../../src/extract/resolve/readPackageDeps");
const rootPackageJson = require("../../../../package.json");

const FIXTUREDIR = "test/extract/resolve/fixtures";
const WORKINGDIR = process.cwd();

describe("extract/resolve/readPackageDeps - classic strategy", () => {
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("returns 'null' if the package.json does not exist over there", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/no-package-json-here"
    );
    expect(readPackageDeps(path.parse(process.cwd()).root)).to.equal(null);
  });

  it("returns 'null' if the package.json is invalid", () => {
    expect(
      readPackageDeps(path.join(FIXTUREDIR, "invalid-package-json"))
    ).to.equal(null);
  });

  it("returns '{}' if the package.json is empty (which is - strictly speaking - not allowed", () => {
    expect(
      readPackageDeps(path.join(FIXTUREDIR, "empty-package-json"))
    ).to.deep.equal({});
  });

  it("returns an object with the package.json", () => {
    expect(
      readPackageDeps(path.join(FIXTUREDIR, "minimal-package-json"))
    ).to.deep.equal({
      name: "the-absolute-bare-minimum-package-json",
      version: "481.0.0"
    });
  });

  it("looks up the closest package.json", () => {
    expect(
      readPackageDeps(path.join(FIXTUREDIR, "no-package-json"))
    ).to.deep.equal(rootPackageJson);
  });
});

describe("extract/resolve/readPackageDeps - combined dependencies strategy", () => {
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("returns 'null' if the package.json does not exist over there", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/no-package-json-here"
    );
    expect(readPackageDeps(process.cwd(), process.cwd(), true)).to.equal(null);
  });

  it("returns 'null' if the package.json is invalid", () => {
    expect(
      readPackageDeps(
        path.join(FIXTUREDIR, "invalid-package-json"),
        path.join(FIXTUREDIR),
        true
      )
    ).to.equal(null);
  });

  it("returns the deps if the package.json exists in the baseDir", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/package-json-in-here"
    );
    expect(readPackageDeps(process.cwd(), process.cwd(), true)).to.deep.equal({
      dependencies: {
        modash: "11.11.11"
      }
    });
  });

  it("returns the combined deps if there's a package.json in both base and sub package", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/two-level-package-jsons"
    );
    expect(
      readPackageDeps(
        path.join(process.cwd(), "packages", "subthing"),
        process.cwd(),
        true
      )
    ).to.deep.equal({
      dependencies: {
        "base-only": "1.0.0",
        "base-and-subthing": "1.2.3-subthing",
        "subthing-only": "11.11.11"
      },
      devDependencies: {
        esdoorn: "4.2.1",
        snorkel: "1.2.1"
      },
      bundledDependencies: ["subthing-only", "base-and-subthing", "base-only"]
    });
  });

  it("returns the combined deps if there's a package.json in both base and sub package - subdir of sub", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/two-level-package-jsons"
    );
    expect(
      readPackageDeps(
        path.join(
          process.cwd(),
          "packages",
          "subthing",
          "src",
          "somefunctionality"
        ),
        process.cwd(),
        true
      )
    ).to.deep.equal({
      dependencies: {
        "base-only": "1.0.0",
        "base-and-subthing": "1.2.3-subthing",
        "subthing-only": "11.11.11"
      },
      devDependencies: {
        esdoorn: "4.2.1",
        snorkel: "1.2.1"
      },
      bundledDependencies: ["subthing-only", "base-and-subthing", "base-only"]
    });
  });

  it("passing a non-matching or non-existing basedir doesn't make combining dependencies loop eternaly", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/amok-prevention-non-exist"
    );
    expect(() => {
      readPackageDeps(process.cwd(), "bullocks-or-non-valid-basedir", true);
    }).to.throw(/Unusal baseDir passed to package reading function/);
  });

  it("passing a basedir that weirdly ends in '/' doesn't make combining dependencies loop eternaly", () => {
    process.chdir(
      "test/extract/resolve/readPackageDeps/fixtures/amok-prevention-bogus-sub"
    );
    expect(() => {
      readPackageDeps(process.cwd(), `${path.dirname(process.cwd())}/`, true);
    }).to.throw(/Unusal baseDir passed to package reading function/);
  });
});
