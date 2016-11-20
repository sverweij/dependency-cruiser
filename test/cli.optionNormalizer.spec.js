"use strict";
const expect           = require('chai').expect;
const optionNormalizer = require('../src/cli/optionNormalizer');

describe("optionNormalizer", () => {
    it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", () => {
        expect(
            optionNormalizer.normalize({})
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
            optionNormalizer.normalize({system: "cjs,es6"})
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
            optionNormalizer.normalize({system: {}})
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

    it("-v without -r assumes .dependency-cruiser for rules", () => {
        expect(
            optionNormalizer.normalize({validate: true})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                validate: true,
                rulesFile: ".dependency-cruiser.json"
            }
        );
    });
    it("-r implies -v", () => {
        expect(
            optionNormalizer.normalize({rulesFile: "./fixtures/rules.empty.json"})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "json",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                validate: true,
                rulesFile: "./fixtures/rules.empty.json"
            }
        );
    });

});
