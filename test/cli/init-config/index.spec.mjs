import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { use, expect } from "chai";
import chaiJsonSchema from "chai-json-schema";
import deleteDammit from "../delete-dammit.utl.cjs";
import initConfig from "../../../src/cli/init-config/index.mjs";
import configurationSchema from "../../../src/schema/configuration.schema.mjs";

use(chaiJsonSchema);

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("[I] cli/init-config/index", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("init called with a string !== 'preset' creates a self-contained js rules file", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("notyes");
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(lResult.default).to.not.haveOwnProperty("extends");
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init preset creates a preset based js rules file", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfig = ".dependency-cruiser-preset-based.js";
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      lConfig
    )}`;

    try {
      initConfig("preset", lConfig);
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(lResult.default).to.haveOwnProperty("extends");
      expect(lResult.default.extends).to.equal(
        "dependency-cruiser/configs/recommended-strict"
      );
    } finally {
      deleteDammit(lConfig);
    }
  });

  it("init yes creates a self-contained js rules file", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfig = ".dependency-cruiser-self-contained.js";
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      lConfig
    )}`;

    try {
      initConfig("yes", lConfig);
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(lResult.default).to.not.haveOwnProperty("extends");
      expect(lResult.default.options).to.not.haveOwnProperty("tsConfig");
    } finally {
      deleteDammit(lConfig);
    }
  });

  it("init yes in a ts project creates a self-contained js rules file with typescript things flipped to yes", async () => {
    process.chdir("test/cli/__fixtures__/init-config/ts-config-exists");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/ts-config-exists",
      RULES_FILE_JS
    )}`;

    try {
      initConfig("yes");
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(lResult.default).to.not.haveOwnProperty("extends");
      expect(lResult.default.options).to.haveOwnProperty("tsConfig");
      expect(lResult.default.options.tsConfig).to.deep.equal({
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
      RULES_FILE_JS
    )}`;

    try {
      initConfig("yes");
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(lResult.default).to.not.haveOwnProperty("extends");
      expect(lResult.default.options).to.haveOwnProperty("webpackConfig");
      expect(lResult.default.options.webpackConfig).to.deep.equal({
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
      RULES_FILE_JS
    )}`;

    const lManifestFilename = "package.json";
    writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("experimental-scripts");
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(
        JSON.parse(readFileSync(lManifestFilename, "utf8"))
      ).to.haveOwnProperty("scripts");
    } finally {
      deleteDammit(RULES_FILE_JS);
      deleteDammit(lManifestFilename);
    }
  });

  it("init experimental-scripts updates package.json with scripts, and leaves an existing dc config alone", async () => {
    process.chdir(
      "test/cli/init-config/__fixtures__/update-manifest-dc-config-exists"
    );

    const lConfigResultFileName = `./${join(
      "__fixtures__/update-manifest-dc-config-exists",
      RULES_FILE_JS
    )}`;
    const lManifestFilename = "package.json";
    writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("experimental-scripts");
      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.be.jsonSchema(configurationSchema);
      expect(lResult.default).to.deep.equal({});
      expect(
        JSON.parse(readFileSync(lManifestFilename, "utf8"))
      ).to.haveOwnProperty("scripts");
    } finally {
      deleteDammit(lManifestFilename);
    }
  });
});
