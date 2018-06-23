"use strict";

const expect    = require("chai").expect;
const determine = require("../../../src/extract/resolve/determineDependencyTypes");

describe("determine dependencyTypes", () => {
    it("sorts local dependencies into 'local'", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "src/bla/localthing"
                },
                "./localthing"
            )
        ).to.deep.equal(["local"]);
    });

    it("sorts core modules into 'core'", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "fs"
                },
                "fs"
            )
        ).to.deep.equal(["core"]);
    });

    it("sorts unresolvable modules into 'unknown'", () => {
        expect(
            determine(
                {
                    couldNotResolve: true,
                    resolved: "unresolvable-thing"
                },
                "unresolvable-thing"
            )
        ).to.deep.equal(["unknown"]);
    });

    it("sorts node_modules into 'npm-unknown' when no package dependencies were supplied", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/main/index/js"
                },
                "cool-module"
            )
        ).to.deep.equal(["npm-unknown"]);
    });

    it("sorts node_modules into 'npm-no-pkg' when they're not in the supplied package dependencies", () => {
        expect(
            determine(
                {
                    module: "cool-module",
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/main/index.js"
                },
                "cool-module",
                {}
            )
        ).to.deep.equal(["npm-no-pkg"]);
    });

    it("sorts node_modules into 'npm' when they're in the supplied package dependencies", () => {
        expect(
            determine(
                {
                    module: "cool-module",
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/main/index.js"
                },
                "cool-module",
                {
                    dependencies: {
                        "cool-module": "1.2.3"
                    }
                }
            )
        ).to.deep.equal(["npm"]);
    });

    it("sorts node_modules into 'npm-dev' when they're in the supplied package devDependencies", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/main/index.js"
                },
                "cool-module",
                {
                    devDependencies: {
                        "cool-module": "1.2.3"
                    }
                }
            )
        ).to.deep.equal(["npm-dev"]);
    });

    it("sorts node_modules into 'npm' and 'npm-dev' when they're both the deps and the devDeps", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/main/index.js"
                },
                "cool-module",
                {
                    dependencies: {
                        "cool-module": "1.2.3"
                    },
                    devDependencies: {
                        "cool-module": "1.2.3"
                    }
                }
            )
        ).to.deep.equal(["npm", "npm-dev"]);
    });

    it("only sorts up to the first / ", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/wappie.js"
                },
                "cool-module/wappie",
                {
                    dependencies: {
                        "cool-module": "1.2.3"
                    },
                    devDependencies: {
                        "cool-module/wappie": "1.2.3"
                    }
                }
            )
        ).to.deep.equal(["npm"]);
    });


    it("sorts node_modules into 'npm-no-pkg' when they're in a weird *Dependencies in the package.json", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "node_modules/cool-module/main/index.js"
                },
                "cool-module",
                {
                    vagueDependencies: {
                        "cool-module": "1.2.3"
                    }
                }
            )
        ).to.deep.equal(["npm-no-pkg"]);
    });

    it("classifies aliased modules as aliased", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "src/wappie.js"
                },
                "@wappie",
                {},
                null,
                {
                    alias: {
                        "@": "src"
                    }
                }
            )
        ).to.deep.equal(["aliased"]);
    });

    it("has a fallback for weirdistan situations", () => {
        expect(
            determine(
                {
                    couldNotResolve: false,
                    resolved: "wappie.js"
                },
                "cool-module",
                {
                    cerebralDependencies: {
                        "cool-module": "1.2.3"
                    }
                }
            )
        ).to.deep.equal(["undetermined"]);
    });

});
