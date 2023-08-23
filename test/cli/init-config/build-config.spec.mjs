import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path/posix";
import { deepEqual, ok, equal } from "node:assert/strict";
import Ajv from "ajv";
import buildConfig from "../../../src/cli/init-config/build-config.mjs";
import normalizeInitOptions from "../../../src/cli/init-config/normalize-init-options.mjs";
import configurationSchema from "../../../src/schema/configuration.schema.mjs";
import deleteDammit from "../delete-dammit.utl.cjs";

const ajv = new Ajv();

const createConfigNormalized = async (pInitOptions) => {
  const lConfigAsString = buildConfig(normalizeInitOptions(pInitOptions));
  const lBaseAbc = 36;
  let lTemporaryFileName = join(
    tmpdir(),
    `${Math.random().toString(lBaseAbc).split(".").pop()}.cjs`,
  );
  writeFileSync(lTemporaryFileName, lConfigAsString, "utf8");
  const lConfigAsModule = await import(`file:///${lTemporaryFileName}`);
  deleteDammit(lTemporaryFileName);

  return lConfigAsModule.default;
};

describe("[I] cli/init-config/build-config", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("generates a valid config - with all things in one", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({});

    ajv.validate(configurationSchema, lResult);
    ok(!lResult.hasOwnProperty("extends"));
  });

  it("generates a valid config - tests live with their sources", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      configType: "preset",
      hasTestsOutsideSource: false,
    });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("forbidden"));
    equal(
      lResult.forbidden.some((pRule) => pRule.name === "not-to-test"),
      false,
    );
  });

  it("generates a valid config - tests live separately", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      configType: "preset",
      hasTestsOutsideSource: true,
    });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("forbidden"));
    equal(
      lResult.forbidden.some((pRule) => pRule.name === "not-to-test"),
      true,
    );
  });

  it("generates a valid config - webpackConfig", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      useWebpackConfig: true,
      webpackConfig: "./webpack.prod.js",
    });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.webpackConfig, {
      fileName: "./webpack.prod.js",
    });
  });

  it("generates a valid config - tsConfig", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      useTsConfig: true,
      tsConfig: "./tsconfig.json",
    });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.tsConfig, {
      fileName: "./tsconfig.json",
    });
  });
});
