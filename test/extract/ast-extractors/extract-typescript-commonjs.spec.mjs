import { expect } from "chai";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - regular commonjs require", () => {
  it("extracts require of a module that uses an export-equals'", () => {
    expect(
      extractTypescript(
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
      extractTypescript(
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
      extractTypescript(
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
      extractTypescript("const lala = require(`thunderscore`)")
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
    expect(extractTypescript("const lala = require()")).to.deep.equal([]);
  });

  it("ignores regular require with a non-string argument", () => {
    expect(extractTypescript("const lala = require(666)")).to.deep.equal([]);
  });

  it("ignores regular require with a template literal with placeholders", () => {
    expect(
      // eslint-disable-next-line no-template-curly-in-string
      extractTypescript("const lala = require(`shwoooop/${blabla}`)")
    ).to.deep.equal([]);
  });

  it("ignores regular require with a function for a parameter", () => {
    expect(extractTypescript("const lala = require(helvete())")).to.deep.equal(
      []
    );
  });
});
