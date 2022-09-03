import { expect } from "chai";
import helpers from "../../../src/cli/init-config/environment-helpers.js";

describe("[U] cli/init-config/environment-helpers - getBabelConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.getBabelConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.getBabelConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.getBabelConfigCandidates()).to.deep.equal([]);
  });
  it("Returns all babel config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.getBabelConfigCandidates()).to.deep.equal([
      ".babelrc",
      ".babelrc.json",
      "babel.blabla-config.json",
      "babel.config.json",
      "tower-of-babel.config.json5",
    ]);
  });
  it("Returns all babel config variants present in a folder (including package.json if that contains a babel key)", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel-manifest"
    );
    expect(helpers.getBabelConfigCandidates()).to.deep.equal([
      "package.json",
      ".babelrc",
      ".babelrc.json",
      "babel.blabla-config.json",
      "babel.config.json",
      "tower-of-babel.config.json5",
    ]);
  });
});

describe("[U] cli/init-config/environment-helpers - hasBabelConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.hasBabelConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.hasBabelConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.hasBabelConfigCandidates()).to.equal(false);
  });
  it("Returns true when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.hasBabelConfigCandidates()).to.equal(true);
  });
});

describe("[U] cli/init-config/environment-helpers - getTSConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.getTSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.getTSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.getTSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns all ts config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.getTSConfigCandidates()).to.deep.equal([
      "extended-tsconfig-from-base.json",
      "tsconfig.base.json",
      "tsconfig.json",
    ]);
  });
});

describe("[U] cli/init-config/environment-helpers - getJSConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.getJSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.getJSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.getJSConfigCandidates()).to.deep.equal([]);
  });
  it("Returns all js config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.getJSConfigCandidates()).to.deep.equal([
      "jsconfig.json",
      "thingie-jsconfig.json",
    ]);
  });
});

describe("[U] cli/init-config/environment-helpers - hasTSConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.hasTSConfigCandidates()).to.equal(false);
  });
  it("Returns true when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.hasTSConfigCandidates()).to.equal(true);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.hasTSConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.hasTSConfigCandidates()).to.equal(false);
  });
});

describe("[U] cli/init-config/environment-helpers - getWebpackConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.getWebpackConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.getWebpackConfigCandidates()).to.deep.equal([]);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.getWebpackConfigCandidates()).to.deep.equal([
      "spiderwebpackconfig.cjs",
      "webpack-base-config.js",
      "webpack.conf.json",
      "webpack.config.js",
    ]);
  });
  it("Returns an empty array when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.getWebpackConfigCandidates()).to.deep.equal([]);
  });
});

describe("[U] cli/init-config/environment-helpers - hasWebpackConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty"
    );
    expect(helpers.hasWebpackConfigCandidates()).to.equal(false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts"
    );
    expect(helpers.hasWebpackConfigCandidates()).to.equal(false);
  });
  it("Returns true when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack"
    );
    expect(helpers.hasWebpackConfigCandidates()).to.equal(true);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel"
    );
    expect(helpers.hasWebpackConfigCandidates()).to.equal(false);
  });
});

describe("[U] cli/init-config/environment-helpers - isTypeModule", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when there is no manifest", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-empty");
    expect(helpers.isTypeModule()).to.equal(false);
  });
  it("Returns false when there's no type in the manifest", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/is-type-module-not-present"
    );
    expect(helpers.isTypeModule()).to.equal(false);
  });
  it("Returns false when the type in the manifest equals commonjs", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-commonjs");
    expect(helpers.isTypeModule()).to.equal(false);
  });
  it("Returns true when the type in the manifest equals module", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module");
    expect(helpers.isTypeModule()).to.equal(true);
  });
});

describe("[U] cli/init-config/environment-helpers - getDefaultConfigFileName", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when there is no manifest", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-empty");
    expect(helpers.getDefaultConfigFileName()).to.equal(
      ".dependency-cruiser.js"
    );
  });
  it("Returns false when there's no type in the manifest", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/is-type-module-not-present"
    );
    expect(helpers.getDefaultConfigFileName()).to.equal(
      ".dependency-cruiser.js"
    );
  });
  it("Returns false when the type in the manifest equals commonjs", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-commonjs");
    expect(helpers.getDefaultConfigFileName()).to.equal(
      ".dependency-cruiser.js"
    );
  });
  it("Returns true when the type in the manifest equals module", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module");
    expect(helpers.getDefaultConfigFileName()).to.equal(
      ".dependency-cruiser.cjs"
    );
  });
});
