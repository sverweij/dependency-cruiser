import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path/posix";
import { deepEqual, ok, equal } from "node:assert/strict";
import { randomBytes } from "node:crypto";
import Ajv from "ajv";
import deleteDammit from "../delete-dammit.utl.cjs";
import configurationSchema from "#configuration-schema";
import buildConfig from "#cli/init-config/build-config.mjs";
import normalizeInitOptions from "#cli/init-config/normalize-init-options.mjs";

const ajv = new Ajv();
const RANDOM_TMP_FILENAME_LENGTH = 10;

const createConfigNormalized = async (pInitOptions) => {
  const lConfigAsString = buildConfig(normalizeInitOptions(pInitOptions));
  let lTemporaryFileName = join(
    tmpdir(),
    `${randomBytes(RANDOM_TMP_FILENAME_LENGTH).toString("hex")}.cjs`,
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

  it("generates a valid config - jsConfig", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      useJsConfig: true,
      jsConfig: "./jsconfig.json",
    });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.tsConfig, {
      fileName: "./jsconfig.json",
    });
  });

  it("generates a valid config - babelConfig", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      useBabelConfig: true,
      babelConfig: "./.babelrc.json",
    });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.babelConfig, {
      fileName: "./.babelrc.json",
    });
  });

  it("generates mainFields including 'module' for package.json with a type: module field", async () => {
    const lResult = await createConfigNormalized({ isTypeModule: true });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.enhancedResolveOptions.mainFields, [
      "module",
      "main",
      "types",
      "typings",
    ]);
  });

  it("generates mainFields including 'module' for package.json withOUT a type: module field", async () => {
    const lResult = await createConfigNormalized({});

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.enhancedResolveOptions.mainFields, [
      "main",
      "types",
      "typings",
    ]);
  });

  it("generates a builtins property with additional bun builtins when we use bun", async () => {
    const lResult = await createConfigNormalized({ usesBun: true });

    ajv.validate(configurationSchema, lResult);
    ok(lResult.hasOwnProperty("options"));
    deepEqual(lResult.options.builtInModules.add, [
      "bun",
      "bun:ffi",
      "bun:jsc",
      "bun:sqlite",
      "bun:test",
      "bun:wrap",
      "detect-libc",
      "undici",
      "ws",
    ]);
  });
});
