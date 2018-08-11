const path                    = require("path");
const expect                  = require("chai").expect;
const flattenTypeScriptConfig = require("../../src/cli/flattenTypeScriptConfig");

describe("flatten typescript config - simple config scenarios", () => {
    it("throws when no config file name is passed", () => {
        expect(() => flattenTypeScriptConfig()).to.throw();
    });

    it("throws when a non-existing config file is passed", () => {
        expect((() => flattenTypeScriptConfig("config-does-not-exist"))).to.throw();
    });

    it("throws when a config file is passed that does not contain valid json", () => {
        expect(
            () => flattenTypeScriptConfig(path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.invalid.json"))
        ).to.throw();
    });

    it("returns an empty object when an empty config file is passed", () => {
        expect(
            flattenTypeScriptConfig(path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.empty.json"))
        ).to.deep.equal({});
    });

    it("returns an empty object when an empty config file with comments is passed", () => {
        expect(
            flattenTypeScriptConfig(path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.withcomments.json"))
        ).to.deep.equal({});
    });

    it("returns an object with a bunch of options when when the default ('--init') config file is passed", () => {
        expect(
            flattenTypeScriptConfig(
                path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.asgeneratedbydefault.json")
            )
        ).to.deep.equal({
            compilerOptions: {
                esModuleInterop: true,
                module: "commonjs",
                strict: true,
                target: "es5"
            }
        });
    });
});

describe("flatten typescript config - 'extend' config scenarios", () => {
    it("throws when a config file is passed that contains a extends to a non-existing file", () => {
        expect(
            () => flattenTypeScriptConfig(
                path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.extendsnonexisting.json")
            )
        ).to.throw();
    });

    it("throws when a config file is passed that has a circular reference", () => {
        expect(
            () => flattenTypeScriptConfig(path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.circular.json"))
        ).to.throw("The provided typescript config setup has a circular reference.");
    });

    it("returns an empty object (even no 'extend') when a config with an extend to an empty base is passed", () => {
        expect(
            flattenTypeScriptConfig(path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.simpleextends.json"))
        ).to.deep.equal({});
    });

    it("returns an object with properties from base, extends & overrides from extends - non-compilerOptions", () => {
        expect(
            flattenTypeScriptConfig(
                path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.noncompileroptionsextends.json")
            )
        ).to.deep.equal({
            // from base:
            "compileOnSave": true,
            // only in the extends:
            "exclude": [
                "only in the extends"
            ],
            // overridden by extends:
            "include": [
                "override from extends here"
            ]
        });
    });

    it("returns an object with properties from base, extends & overrides from extends - compilerOptions", () => {
        expect(
            flattenTypeScriptConfig(
                path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.compileroptionsextends.json")
            )
        ).to.deep.equal({
            "compilerOptions": {
                // only in extends:
                allowJs: true,
                // overridden from base:
                allowUnreachableCode: false,
                // only in base:
                rootDirs: [
                    "foo", "bar", "baz"
                ]
            }
        });
    });

    it("returns an object with properties from base, extends compilerOptions.lib array", () => {
        expect(
            flattenTypeScriptConfig(
                path.join(__dirname, "./fixtures/typescriptconfig/tsconfig.compileroptionsextendslib.json")
            )
        ).to.deep.equal({
            "compilerOptions": {
                lib: [
                    "dom.iterable",
                    "es2016.array.include",
                    "dom"
                ]
            }
        });
    });

    // only compiler options in base
    // only compiler options in extends
});
