"use strict";
const expect           = require('chai').expect;
const normalizeOptions = require('../../src/cli/normalizeOptions');

describe("normalizeOptions", () => {
    it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", () => {
        expect(
            normalizeOptions({})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                validate: false
            }
        );
    });

    it("normalizes --module-systems cjs,es6 to [cjs, es6]", () => {
        expect(
            normalizeOptions({moduleSystems: "cjs,es6"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                moduleSystems: ["cjs", "es6"],
                validate: false
            }
        );
    });

    it("trims module system strings", () => {
        expect(
            normalizeOptions({
                moduleSystems: " amd,cjs ,  es6 "
            }).moduleSystems
        ).to.deep.equal(["amd", "cjs", "es6"]);
    });

    it("--system acts as an alias for --module-systems", () => {
        expect(
            normalizeOptions({system: "something,something"}).moduleSystems
        ).to.deep.equal(
            ["something", "something"]
        );
    });

    it("--system acts as an alias for --module-systems, but does not overwrite moduleSystems", () => {
        expect(
            normalizeOptions(
                {
                    moduleSystems: "something,something",
                    system: "sytem,othersystem"
                }
            ).moduleSystems
        ).to.deep.equal(
            ["something", "something"]
        );
    });

    it("-v parameter assumes .dependency-cruiser for rules", () => {
        try {
            normalizeOptions({validate: true});
        } catch (e) {
            expect(e.message).to.include("'.dependency-cruiser.json'");
        }
    });

    it("-v with parameter uses that parameter as rules file", () => {
        expect(
            normalizeOptions({validate: "./test/cli/fixtures/rules.empty.json"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                rulesFile: "./test/cli/fixtures/rules.empty.json",
                "ruleSet": {},
                validate: true
            }
        );
    });
});
