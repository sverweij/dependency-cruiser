import { deepEqual } from "node:assert/strict";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - regular commonjs require", () => {
  it("extracts require of a module that uses an export-equals'", () => {
    deepEqual(
      extractWithSwc(
        "import thing = require('./thing-that-uses-export-equals');",
      ),
      [
        {
          module: "./thing-that-uses-export-equals",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts regular require as a const, let or var", () => {
    deepEqual(
      extractWithSwc(
        `const lala1 = require('legit-one');
                 let lala2 = require('legit-two');
                 var lala3 = require('legit-three');`,
      ),
      [
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
      ],
    );
  });

  it("extracts regular requires that are not on the top level in the AST", () => {
    deepEqual(
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
                }`,
      ),
      [
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
      ],
    );
  });

  it("extracts regular require with a template string without placeholders", () => {
    deepEqual(extractWithSwc("const lala = require(`thunderscore`)"), [
      {
        module: "thunderscore",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("ignores regular require without parameters", () => {
    deepEqual(extractWithSwc("const lala = require()"), []);
  });

  it("ignores regular require with a non-string argument", () => {
    deepEqual(extractWithSwc("const lala = require(666)"), []);
  });

  it("ignores regular require with a template literal with placeholders", () => {
    deepEqual(
      // eslint-disable-next-line no-template-curly-in-string
      extractWithSwc("const lala = require(`shwoooop/${blabla}`)"),
      [],
    );
  });

  it("ignores regular require with a function for a parameter", () => {
    deepEqual(extractWithSwc("const lala = require(helvete())"), []);
  });
});
