"use strict";
const expect           = require('chai').expect;
const optionNormalizer = require('../../src/cli/optionNormalizer');

describe("optionNormalizer", () => {
    it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", () => {
        expect(
            optionNormalizer({})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                validate: false
            }
        );
    });

    it("normalizes --system cjs,es6 to [cjs, es6]", () => {
        expect(
            optionNormalizer({system: "cjs,es6"})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: "cjs,es6",
                moduleSystems: ["cjs", "es6"],
                validate: false
            }
        );
    });

    it("normalizes --system {} to [amd, cjs, es6]", () => {
        expect(
            optionNormalizer({system: {}})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: {},
                moduleSystems: ["amd", "cjs", "es6"],
                validate: false
            }
        );
    });

    it("-v parameter assumes .dependency-cruiser for rules", () => {
        expect(
            optionNormalizer({validate: true})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                rulesFile: ".dependency-cruiser.json",
                validate: true
            }
        );
    });
    it("-v with parameter uses that parameter as rules file", () => {
        expect(
            optionNormalizer({validate: "./fixtures/rules.empty.json"})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                rulesFile: "./fixtures/rules.empty.json",
                validate: true
            }
        );
    });

});
