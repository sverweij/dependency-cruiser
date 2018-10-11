"use strict";

const expect = require('chai').expect;
const localNpmHelpers = require('../../../src/extract/resolve/localNpmHelpers');

describe("localNpmHelpers.getPackageJson", () => {
    it("returns null if the module does not exist", () => {
        expect(
            localNpmHelpers.getPackageJson(
                './module-does-not-exist',
                '.',
                {}
            )
        ).to.be.null;
    });

    it("returns null if there's no package.json for the module (no basePath specified)", () => {
        expect(
            localNpmHelpers.getPackageJson(
                'test/extract/fixtures/deprecated-node-module/require-something-deprecated',
                '.',
                {}
            )
        ).to.be.null;
    });

    it("returns null if there's no package.json for the module (basePath specified)", () => {
        expect(
            localNpmHelpers.getPackageJson(
                './require-something-deprecated',
                './fixtures/deprecated-node-module/',
                {}
            )
        ).to.be.null;
    });

    it("returns a package.json when there is one", () => {
        let lPackageJson = localNpmHelpers.getPackageJson(
            'chai',
            ".",
            {}
        );

        expect(
            lPackageJson
        ).to.be.not.null;
        expect(lPackageJson.hasOwnProperty('name')).to.be.true;
        expect(lPackageJson.name).to.equal('chai');
    });

    it("returns a package.json when there is one ('local' node_modules)", () => {
        let lPackageJson = localNpmHelpers.getPackageJson(
            'deprecated-at-the-start-for-test-purposes',
            './test/extract/fixtures/deprecated-node-module/',
            {}
        );

        expect(
            lPackageJson
        ).to.be.not.null;
        expect(lPackageJson.hasOwnProperty('name')).to.be.true;
        expect(lPackageJson.name).to.equal('deprecated-at-the-start-for-test-purposes');
    });
});

describe("localNpmHelpers.getPackageRoot", () => {
    it("returns undefined if called without parameters", () => {
        expect(
            typeof localNpmHelpers.getPackageRoot()
        ).to.equal('undefined');
    });

    it("returns null if called with null", () => {
        expect(
            localNpmHelpers.getPackageRoot(null)
        ).to.equal(null);
    });

    it("locals unchanged: './localThing' => './localThing'", () => {
        expect(
            localNpmHelpers.getPackageRoot('./localThing')
        ).to.equal('./localThing');
    });

    it("returns the module name unchanged if called with a module name without a '/'", () => {
        expect(
            localNpmHelpers.getPackageRoot('lodash')
        ).to.equal('lodash');
    });

    it("returns the 'root' of the name when called with a module name with a '/'", () => {
        expect(
            localNpmHelpers.getPackageRoot('lodash/fp')
        ).to.equal('lodash');
    });

    it("@scoped/bla => @scoped/bla", () => {
        expect(
            localNpmHelpers.getPackageRoot('@scoped/bla')
        ).to.equal('@scoped/bla');
    });

    it("@scoped/bla/subthing => @scoped/bla", () => {
        expect(
            localNpmHelpers.getPackageRoot('@scoped/bla/subthing/sub/bla.json')
        ).to.equal('@scoped/bla');
    });

    it("@scoped => @scoped (note: weird edge case - shouldn't occur)", () => {
        expect(
            localNpmHelpers.getPackageRoot('@scoped')
        ).to.equal('@scoped');
    });
});

describe("localNpmHelpers.getLicense", () => {
    it("returns '' if the module does not exist", () => {
        expect(
            localNpmHelpers.getLicense('this-module-does-not-exist', '.', {})
        ).to.equal('');
    });

    it("returns '' if the module does exist but has no associated package.json", () => {
        expect(
            localNpmHelpers.getLicense('./test/extract/resolve/fixtures/no-package-json', '.', {})
        ).to.equal('');
    });

    it("returns '' if the module does exist, has a package.json, but no license field", () => {
        expect(
            localNpmHelpers.getLicense(
                'no-license',
                './test/extract/resolve/fixtures/licenses/',
                {}
            )
        ).to.equal('');
    });

    it("returns '' if the module exists, has a package.json, and a license field that is a boolean", () => {
        expect(
            localNpmHelpers.getLicense(
                'boolean-license',
                './test/extract/resolve/fixtures/licenses/',
                {}
            )
        ).to.equal('');
    });

    it("returns '' if the module exists, has a package.json, and a license field that is an object", () => {
        expect(
            localNpmHelpers.getLicense(
                'object-license',
                './test/extract/resolve/fixtures/licenses/',
                {}
            )
        ).to.equal('');
    });

    it("returns '' package.json has a licenses field that is an array (and no license field)", () => {
        expect(
            localNpmHelpers.getLicense(
                'array-license',
                './test/extract/resolve/fixtures/licenses/',
                {}
            )
        ).to.equal('');
    });

    it("returns the license if the module exists, has a package.json, and a string license field", () => {
        expect(
            localNpmHelpers.getLicense(
                'GPL-license',
                './test/extract/resolve/fixtures/licenses/',
                {}
            )
        ).to.equal('GPL-3.0');
    });

});
/* eslint no-unused-expressions: 0 */
