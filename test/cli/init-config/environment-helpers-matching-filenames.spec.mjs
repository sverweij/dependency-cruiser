import { deepStrictEqual, strictEqual } from "node:assert";
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
} from "../../../src/cli/init-config/environment-helpers.mjs";

describe("[U] cli/init-config/environment-helpers - getBabelConfigCandidates", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns an empty array when the folder is empty", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-empty",
    );
    deepStrictEqual(getBabelConfigCandidates(), []);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepStrictEqual(getBabelConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepStrictEqual(getBabelConfigCandidates(), []);
  });
  it("Returns all babel config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepStrictEqual(getBabelConfigCandidates(), [
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
    deepStrictEqual(getBabelConfigCandidates(), [
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
    strictEqual(hasBabelConfigCandidates(), false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    strictEqual(hasBabelConfigCandidates(), false);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    strictEqual(hasBabelConfigCandidates(), false);
  });
  it("Returns true when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    strictEqual(hasBabelConfigCandidates(), true);
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
    deepStrictEqual(getTSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepStrictEqual(getTSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepStrictEqual(getTSConfigCandidates(), []);
  });
  it("Returns all ts config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepStrictEqual(getTSConfigCandidates(), [
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
    deepStrictEqual(getJSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    deepStrictEqual(getJSConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepStrictEqual(getJSConfigCandidates(), []);
  });
  it("Returns all js config variants present in a folder", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepStrictEqual(getJSConfigCandidates(), [
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
    strictEqual(hasTSConfigCandidates(), false);
  });
  it("Returns true when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    strictEqual(hasTSConfigCandidates(), true);
  });
  it("Returns false when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    strictEqual(hasTSConfigCandidates(), false);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    strictEqual(hasTSConfigCandidates(), false);
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
    deepStrictEqual(getWebpackConfigCandidates(), []);
  });
  it("Returns an empty array when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    deepStrictEqual(getWebpackConfigCandidates(), []);
  });
  it("Returns an empty array when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    deepStrictEqual(getWebpackConfigCandidates(), [
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
    deepStrictEqual(getWebpackConfigCandidates(), []);
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
    strictEqual(hasWebpackConfigCandidates(), false);
  });
  it("Returns false when there's only ts configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-ts",
    );
    strictEqual(hasWebpackConfigCandidates(), false);
  });
  it("Returns true when there's only webpack configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-webpack",
    );
    strictEqual(hasWebpackConfigCandidates(), true);
  });
  it("Returns false when there's only babel configs", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/get-matching-filenames-babel",
    );
    strictEqual(hasWebpackConfigCandidates(), false);
  });
});

describe("[U] cli/init-config/environment-helpers - isTypeModule", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when there is no manifest", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-empty");
    strictEqual(isTypeModule(), false);
  });
  it("Returns false when there's no type in the manifest", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/is-type-module-not-present",
    );
    strictEqual(isTypeModule(), false);
  });
  it("Returns false when the type in the manifest equals commonjs", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-commonjs");
    strictEqual(isTypeModule(), false);
  });
  it("Returns true when the type in the manifest equals module", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module");
    strictEqual(isTypeModule(), true);
  });
});

describe("[U] cli/init-config/environment-helpers - getDefaultConfigFileName", () => {
  const WORKINGDIR = process.cwd();
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("Returns false when there is no manifest", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-empty");
    strictEqual(getDefaultConfigFileName(), ".dependency-cruiser.js");
  });
  it("Returns false when there's no type in the manifest", () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/is-type-module-not-present",
    );
    strictEqual(getDefaultConfigFileName(), ".dependency-cruiser.js");
  });
  it("Returns false when the type in the manifest equals commonjs", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module-commonjs");
    strictEqual(getDefaultConfigFileName(), ".dependency-cruiser.js");
  });
  it("Returns true when the type in the manifest equals module", () => {
    process.chdir("test/cli/init-config/__fixtures__/is-type-module");
    strictEqual(getDefaultConfigFileName(), ".dependency-cruiser.cjs");
  });
});
