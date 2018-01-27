const expect            = require('chai').expect;
const extractTypescript = require('../../../src/extract/extract-typescript');

describe("extract-typescript - triple slash directives", () => {

    it("path", () => {
        expect(
            extractTypescript('/// <reference path="./ts-thing" />')
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing',
                    moduleSystem: 'tsd'
                }
            ]
        );
    });

    it("types", () => {
        expect(
            extractTypescript('/// <reference types="./ts-thing-types" />')
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing-types',
                    moduleSystem: 'tsd'
                }
            ]
        );
    });

    it("amd-dependencies", () => {
        expect(
            extractTypescript('/// <amd-dependency path="./ts-thing-types" />')
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing-types',
                    moduleSystem: 'tsd'
                }
            ]
        );
    });
});
