"use strict";

const path   = require("path");
const expect = require("chai").expect;
const read   = require("../../../src/extract/resolve/readPackageDeps");

const FIXTUREDIR = "test/extract/resolve/fixtures/";

describe("readPackageDeps", () => {
    it("returns 'null' if the base dir does not exist", () => {
        expect(
            read('this-folder-does-not-exist')
        ).to.equal(null);
    });

    it("returns 'null' if the package.json does not exist over there", () => {
        expect(
            read(`${FIXTUREDIR}${path.sep}no-package-json`)
        ).to.equal(null);
    });

    it("returns 'null' if the package.json is invalid", () => {
        expect(
            read(`${FIXTUREDIR}${path.sep}invalid-package-json`)
        ).to.equal(null);
    });

    it("returns '{}' if the package.json is empty (which is - strictly speaking - not alloweod", () => {
        expect(
            read(`${FIXTUREDIR}${path.sep}empty-package-json`)
        ).to.deep.equal({});
    });

    it("returns an object with the package.json", () => {
        expect(
            read(`${FIXTUREDIR}${path.sep}minimal-package-json`)
        ).to.deep.equal({name: "the-absolute-bare-minimum-package-json", version: "481.0.0"});
    });
});
