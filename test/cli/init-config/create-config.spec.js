/* eslint-disable security/detect-eval-with-expression, no-eval */

const chai = require("chai");
const buildConfig = require("../../../src/cli/init-config/build-config");
const normalizeInitOptions = require("../../../src/cli/init-config/normalize-init-options");
const configurationSchema = require("../../../src/schema/configuration.schema.json");

const expect = chai.expect;

chai.use(require("chai-json-schema"));

const createConfigNormalized = pInitOptions =>
  buildConfig(normalizeInitOptions(pInitOptions));

describe("cli/init-config/build-config", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("generates a valid config - configType preset without preset yields warn-only", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");
    const lResult = eval(
      createConfigNormalized({
        configType: "preset"
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("extends");
    expect(lResult.extends).to.equal(
      "dependency-cruiser/configs/recommended-warn-only"
    );
  });

  it("generates a valid config - with all things in one", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(createConfigNormalized({}));

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.not.haveOwnProperty("extends");
  });

  it("generates a valid config - extending the passed preset", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(
      createConfigNormalized({
        configType: "preset",
        preset: "@my/cool/company/configs/depcruise-preset"
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("forbidden");
    expect(lResult.extends).to.equal(
      "@my/cool/company/configs/depcruise-preset"
    );
  });

  it("generates a valid config - tests live with their sources", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(
      createConfigNormalized({
        configType: "preset",
        hasTestsOutsideSource: false
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("forbidden");
    expect(
      lResult.forbidden.some(pRule => pRule.name === "not-to-test")
    ).to.equal(false);
  });

  it("generates a valid config - tests live separately", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(
      createConfigNormalized({
        configType: "preset",
        hasTestsOutsideSource: true
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("forbidden");
    expect(
      lResult.forbidden.some(pRule => pRule.name === "not-to-test")
    ).to.equal(true);
  });

  it("generates a valid config - webpackConfig", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(
      createConfigNormalized({
        useWebpackConfig: true,
        webpackConfig: "./webpack.prod.js"
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("options");
    expect(lResult.options.webpackConfig).to.deep.equal({
      fileName: "./webpack.prod.js"
    });
  });

  it("generates a valid config - tsConfig", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(
      createConfigNormalized({
        useTsConfig: true,
        tsConfig: "./tsconfig.json"
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("options");
    expect(lResult.options.tsConfig).to.deep.equal({
      fileName: "./tsconfig.json"
    });
  });

  it("generates a valid config - useYarnPnP", () => {
    process.chdir("test/cli/fixtures/init-config/no-config-files-exist");

    const lResult = eval(
      createConfigNormalized({
        useYarnPnP: true
      })
    );

    expect(lResult).to.be.jsonSchema(configurationSchema);
    expect(lResult).to.haveOwnProperty("options");
    expect(lResult.options.externalModuleResolutionStrategy).to.equal(
      "yarn-pnp"
    );
  });
});

/* yep - doing some interesting things with requires here. Muffle eslint for this: */
/* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
