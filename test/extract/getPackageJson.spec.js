"use strict";

const expect = require('chai').expect;
const getPackageJson = require('../../src/extract/resolve/getPackageJson');

describe("getPackageJson", () => {
    it("returns null if the module does not exist", () => {
        expect(
            getPackageJson(
                './module-does-not-exist'
            )
        ).to.be.null;
    });

    it("returns null if there's no package.json for the module", () => {
        expect(
            getPackageJson(
                'test/estract//fixtures/deprecated-node-module/require-something-deprecated'
            )
        ).to.be.null;
    });

    it("returns null if there's no package.json for the module", () => {
        expect(
            getPackageJson(
                './require-something-deprecated',
                './fixtures/deprecated-node-module/'
            )
        ).to.be.null;
    });

    it("returns a package.json when there is one", () => {
        let lPackageJson = getPackageJson(
            'chai'
        );

        expect(
            lPackageJson
        ).to.be.not.null;
        expect(lPackageJson.hasOwnProperty('name')).to.be.true;
        expect(lPackageJson.name).to.equal('chai');
    });

    it("returns a package.json when there is one ('local' node_modules)", () => {
        let lPackageJson = getPackageJson(
            'deprecated-at-the-start-for-test-purposes',
            './test/extract/fixtures/deprecated-node-module/'
        );

        expect(
            lPackageJson
        ).to.be.not.null;
        expect(lPackageJson.hasOwnProperty('name')).to.be.true;
        expect(lPackageJson.name).to.equal('deprecated-at-the-start-for-test-purposes');
    });
});
/* eslint no-unused-expressions: 0 */
