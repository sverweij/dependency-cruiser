const fs                = require('fs');
const path              = require('path');
const chai              = require('chai');
const stripJSONComments = require('strip-json-comments');
const initRules         = require("../../src/cli/initRules");
const rulesSchema       = require('../../src/main/ruleSet/jsonschema.json');
const deleteDammit      = require("./deleteDammit.utl");

const expect            = chai.expect;
const RULES_FILE_JSON   = ".dependency-cruiser.json";
const RULES_FILE_JS     = ".dependency-cruiser.js";

chai.use(require('chai-json-schema'));

describe("initRules", () => {
    const WORKINGDIR = process.cwd();

    afterEach("tear down", () => {
        process.chdir(WORKINGDIR);
    });

    it("writes a valid rules file to .dependency-cruiser.json", () => {
        process.chdir('test/cli/fixtures/init-config/no-config-files-exist');
        try {
            initRules(RULES_FILE_JSON);
            expect(
                JSON.parse(
                    stripJSONComments(
                        fs.readFileSync(RULES_FILE_JSON, "utf8")
                    )
                )
            ).to.be.jsonSchema(rulesSchema);
        } finally {
            deleteDammit(RULES_FILE_JSON);
        }
    });

    it("writes a valid rules file to .dependency-cruiser.js", () => {
        process.chdir('test/cli/fixtures/init-config/no-config-files-exist');
        try {
            initRules(RULES_FILE_JS);
            expect(
                /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
                require(`./${path.join('fixtures/init-config/no-config-files-exist', RULES_FILE_JS)}`)
            ).to.be.jsonSchema(rulesSchema);
        } finally {
            deleteDammit(RULES_FILE_JS);
        }
    });

    it("does not overwrite an existing config", () => {
        process.chdir('test/cli/fixtures/init-config/config-file-exists');
        let lStillHere = true;

        fs.writeFileSync(RULES_FILE_JSON, "{}", {encoding: "utf8", flag: "w"});
        try {
            initRules(RULES_FILE_JSON);
        } catch (e) {
            lStillHere = false;
            expect(e.message).to.contain("already exists here - leaving it be");
        }

        expect(lStillHere).to.equal(false);

        expect(
            fs.readFileSync(RULES_FILE_JSON, "utf8")
        ).to.equal("{}");

    });
});
