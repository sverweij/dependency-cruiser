import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - jsdoc 'bracket' imports", () => {
  it("extracts @type whole module", () => {
    deepEqual(
      extractTypescript(
        "/** @type {import('./hello.mjs')} */ export default {};",
        [],
        true,
      ),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });

  it("extracts @type one type from a module", () => {
    deepEqual(
      extractTypescript("/** @type {import('./hello.mjs').thing} */", [], true),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });

  it("extracts @typedef whole module", () => {
    deepEqual(
      extractTypescript(
        "/** @typedef {import('./hello.mjs')} Hello */ ",
        [],
        true,
      ),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });
  //         * @returns {import('./goodby.mjs).wave} A goodbye
  it("extracts @param & @returns for a function definitions", () => {
    deepEqual(
      extractTypescript(
        `/**
        * This function says hello and goodbye
        * 
        * @param {import('./hello.mjs')} pHello a hello
        * @returns {import('./goodbye.mjs').waveyWavey} A goodbye
        */
       function findGoodbyeForGreeting(pHello) {
        return Goodbyes[pHello];
      }`,
        [],
        true,
      ),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
        {
          module: "./goodbye.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });

  /* eslint mocha/no-skipped-tests: "off" */
  xit("extracts @type whole module even when wrapped in type shenanigans (Partial)", () => {
    deepEqual(
      extractTypescript(
        "/** @type {Partial<import('./hello.mjs')>} */",
        [],
        true,
      ),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });
  xit("extracts @type whole module even when wrapped in type shenanigans (Map)", () => {
    deepEqual(
      extractTypescript(
        "/** @type {Map<string,import('./hello.mjs')>} */",
        [],
        true,
      ),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });
  xit("extracts @type whole module even when wrapped in type shenanigans (Map & Parital)", () => {
    deepEqual(
      extractTypescript(
        "/** @type {string, Partial<import('./hello.mjs')>} */",
        [],
        true,
      ),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: [
            "type-only",
            "import",
            "jsdoc",
            "jsdoc-bracket-import",
          ],
        },
      ],
    );
  });

  it("leaves @type things alone that are not imports (but that look a bit like them)", () => {
    deepEqual(
      extractTypescript(
        "/** @type {notAnImport('./hello.mjs').thing} */",
        [],
        true,
      ),
      [],
    );
  });
  it("leaves @type things alone that is empty", () => {
    deepEqual(extractTypescript("/** @type } */", [], true), []);
  });
});
