import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path/posix";
import { expect, use } from "chai";
import chaiJsonSchema from "chai-json-schema";
import buildConfig from "../../../src/cli/init-config/build-config.mjs";
import normalizeInitOptions from "../../../src/cli/init-config/normalize-init-options.mjs";
import configurationSchema from "../../../src/schema/configuration.schema.mjs";
import deleteDammit from "../delete-dammit.utl.cjs";

use(chaiJsonSchema);

const createConfigNormalized = async (pInitOptions) => {
  const lConfigAsString = buildConfig(normalizeInitOptions(pInitOptions));
  const lBaseAbc = 36;
  let lTemporaryFileName = join(
    tmpdir(),
    `${Math.random().toString(lBaseAbc).split(".").pop()}.cjs`
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

  it("generates a valid config - configType preset without preset yields warn-only", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");
    const lResult = await createConfigNormalized({
      configType: "preset",
    });

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("extends");
    expect(lResult.extends).to.equal(
      "dependency-cruiser/configs/recommended-warn-only"
    );
  });

  it("generates a valid config - with all things in one", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({});

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.not.haveOwnProperty("extends");
  });

  it("generates a valid config - extending the passed preset", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      configType: "preset",
      preset: "@my/cool/company/configs/depcruise-preset",
    });

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("forbidden");
    expect(lResult.extends).to.equal(
      "@my/cool/company/configs/depcruise-preset"
    );
  });

  it("generates a valid config - tests live with their sources", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      configType: "preset",
      hasTestsOutsideSource: false,
    });

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("forbidden");
    expect(
      lResult.forbidden.some((pRule) => pRule.name === "not-to-test")
    ).to.equal(false);
  });

  it("generates a valid config - tests live separately", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      configType: "preset",
      hasTestsOutsideSource: true,
    });

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("forbidden");
    expect(
      lResult.forbidden.some((pRule) => pRule.name === "not-to-test")
    ).to.equal(true);
  });

  it("generates a valid config - webpackConfig", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      useWebpackConfig: true,
      webpackConfig: "./webpack.prod.js",
    });

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("options");
    expect(lResult.options.webpackConfig).to.deep.equal({
      fileName: "./webpack.prod.js",
    });
  });

  it("generates a valid config - tsConfig", async () => {
    process.chdir("test/cli/__fixtures__/init-config/no-config-files-exist");

    const lResult = await createConfigNormalized({
      useTsConfig: true,
      tsConfig: "./tsconfig.json",
    });

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("options");
    expect(lResult.options.tsConfig).to.deep.equal({
      fileName: "./tsconfig.json",
    });
  });
});
