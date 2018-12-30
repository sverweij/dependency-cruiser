const expect = require('chai').expect;
const dependencyEndsUpAtFrom = require('../../../../src/extract/derive/circular/dependencyEndsUpAtFrom');

const A_B = [{
    "source": "a",
    "dependencies":[{"resolved":"b"}]
}, {
    "source": "b",
    "dependencies":[]
}];

const C_C = [{
    "source": "c",
    "dependencies":[{"resolved":"c"}]
}];

const D_E_D = [{
    "source": "d",
    "dependencies":[{"resolved":"d"}]
}, {
    "source": "e",
    "dependencies":[{"resolved":"d"}]
}];

const Q_R_S_Q = [{
    "source": "q",
    "dependencies":[{"resolved":"r"}]
}, {
    "source": "r",
    "dependencies":[{"resolved":"s"}]
}, {
    "source": "s",
    "dependencies":[{"resolved":"q"}]
}];

const T_U_T_V = [{
    "source": "t",
    "dependencies":[{"resolved":"u"}, {"resolved":"v"}]
}, {
    "source": "u",
    "dependencies":[{"resolved":"t"}]
}, {
    "source": "v",
    "dependencies":[]
}];

const TWO_CIRCLES = [{
    "source": "a",
    "dependencies":[{"resolved":"b"}, {"resolved": "d"}]
}, {
    "source": "b",
    "dependencies":[{"resolved":"c"}]
}, {
    "source": "c",
    "dependencies":[{"resolved":"a"}]
}, {
    "source": "d",
    "dependencies":[{"resolved":"e"}]
}, {
    "source": "e",
    "dependencies":[{"resolved":"a"}]
}];
const TO_A_CIRCLE = [{
    "source": "z",
    "dependencies":[{"resolved":"a"}]
}, {
    "source": "a",
    "dependencies":[{"resolved":"b"}]
}, {
    "source": "b",
    "dependencies":[{"resolved":"c"}]
}, {
    "source": "c",
    "dependencies":[{"resolved":"a"}]
}];
const TO_A_CIRCLE_AND_IN_IT = [{
    "source": "z",
    "dependencies":[{"resolved":"a"}]
}, {
    "source": "a",
    "dependencies":[{"resolved":"b"}]
}, {
    "source": "b",
    "dependencies":[{"resolved":"c"}]
}, {
    "source": "c",
    "dependencies":[{"resolved":"a"}, {"resolved":"z"}]
}];

describe("dependencyEndsUpAtFrom", () => {
    it("leaves non circular dependencies alone", () => {
        expect(dependencyEndsUpAtFrom(A_B, "a", "b")).to.equal(false);
    });
    it("detects self circular (c <-> c)", () => {
        expect(dependencyEndsUpAtFrom(C_C, "c", "c")).to.equal(true);
    });
    it("detects 1 step circular (d <-> e)", () => {
        expect(dependencyEndsUpAtFrom(D_E_D, "d", "e")).to.equal(true);
    });
    it("detects 2 step circular (a -> b -> c -> a)", () => {
        expect(dependencyEndsUpAtFrom(Q_R_S_Q, "q", "r")).to.equal(true);
        expect(dependencyEndsUpAtFrom(Q_R_S_Q, "r", "s")).to.equal(true);
        expect(dependencyEndsUpAtFrom(Q_R_S_Q, "s", "q")).to.equal(true);
    });
    it("does not get confused because another circular (a -> b -> a, a -> c)", () => {
        expect(dependencyEndsUpAtFrom(T_U_T_V, "t", "u")).to.equal(true);
        expect(dependencyEndsUpAtFrom(T_U_T_V, "t", "v")).to.equal(false);
    });
    it("detects two circles (a -> b -> c -> a, a -> d -> e -> a)", () => {
        expect(dependencyEndsUpAtFrom(TWO_CIRCLES, "a", "b")).to.equal(true);
        expect(dependencyEndsUpAtFrom(TWO_CIRCLES, "b", "c")).to.equal(true);
        expect(dependencyEndsUpAtFrom(TWO_CIRCLES, "c", "a")).to.equal(true);
        expect(dependencyEndsUpAtFrom(TWO_CIRCLES, "a", "d")).to.equal(true);
        expect(dependencyEndsUpAtFrom(TWO_CIRCLES, "d", "e")).to.equal(true);
        expect(dependencyEndsUpAtFrom(TWO_CIRCLES, "e", "a")).to.equal(true);
    });
    it("it goes to a circle but isn't in it itself (z -> a -> b -> c -> a)", () => {
        expect(dependencyEndsUpAtFrom(TO_A_CIRCLE, "z", "a")).to.equal(false);
    });
    it("it goes to a circle; isn't in it itself, but also to one where it is (z -> a -> b -> c -> a, c -> y)", () => {
        expect(dependencyEndsUpAtFrom(TO_A_CIRCLE_AND_IN_IT, "z", "a")).to.equal(true);
    });
});
