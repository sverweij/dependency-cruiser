"use strict";
const expect     = require('chai').expect;
const normalizer = require('../src/validate/ruleSetNormalizer');

describe("validator", () => {
    it("leaves the empty ruleset alone", () => {
        expect(normalizer.normalize({})).to.deep.equal({});
    });

    it("adds defaults for level and warning when they're not filled", () => {
        expect(normalizer.normalize({
            "allowed": [{
                "from": ".+",
                "to": ".+"
            }]
        })).to.deep.equal({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "level": "warning",
                "name": "unnamed"
            }]
        });
    });

    it("corrects the level to a default when it's not a recognized one", () => {
        expect(normalizer.normalize({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "level": "unrecognized",
                "name": "all-ok"
            }]
        })).to.deep.equal({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "level": "warning",
                "name": "all-ok"
            }]
        });
    });

    it("keeps the level if it's a recognized one", () => {
        expect(normalizer.normalize({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "level": "error",
                "name": "all-ok"
            }]
        })).to.deep.equal({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "level": "error",
                "name": "all-ok"
            }]
        });
    });

    it("also works for 'forbidden' rules", () => {
        expect(normalizer.normalize({
            "forbidden": [{
                "from": ".+",
                "to": ".+",
                "level": "error",
                "name": "all-ok",
                "comment": "this comment is kept"
            }]
        })).to.deep.equal({
            "forbidden": [{
                "from": ".+",
                "to": ".+",
                "level": "error",
                "name": "all-ok",
                "comment": "this comment is kept"
            }]
        });
    });
});
