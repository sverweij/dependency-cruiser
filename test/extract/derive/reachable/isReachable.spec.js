const expect = require('chai').expect;
const isReachable = require('../../../../src/extract/derive/reachable/isReachable');

describe('extract/derive/reachable/isReachable - reachability detection', () => {

    it('does not explode when passed an empty graph', () => {
        expect(isReachable([], './src/index.js', './src/hajoo.js')).to.equal(false);
    });

    it('returns false when from is a lonely module', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                ]}
        ];

        expect(isReachable(lGraph, './src/index.js', './src/hajoo.js')).to.equal(false);
    });

    it('returns true when from is a direct dependency of from', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                    {
                        resolved: './src/hajoo.js'
                    }
                ]}
        ];

        expect(isReachable(lGraph, './src/index.js', './src/hajoo.js')).to.equal(true);
    });

    it('returns true when to == from', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                    {
                        resolved: './src/hajoo.js'
                    }
                ]}
        ];

        expect(isReachable(lGraph, './src/index.js', './src/index.js')).to.equal(true);
    });

    it('returns false when to is a not in dependencies of from', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                    {
                        resolved: './src/noooo.js'
                    }
                ]}
        ];

        expect(isReachable(lGraph, './src/index.js', './src/hajoo.js')).to.equal(false);
    });

    it('returns true when to is a dependency one removed of from', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                    {
                        resolved: './src/intermediate.js'
                    }
                ]
            },
            {
                source: './src/intermediate.js',
                dependencies:[
                    {
                        resolved: './src/hajoo.js'
                    }
                ]
            }
        ];

        expect(isReachable(lGraph, './src/index.js', './src/hajoo.js')).to.equal(true);
    });

    it('doesn\'t get dizzy when a dep is circular (did not find to)', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                    {
                        resolved: './src/intermediate.js'
                    }
                ]
            },
            {
                source: './src/intermediate.js',
                dependencies:[
                    {
                        resolved: './src/index.js'
                    }
                ]
            }
        ];

        expect(isReachable(lGraph, './src/index.js', './src/hajoo.js')).to.equal(false);
    });

    it('doesn\'t get dizzy when a dep is circular (did find to)', () => {
        const lGraph = [
            {
                source: './src/index.js',
                dependencies:[
                    {
                        resolved: './src/intermediate.js'
                    }
                ]
            },
            {
                source: './src/intermediate.js',
                dependencies:[
                    {
                        resolved: './src/index.js'
                    },
                    {
                        resolved: './src/hajoo.js'
                    }
                ]
            },
            {
                source: './src/hajoo.js',
                dependencies:[
                ]
            }
        ];

        expect(isReachable(lGraph, './src/index.js', './src/hajoo.js')).to.equal(true);
    });
});
