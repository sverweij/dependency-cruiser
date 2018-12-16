"use strict";
const fs                = require('fs');
const chai              = require('chai');
const stripJSONComments = require('strip-json-comments');
const initRules         = require("../../src/cli/initRules");
const rulesSchema       = require('../../src/main/ruleSet/jsonschema.json');
const deleteDammit      = require("./deleteDammit.utl");

const expect       = chai.expect;
const RULES_FILE = ".dependency-cruiser.json";

chai.use(require('chai-json-schema'));

describe("initRules", () => {
    const WORKINGDIR = process.cwd();

    afterEach("tear down", () => {
        process.chdir(WORKINGDIR);
    });

    it("writes a valid rules file to .dependency-cruiser.json", () => {
        process.chdir('test/cli/fixtures/init-config/no-config-files-exist');
        initRules(RULES_FILE);
        expect(
            JSON.parse(
                stripJSONComments(
                    fs.readFileSync(RULES_FILE, "utf8")
                )
            )
        ).to.be.jsonSchema(rulesSchema);
        deleteDammit(RULES_FILE);
    });

    it("does not overwrite an existing config", () => {
        process.chdir('test/cli/fixtures/init-config/config-file-exists');
        let lStillHere = true;

        fs.writeFileSync(RULES_FILE, "{}", {encoding: "utf8", flag: "w"});
        try {
            initRules(RULES_FILE);
        } catch (e) {
            lStillHere = false;
            expect(e.message).to.contain("already exists here - leaving it be");
        }

        expect(lStillHere).to.equal(false);

        expect(
            fs.readFileSync(RULES_FILE, "utf8")
        ).to.equal("{}");

    });
});
