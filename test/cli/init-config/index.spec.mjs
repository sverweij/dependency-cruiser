import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { deepEqual, equal } from "node:assert/strict";
import { throws } from "node:assert";
import deleteDammit from "../delete-dammit.utl.cjs";
import {
  UnCalledWritableTestStream,
  WritableTestStream,
} from "../writable-test-stream.utl.mjs";
import { validate as validateConfigurationSchema } from "#schema/configuration.validate.mjs";
import initConfig from "#cli/init-config/index.mjs";

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("[I] cli/init-config/index", () => {
  const WORKINGDIR = process.cwd();
  const lErrorStream = new UnCalledWritableTestStream();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("init creates a self-contained js rules file", async () => {
    const lOutStream = new WritableTestStream(
      /Successfully created '[.]dependency-cruiser[.]js'/,
    );
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      RULES_FILE_JS,
    )}`;

    try {
      initConfig("notyes", null, {
        stdout: lOutStream,
        stderr: lErrorStream,
      });
      const lResult = await import(lConfigResultFileName);

      validateConfigurationSchema(lResult.default);
      equal(lResult.default.hasOwnProperty("extends"), false);
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes creates a self-contained js rules file", async () => {
    const lOutStream = new WritableTestStream(
      /Successfully created '[.]dependency-cruiser-self-contained[.]js'/,
    );
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfig = ".dependency-cruiser-self-contained.js";
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      lConfig,
    )}`;

    try {
      initConfig("yes", lConfig, {
        stdout: lOutStream,
        stderr: lErrorStream,
      });
      const lResult = await import(lConfigResultFileName);

      validateConfigurationSchema(lResult.default);
      equal(lResult.default.hasOwnProperty("extends"), false);
      equal(lResult.default.options.hasOwnProperty("tsConfig"), false);
    } finally {
      deleteDammit(lConfig);
    }
  });

  it("init yes borks with an error if a config file already exists", () => {
    const lWhatEverOutStream = new WritableTestStream(/.*/);
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lConfig = ".dependency-cruiser-blabla.js";

    try {
      initConfig("yes", lConfig, {
        stdout: lWhatEverOutStream,
        stderr: lWhatEverOutStream,
      });

      throws(() => {
        initConfig("yes", lConfig, {
          stdout: lWhatEverOutStream,
          stderr: lWhatEverOutStream,
        });
      }, /A '[.]dependency-cruiser-blabla[.]js' already exists here - leaving it be[.]/);
    } finally {
      deleteDammit(lConfig);
    }
  });

  it("init yes in a ts project creates a self-contained js rules file with typescript things flipped to yes", async () => {
    const lOutStream = new WritableTestStream(
      /Successfully created '[.]dependency-cruiser[.]js'/,
    );
    process.chdir("test/cli/__fixtures__/init-config/ts-config-exists");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/ts-config-exists",
      RULES_FILE_JS,
    )}`;

    try {
      initConfig("yes", null, {
        stdout: lOutStream,
        stderr: lErrorStream,
      });
      const lResult = await import(lConfigResultFileName);

      validateConfigurationSchema(lResult.default);
      equal(lResult.default.hasOwnProperty("extends"), false);
      equal(lResult.default.options.hasOwnProperty("tsConfig"), true);
      deepEqual(lResult.default.options.tsConfig, {
        fileName: "tsconfig.json",
      });
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init yes in a webpack project creates a self-contained js rules file with webpack things flipped to yes", async () => {
    const lOutStream = new WritableTestStream(
      /Successfully created '[.]dependency-cruiser[.]js'/,
    );

    process.chdir("test/cli/__fixtures__/init-config/webpack-config-exists");
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/webpack-config-exists",
      RULES_FILE_JS,
    )}`;

    try {
      initConfig("yes", null, {
        stdout: lOutStream,
        stderr: lErrorStream,
      });
      const lResult = await import(lConfigResultFileName);

      validateConfigurationSchema(lResult.default);
      equal(lResult.default.hasOwnProperty("extends"), false);
      equal(lResult.default.options.hasOwnProperty("webpackConfig"), true);
      deepEqual(lResult.default.options.webpackConfig, {
        fileName: "webpack.config.js",
      });
    } finally {
      deleteDammit(RULES_FILE_JS);
    }
  });

  it("init x-scripts creates a .dependency-cruiser config + updates package.json with scripts", async () => {
    const lOutStream = new WritableTestStream(
      /(Successfully created '.dependency-cruiser.js'|Run scripts added to '[.]\/package.json':)/,
    );
    process.chdir("test/cli/init-config/__fixtures__/update-manifest");

    const lConfigResultFileName = `./${join(
      "__fixtures__/update-manifest",
      RULES_FILE_JS,
    )}`;

    const lManifestFilename = "package.json";
    writeFileSync(lManifestFilename, "{}");

    try {
      initConfig("x-scripts", null, {
        stdout: lOutStream,
        stderr: lErrorStream,
      });
      const lResult = await import(lConfigResultFileName);

      validateConfigurationSchema(lResult.default);

      const lManifest = JSON.parse(readFileSync(lManifestFilename, "utf8"));
      equal(lManifest.hasOwnProperty("scripts"), true);
    } finally {
      deleteDammit(RULES_FILE_JS);
      deleteDammit(lManifestFilename);
    }
  });

  it("init x-scripts updates package.json with scripts, and leaves an existing dc config alone", async () => {
    const lOutStream = new WritableTestStream(
      /Run scripts added to '[.]\/package.json':/,
    );
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
      initConfig("x-scripts", null, {
        stdout: lOutStream,
        stderr: lErrorStream,
      });
      const lResult = await import(lConfigResultFileName);

      validateConfigurationSchema(lResult.default);
      deepEqual(lResult.default, {});

      const lManifest = JSON.parse(readFileSync(lManifestFilename, "utf8"));
      equal(lManifest.hasOwnProperty("scripts"), true);
    } finally {
      deleteDammit(lManifestFilename);
    }
  });
});
