import { expect } from "chai";
import extractES6Deps from "../../../src/extract/ast-extractors/extract-es6-deps.mjs";
import { getASTFromSource } from "../../../src/extract/parse/to-javascript-ast.mjs";

const extractES6 = (pJavaScriptSource, pDependencies, pExtension = ".js") =>
  extractES6Deps(
    getASTFromSource({ source: pJavaScriptSource, extension: pExtension }),
    pDependencies
  );

describe("[U] ast-extractors/extract-ES6-deps", () => {
  it("dynamic imports of strings", () => {
    let lDeps = [];

    extractES6("import('./dynamic').then(pModule => pModule.x);", lDeps);
    expect(lDeps).to.deep.equal([
      {
        module: "./dynamic",
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      },
    ]);
  });

  it("dynamic imports of a template literal without placeholders yields an import", () => {
    let lDeps = [];

    extractES6("import(`./dynamic`).then(pModule => pModule.x);", lDeps);
    expect(lDeps).to.deep.equal([
      {
        module: "./dynamic",
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      },
    ]);
  });

  it("dynamic imports of a template literal with placeholders doesn't yield an import", () => {
    let lDeps = [];

    extractES6(
      // eslint-disable-next-line no-template-curly-in-string
      "import(`./dynamic/${enhop}`).then(pModule => pModule.x);",
      lDeps
    );
    expect(lDeps).to.deep.equal([]);
  });

  it("yield a dynamic import yields an import", () => {
    let lDeps = [];
    const lYieldImport = `function* a() {
            yield import('http');
        }`;

    extractES6(lYieldImport, lDeps);
    expect(lDeps).to.deep.equal([
      {
        module: "http",
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      },
    ]);
  });

  it("dynamic imports of a number doesn't yield an import", () => {
    let lDeps = [];

    extractES6("import(42).then(pModule => pModule.x);", lDeps);
    expect(lDeps).to.deep.equal([]);
  });

  it("dynamic imports of a function call doesn't yield an import", () => {
    let lDeps = [];

    extractES6(
      `
            determineWhatToImport = () => 'bla';
            import(determineWhatToImport()).then(pModule => pModule.x);
        `,
      lDeps
    );
    expect(lDeps).to.deep.equal([]);
  });

  it("doesn't get confused about import keywords in jsx components", () => {
    let lDependencies = [];
    const lInput = `import React from 'react';

    export const ReplicateIssueComponent = props => {
      return (
        <>
        This usage of the word import doesn't get detected as dependency
        </>
      );
    }`;

    extractES6(lInput, lDependencies, ".jsx");
    expect(lDependencies).to.deep.equal([
      {
        module: "react",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("does a.t.m. NOT handle certain ways of jsx notation correctly", () => {
    let lDependencies = [];
    const lInput = `import React from 'react';

export class ReplicateIssueComponent extends React.Component {
  renderSomethingElse = () => {
    return (
      <>The word import here still triggers the not-to-unresolvable error</>
    );
  };

  render = () => (
    <>
      {this.renderSomethingElse()}
      This usage of the word import in this string does no longer trigger the
      not-to-unresolvable error (at version 9.17.1-beta-1)
    </>
  );
}`;
    extractES6(lInput, lDependencies, ".jsx");
    expect(lDependencies).to.deep.equal([
      {
        module: "react",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
      {
        module: "✖",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
      {
        module: "✖",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });
});
