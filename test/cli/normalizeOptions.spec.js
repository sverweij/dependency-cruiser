"use strict";
const expect           = require('chai').expect;
const normalizeOptions = require('../../src/cli/normalizeOptions');

describe("normalizeOptions", () => {
    it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", () => {
        expect(
            normalizeOptions({})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "err",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                validate: false
            }
        );
    });

    it("normalizes --system cjs,es6 to [cjs, es6]", () => {
        expect(
            normalizeOptions({system: "cjs,es6"})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "err",
                system: "cjs,es6",
                moduleSystems: ["cjs", "es6"],
                validate: false
            }
        );
    });

    it("normalizes --system {} to [amd, cjs, es6]", () => {
        expect(
            normalizeOptions({system: {}})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "err",
                system: {},
                moduleSystems: ["amd", "cjs", "es6"],
                validate: false
            }
        );
    });

    it("-v parameter assumes .dependency-cruiser for rules", () => {
        expect(
            normalizeOptions({validate: true})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "err",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                rulesFile: ".dependency-cruiser.json",
                validate: true
            }
        );
    });
    it("-v with parameter uses that parameter as rules file", () => {
        expect(
            normalizeOptions({validate: "./fixtures/rules.empty.json"})
        ).to.deep.equal(
            {
                exclude: "",
                outputTo: "-",
                outputType: "err",
                system: ["amd", "cjs", "es6"],
                moduleSystems: ["amd", "cjs", "es6"],
                rulesFile: "./fixtures/rules.empty.json",
                validate: true
            }
        );
    });

});
