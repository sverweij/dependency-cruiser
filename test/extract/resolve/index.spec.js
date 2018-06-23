"use strict";

const path    = require('path');
const expect  = require('chai').expect;
const resolve = require('../../../src/extract/resolve');

describe("resolve/index", () => {
    it("resolves a local dependency to a file on disk", () => {
        expect(
            resolve(
                {
                    moduleName: './hots',
                    moduleSystem: 'es6'
                },
                path.join(__dirname, 'fixtures'),
                path.join(__dirname, 'fixtures', 'resolve')
            )
        ).to.deep.equal({
            coreModule: false,
            couldNotResolve: false,
            dependencyTypes: [
                "local"
            ],
            followable: true,
            resolved: 'resolve/hots.js'
        });
    });

    it("resolves a core module as core module", () => {
        expect(
            resolve(
                {
                    moduleName: 'path',
                    moduleSystem: 'es6'
                },
                path.join(__dirname, 'fixtures'),
                path.join(__dirname, 'fixtures', 'resolve'),
                {}
            )
        ).to.deep.equal({
            coreModule: true,
            couldNotResolve: false,
            dependencyTypes: [
                "core"
            ],
            followable: false,
            resolved: 'path'
        });
    });

    it("considers passed (webpack) aliases", () => {
        expect(
            resolve(
                {
                    moduleName: 'hoepla/hoi',
                    moduleSystem: 'es6'
                },
                path.join(__dirname, 'fixtures'),
                path.join(__dirname, 'fixtures', 'resolve'),
                {
                    alias:{
                        hoepla: path.join(__dirname, 'fixtures', 'i-got-aliased-to-hoepla')
                    },
                    bustTheCache: true
                }
            )
        ).to.deep.equal({
            coreModule: false,
            couldNotResolve: false,
            dependencyTypes: [
                "aliased"
            ],
            followable: true,
            resolved: 'i-got-aliased-to-hoepla/hoi/index.js'
        });
    });
});

