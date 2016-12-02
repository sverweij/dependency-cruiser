"use strict";
const expect     = require('chai').expect;
const normalizer = require('../../src/validate/ruleSetNormalizer');

describe("validator", () => {
    it("leaves the empty ruleset alone", () => {
        expect(normalizer({})).to.deep.equal({});
    });

    it("adds defaults for severity and warn when they're not filled", () => {
        expect(normalizer({
            "allowed": [{
                "from": ".+",
                "to": ".+"
            }]
        })).to.deep.equal({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "severity": "warn",
                "name": "unnamed"
            }]
        });
    });

    it("corrects the severity to a default when it's not a recognized one", () => {
        expect(normalizer({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "severity": "unrecognized",
                "name": "all-ok"
            }]
        })).to.deep.equal({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "severity": "warn",
                "name": "all-ok"
            }]
        });
    });

    it("keeps the severity if it's a recognized one", () => {
        expect(normalizer({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "severity": "error",
                "name": "all-ok"
            }]
        })).to.deep.equal({
            "allowed": [{
                "from": ".+",
                "to": ".+",
                "severity": "error",
                "name": "all-ok"
            }]
        });
    });

    it("also works for 'forbidden' rules", () => {
        expect(normalizer({
            "forbidden": [{
                "from": ".+",
                "to": ".+",
                "severity": "error",
                "name": "all-ok",
                "comment": "this comment is kept"
            }]
        })).to.deep.equal({
            "forbidden": [{
                "from": ".+",
                "to": ".+",
                "severity": "error",
                "name": "all-ok",
                "comment": "this comment is kept"
            }]
        });
    });
});
