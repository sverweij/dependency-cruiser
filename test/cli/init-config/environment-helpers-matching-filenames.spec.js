/* eslint-disable no-unused-expressions */
const expect = require("chai").expect;
const {
  hasBabelConfigCandidates,
  getBabelConfigCandidates,
  hasTSConfigCandidates,
  getTSConfigCandidates,
  hasWebpackConfigCandidates,
  getWebpackConfigCandidates,
} = require("../../../src/cli/init-config/environment-helpers");

describe("cli/init-config/environment-helpers - getBabelConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-empty");
    expect(getBabelConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-ts");
    expect(getBabelConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-webpack"
    );
    expect(getBabelConfigCandidates()).to.deep.equal([]);
  });
  it("Returns all babel config variants present in a folder", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-babel");
    expect(getBabelConfigCandidates()).to.deep.equal([
      ".babelrc",
      ".babelrc.json",
      "babel.blabla-config.json",
      "babel.config.json",
      "tower-of-babel.config.json5",
    ]);
  });
  it("Returns all babel config variants present in a folder (including package.json if that contains a babel key)", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-babel-manifest"
    );
    expect(getBabelConfigCandidates()).to.deep.equal([
      "package.json",
      ".babelrc",
      ".babelrc.json",
      "babel.blabla-config.json",
      "babel.config.json",
      "tower-of-babel.config.json5",
    ]);
  });
});

describe("cli/init-config/environment-helpers - hasBabelConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when the folder is empty", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-empty");
    expect(hasBabelConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-ts");
    expect(hasBabelConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-webpack"
    );
    expect(hasBabelConfigCandidates()).to.equal(false);
  });
  it("Returns true when there's only babel configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-babel");
    expect(hasBabelConfigCandidates()).to.equal(true);
  });
});

describe("cli/init-config/environment-helpers - getTSConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-empty");
    expect(getTSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-babel");
    expect(getTSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-webpack"
    );
    expect(getTSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns all ts config variants present in a folder", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-ts");
    expect(getTSConfigCandidates()).to.deep.equal([
      "extended-tsconfig-from-base.json",
      "jsconfig.json",
      "tsconfig.base.json",
      "tsconfig.json",
    ]);
  });
});

describe("cli/init-config/environment-helpers - hasTSConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-empty");
    expect(hasTSConfigCandidates()).to.equal(false);
  });
  it("Returns true when there's only ts configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-ts");
    expect(hasTSConfigCandidates()).to.equal(true);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-webpack"
    );
    expect(hasTSConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-babel");
    expect(hasTSConfigCandidates()).to.equal(false);
  });
});

describe("cli/init-config/environment-helpers - getWebpackConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-empty");
    expect(getWebpackConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-ts");
    expect(getWebpackConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-webpack"
    );
    expect(getWebpackConfigCandidates()).to.deep.equal([
      "spiderwebpackconfig.cjs",
      "webpack-base-config.js",
      "webpack.conf.json",
      "webpack.config.js",
    ]);
  });
  it("Returns an empty array when there's only babel configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-babel");
    expect(getWebpackConfigCandidates()).to.deep.equal([]);
  });
});

describe("cli/init-config/environment-helpers - hasWebpackConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false the folder is empty", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-empty");
    expect(hasWebpackConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-ts");
    expect(hasWebpackConfigCandidates()).to.equal(false);
  });
  it("Returns true when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/fixtures/get-matching-filenames-webpack"
    );
    expect(hasWebpackConfigCandidates()).to.equal(true);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir("test/cli/init-config/fixtures/get-matching-filenames-babel");
    expect(hasWebpackConfigCandidates()).to.equal(false);
  });
});
