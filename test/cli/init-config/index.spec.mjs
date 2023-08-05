import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { deepStrictEqual, strictEqual } from "node:assert";
import Ajv from "ajv";
import deleteDammit from "../delete-dammit.utl.cjs";
import initConfig from "../../../src/cli/init-config/index.mjs";
import configurationSchema from "../../../src/schema/configuration.schema.mjs";

const ajv = new Ajv();

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("[I] cli/init-config/index", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("init creates a self-contained js rules file", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      RULES_FILE_JS,
    )}`;

    try {
      initConfig("notyes");
      const lResult = await import(lConfigResultFileName);

      ajv.validate(configurationSchema, lResult.default);
      strictEqual(lResult.default.hasOwnProperty("extends"), false);
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes creates a self-contained js rules file", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfig = ".dependency-cruiser-self-contained.js";
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      lConfig,
    )}`;

    try {
      initConfig("yes", lConfig);
      const lResult = await import(lConfigResultFileName);

      ajv.validate(configurationSchema, lResult.default);
      strictEqual(lResult.default.hasOwnProperty("extends"), false);
      strictEqual(lResult.default.options.hasOwnProperty("tsConfig"), false);
    } finally {
      deleteDammit(lConfig);
    }
  });

  it("init yes in a ts project creates a self-contained js rules file with typescript things flipped to yes", async () => {
    process.chdir("test/cli/__fixtures__/init-config/ts-config-exists");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/ts-config-exists",
      RULES_FILE_JS,
    )}`;

    try {
      initConfig("yes");
      const lResult = await import(lConfigResultFileName);

      ajv.validate(configurationSchema, lResult.default);
      strictEqual(lResult.default.hasOwnProperty("extends"), false);
      strictEqual(lResult.default.options.hasOwnProperty("tsConfig"), true);
      deepStrictEqual(lResult.default.options.tsConfig, {
        fileName: "tsconfig.json",
      });
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes in a webpack project creates a self-contained js rules file with webpack things flipped to yes", async () => {
    process.chdir("test/cli/__fixtures__/init-config/webpack-config-exists");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/webpack-config-exists",
      RULES_FILE_JS,
    )}`;

    try {
      initConfig("yes");
      const lResult = await import(lConfigResultFileName);

      ajv.validate(configurationSchema, lResult.default);
      strictEqual(lResult.default.hasOwnProperty("extends"), false);
      strictEqual(
        lResult.default.options.hasOwnProperty("webpackConfig"),
        true,
      );
      deepStrictEqual(lResult.default.options.webpackConfig, {
        fileName: "webpack.config.js",
      });
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init experimental-scripts creates a .dependency-cruiser config + updates package.json with scripts", async () => {
    process.chdir("test/cli/init-config/__fixtures__/update-manifest");

    const lConfigResultFileName = `./${join(
      "__fixtures__/update-manifest",
      RULES_FILE_JS,
    )}`;

    const lManifestFilename = "package.json";
    writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("experimental-scripts");
      const lResult = await import(lConfigResultFileName);

      ajv.validate(configurationSchema, lResult.default);

      const lManifest = JSON.parse(readFileSync(lManifestFilename, "utf8"));
      strictEqual(lManifest.hasOwnProperty("scripts"), true);
    } finally {
      deleteDammit(RULES_FILE_JS);
      deleteDammit(lManifestFilename);
    }
  });

  it("init experimental-scripts updates package.json with scripts, and leaves an existing dc config alone", async () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/update-manifest-dc-config-exists",
    );

    const lConfigResultFileName = `./${join(
      "__fixtures__/update-manifest-dc-config-exists",
      RULES_FILE_JS,
    )}`;
    const lManifestFilename = "package.json";
    writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("experimental-scripts");
      const lResult = await import(lConfigResultFileName);

      ajv.validate(configurationSchema, lResult.default);
      deepStrictEqual(lResult.default, {});

      const lManifest = JSON.parse(readFileSync(lManifestFilename, "utf8"));
      strictEqual(lManifest.hasOwnProperty("scripts"), true);
    } finally {
      deleteDammit(lManifestFilename);
    }
  });
});
