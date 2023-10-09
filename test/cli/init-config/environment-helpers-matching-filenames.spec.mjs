import { deepEqual, equal } from "node:assert/strict";
import {
  hasTSConfigCandidates,
  getJSConfigCandidates,
  getTSConfigCandidates,
  hasBabelConfigCandidates,
  getBabelConfigCandidates,
  hasWebpackConfigCandidates,
  getWebpackConfigCandidates,
  getDefaultConfigFileName,
  isTypeModule,
} from "#cli/init-config/environment-helpers.mjs";

describe("[U] cli/init-config/environment-helpers - getBabelConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    deepEqual(getBabelConfigCandidates(), []);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepEqual(getBabelConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepEqual(getBabelConfigCandidates(), []);
  });
  it("Returns all babel config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepEqual(getBabelConfigCandidates(), [
      ".babelrc",
      ".babelrc.json",
      "babel.blabla-config.json",
      "babel.config.json",
      "tower-of-babel.config.json5",
    ]);
  });
  it("Returns all babel config variants present in a folder (including package.json if that contains a babel key)", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel-manifest",
    );
    deepEqual(getBabelConfigCandidates(), [
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
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    equal(hasBabelConfigCandidates(), false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    equal(hasBabelConfigCandidates(), false);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    equal(hasBabelConfigCandidates(), false);
  });
  it("Returns true when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    equal(hasBabelConfigCandidates(), true);
  });
});

describe("[U] cli/init-config/environment-helpers - getTSConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    deepEqual(getTSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepEqual(getTSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepEqual(getTSConfigCandidates(), []);
  });
  it("Returns all ts config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepEqual(getTSConfigCandidates(), [
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
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    deepEqual(getJSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepEqual(getJSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepEqual(getJSConfigCandidates(), []);
  });
  it("Returns all js config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepEqual(getJSConfigCandidates(), [
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
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    equal(hasTSConfigCandidates(), false);
  });
  it("Returns true when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    equal(hasTSConfigCandidates(), true);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    equal(hasTSConfigCandidates(), false);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    equal(hasTSConfigCandidates(), false);
  });
});

describe("[U] cli/init-config/environment-helpers - getWebpackConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    deepEqual(getWebpackConfigCandidates(), []);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepEqual(getWebpackConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepEqual(getWebpackConfigCandidates(), [
      "spiderwebpackconfig.cjs",
      "webpack-base-config.js",
      "webpack.conf.json",
      "webpack.config.js",
    ]);
  });
  it("Returns an empty array when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepEqual(getWebpackConfigCandidates(), []);
  });
});

describe("[U] cli/init-config/environment-helpers - hasWebpackConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    equal(hasWebpackConfigCandidates(), false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    equal(hasWebpackConfigCandidates(), false);
  });
  it("Returns true when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    equal(hasWebpackConfigCandidates(), true);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    equal(hasWebpackConfigCandidates(), false);
  });
});

describe("[U] cli/init-config/environment-helpers - isTypeModule", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when there is no manifest", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-empty");
    equal(isTypeModule(), false);
  });
  it("Returns false when there's no type in the manifest", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/is-type-module-not-present",
    );
    equal(isTypeModule(), false);
  });
  it("Returns false when the type in the manifest equals commonjs", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-commonjs");
    equal(isTypeModule(), false);
  });
  it("Returns true when the type in the manifest equals module", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module");
    equal(isTypeModule(), true);
  });
});

describe("[U] cli/init-config/environment-helpers - getDefaultConfigFileName", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when there is no manifest", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-empty");
    equal(getDefaultConfigFileName(), ".dependency-cruiser.js");
  });
  it("Returns false when there's no type in the manifest", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/is-type-module-not-present",
    );
    equal(getDefaultConfigFileName(), ".dependency-cruiser.js");
  });
  it("Returns false when the type in the manifest equals commonjs", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-commonjs");
    equal(getDefaultConfigFileName(), ".dependency-cruiser.js");
  });
  it("Returns true when the type in the manifest equals module", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module");
    equal(getDefaultConfigFileName(), ".dependency-cruiser.cjs");
  });
});
