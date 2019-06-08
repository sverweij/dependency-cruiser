const expect = require('chai').expect;
const addReachability = require('../../../../src/extract/derive/reachable/index');

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

const lAnotatedGraphForHajoo = [
    {
        source: './src/index.js',
        reachable: false,
        dependencies:[
            {
                resolved: './src/intermediate.js'
            }
        ]
    },
    {
        source: './src/intermediate.js',
        reachable: false,
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
        reachable: true,
        dependencies:[
        ]
    }
];

describe('extract/derive/reachable/index - reachability detection', () => {

    it('does not explode when passed an empty graph & an empty rule set', () => {
        expect(addReachability([], {})).to.deep.equal([]);
    });

    it('returns the input graph when passed an empty rule set', () => {
        expect(addReachability(lGraph, {})).to.deep.equal(lGraph);
    });

    it('returns the reachability annotated graph when a rule set with forbidden "reachable" in it', () => {
        const lForbiddenReachabilityRuleSetHajoo =
            {
                forbidden: [
                    {
                        from: {path: "src/hajoo\\.js"},
                        to: {reachable: false}
                    }
                ]
            };

        expect(addReachability(lGraph, lForbiddenReachabilityRuleSetHajoo)).to.deep.equal(lAnotatedGraphForHajoo);
    });

    it('returns the reachability annotated graph when a rule set with allowed "reachable" in it', () => {
        const lForbiddenReachabilityRuleSetHajoo =
            {
                allowed: [
                    {
                        from: {path: "src/hajoo\\.js"},
                        to: {reachable: true}
                    }
                ]
            };

        expect(addReachability(lGraph, lForbiddenReachabilityRuleSetHajoo)).to.deep.equal(lAnotatedGraphForHajoo);
    });

    // eslint-disable-next-line max-len
    it('returns the reachability annotated graph when passed a rule set with forbidden "reachable" in it (and a pathNot from)', () => {
        const lForbiddenReachabilityRuleSetHajoo =
            {
                forbidden: [
                    {
                        from: {pathNot: "intermediate|index"},
                        to: {reachable: false}
                    }
                ]
            };

        expect(addReachability(lGraph, lForbiddenReachabilityRuleSetHajoo)).to.deep.equal(lAnotatedGraphForHajoo);
    });

    it('returns the reachability annotated graph when with forbidden "reachable" in it that has a pathNot', () => {
        const lForbiddenReachabilityRuleSetHajoo =
            {
                forbidden: [
                    {
                        from: {path: "src/hajoo\\.js"},
                        to: {pathNot: "intermediate", reachable: false}
                    }
                ]
            };
        const lAnotatedGraphForHajooNoIntermediate = [
            {
                source: './src/index.js',
                reachable: false,
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
                reachable: true,
                dependencies:[
                ]
            }
        ];

        expect(
            addReachability(lGraph, lForbiddenReachabilityRuleSetHajoo)
        ).to.deep.equal(
            lAnotatedGraphForHajooNoIntermediate
        );
    });

    it('returns the reachability annotated graph when with forbidden "reachable" in it that has a path', () => {
        const lForbiddenReachabilityRuleSetHajoo =
            {
                forbidden: [
                    {
                        from: {path: "src/hajoo\\.js"},
                        to: {path: "intermediate", reachable: false}
                    }
                ]
            };
        const lAnotatedGraphForHajooNoIntermediate = [
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
                reachable: false,
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

        expect(
            addReachability(lGraph, lForbiddenReachabilityRuleSetHajoo)
        ).to.deep.equal(
            lAnotatedGraphForHajooNoIntermediate
        );
    });
});
