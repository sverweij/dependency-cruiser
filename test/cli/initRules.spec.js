"use strict";
const chai         = require('chai');
const expect       = chai.expect;
const fs           = require('fs');
const deleteDammit = require("./deleteDammit.utl");
const initRules    = require("../../src/cli/initRules");
const rulesSchema  = require('../../src/validate/jsonschema.json');

const RULES_FILE = ".dependency-cruiser.json";

chai.use(require('chai-json-schema'));

describe("normalizeOptions", () => {

    beforeEach("set up", () => {
        deleteDammit(RULES_FILE);
    });

    afterEach("tear down", () => {
        deleteDammit(RULES_FILE);
    });

    it("writes a valid rules file to .dependency-cruiser.json", () => {
        initRules();
        expect(
            JSON.parse(fs.readFileSync(RULES_FILE, "utf8"))
        ).to.be.jsonSchema(rulesSchema);
    });

    it("does not overwrite an existing config", () => {
        let lStillHere = true;

        fs.writeFileSync(RULES_FILE, "{}", {encoding: "utf8", flag: "w"});
        try {
            initRules();
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
