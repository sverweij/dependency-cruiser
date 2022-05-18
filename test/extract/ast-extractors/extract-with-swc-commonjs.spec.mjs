import { expect } from "chai";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - regular commonjs require", () => {
  it("extracts require of a module that uses an export-equals'", () => {
    expect(
      extractWithSwc(
        "import thing = require('./thing-that-uses-export-equals');"
      )
    ).to.deep.equal([
      {
        module: "./thing-that-uses-export-equals",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts regular require as a const, let or var", () => {
    expect(
      extractWithSwc(
        `const lala1 = require('legit-one');
                 let lala2 = require('legit-two');
                 var lala3 = require('legit-three');`
      )
    ).to.deep.equal([
      {
        module: "legit-one",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
      {
        module: "legit-two",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
      {
        module: "legit-three",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts regular requires that are not on the top level in the AST", () => {
    expect(
      extractWithSwc(
        `function f(x) {
                    if(x > 0) {
                        return require('midash')
                    } else {
                        const hi = require('slodash').splut();
                        for (i=0;i<10;i++) {
                            if (hi(i)) {
                                return require('hidash');
                            }
                        }
                    }
                }`
      )
    ).to.deep.equal([
      {
        module: "midash",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
      {
        module: "slodash",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
      {
        module: "hidash",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts regular require with a template string without placeholders", () => {
    expect(
      extractWithSwc("const lala = require(`thunderscore`)")
    ).to.deep.equal([
      {
        module: "thunderscore",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("ignores regular require without parameters", () => {
    expect(extractWithSwc("const lala = require()")).to.deep.equal([]);
  });

  it("ignores regular require with a non-string argument", () => {
    expect(extractWithSwc("const lala = require(666)")).to.deep.equal([]);
  });

  it("ignores regular require with a template literal with placeholders", () => {
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      extractWithSwc("const lala = require(`shwoooop/${blabla}`)")
    ).to.deep.equal([]);
  });

  it("ignores regular require with a function for a parameter", () => {
    expect(extractWithSwc("const lala = require(helvete())")).to.deep.equal([]);
  });
});
