const fs                = require('fs');
const path              = require('path');
const chai              = require('chai');
const stripJSONComments = require('strip-json-comments');
const initRules         = require("../../../src/cli/initRules");
const rulesSchema       = require('../../../src/main/ruleSet/jsonschema.json');
const deleteDammit      = require("../deleteDammit.utl");

const expect            = chai.expect;

const RULES_FILE_JSON   = ".dependency-cruiser.json";
const RULES_FILE_JS     = ".dependency-cruiser.js";

describe("initRules/index.js", () => {
    const WORKINGDIR = process.cwd();

    afterEach("tear down", () => {
        process.chdir(WORKINGDIR);
    });

    it("init 'oneshot' creates a self-contained json rules file", () => {
        process.chdir('test/cli/fixtures/init-config/no-config-files-exist');
        try {
            initRules("oneshot");
            const lResult = JSON.parse(
                stripJSONComments(
                    fs.readFileSync(RULES_FILE_JSON, "utf8")
                )
            );

            expect(lResult).to.be.jsonSchema(rulesSchema);
            expect(lResult).to.not.haveOwnProperty("extends");
        } finally {
            deleteDammit(RULES_FILE_JSON);
        }
    });

    it("init js creates a preset based js rules file", () => {
        process.chdir('test/cli/fixtures/init-config/no-config-files-exist');
        const configResultFileName = `./${path.join('../fixtures/init-config/no-config-files-exist', RULES_FILE_JS)}`;

        try {
            initRules("js");
            /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
            const lResult = require(configResultFileName);

            expect(lResult).to.be.jsonSchema(rulesSchema);
            expect(lResult).to.haveOwnProperty("extends");
            expect(lResult.extends).to.equal("dependency-cruiser/configs/recommended-strict");
        } finally {
            Reflect.deleteProperty(
                require.cache,
                require.resolve(configResultFileName)
            );
            deleteDammit(RULES_FILE_JS);
        }
    });

    it("init json creates a preset based json rules file", () => {
        process.chdir('test/cli/fixtures/init-config/no-config-files-exist');

        try {
            initRules("json");
            const lResult = JSON.parse(
                stripJSONComments(
                    fs.readFileSync(RULES_FILE_JSON, "utf8")
                )
            );

            expect(lResult).to.be.jsonSchema(rulesSchema);
            expect(lResult).to.haveOwnProperty("extends");
            expect(lResult.extends).to.equal("dependency-cruiser/configs/recommended-strict");
        } finally {
            deleteDammit(RULES_FILE_JSON);
        }
    });

    // it("init on user input", () => {
    //     process.chdir('test/cli/fixtures/init-config/no-config-files-exist');
    //     try {
    //         initRules(true);
    //         const lResult = JSON.parse(
    //             stripJSONComments(
    //                 fs.readFileSync(RULES_FILE_JSON, "utf8")
    //             )
    //         );
    //
    //         expect(lResult).to.be.jsonSchema(rulesSchema);
    //         expect(lResult).to.not.haveOwnProperty("extends");
    //     } finally {
    //         deleteDammit(RULES_FILE_JSON);
    //     }
    // });
});
