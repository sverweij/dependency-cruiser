import { expect } from "chai";
import {
  addRunScriptsToManifest,
  compileRunScripts,
} from "../../../src/cli/init-config/write-run-scripts-to-manifest.mjs";

describe("[U] cli/init-config/write-run-scripts-to-manifest - logic", () => {
  it("no manifest and no scripts retain the empty manifest with a scripts section", () => {
    expect(addRunScriptsToManifest()).to.deep.equal({ scripts: {} });
  });

  it("empty manifest and empty scripts object retain the empty manifest with a scripts section", () => {
    expect(addRunScriptsToManifest({}, {})).to.deep.equal({
      scripts: {},
    });
  });

  it("manifest with scripts and empty script object retain the original manifest", () => {
    expect(
      addRunScriptsToManifest({ scripts: { test: "jest" } }, {})
    ).to.deep.equal({ scripts: { test: "jest" } });
  });

  it("manifest with scripts and a new script appears in the new manifest", () => {
    expect(
      addRunScriptsToManifest(
        { scripts: { test: "jest" } },
        { depcruise: "depcruise src -v" }
      )
    ).to.deep.equal({
      scripts: { depcruise: "depcruise src -v", test: "jest" },
    });
  });

  it("manifest with scripts and a update script doesn't overwrite in the manifest", () => {
    expect(
      addRunScriptsToManifest(
        {
          scripts: {
            test: "jest",
            depcruise:
              "depcruise --config custom-cruiser-config.js --err-long bin src test",
          },
        },
        { depcruise: "depcruise src -v" }
      )
    ).to.deep.equal({
      scripts: {
        test: "jest",
        depcruise:
          "depcruise --config custom-cruiser-config.js --err-long bin src test",
      },
    });
  });
});

describe("[U] cli/init-config/write-run-scripts-to-manifest - compile run script", () => {
  it("no sourcelocation no extra scripts (no init options object)", () => {
    expect(compileRunScripts()).to.deep.equal({});
  });
  it("no sourcelocation no extra scripts (empty init options object)", () => {
    expect(compileRunScripts({}, [])).to.deep.equal({});
  });
  it("sourcelocation => bunch of extra scripts (empty init options object)", () => {
    const lRunScripts = compileRunScripts({ sourceLocation: ["src"] });
    expect(Object.keys(lRunScripts)).to.deep.equal([
      "depcruise",
      "depcruise:graph",
      "depcruise:graph:dev",
      "depcruise:graph:archi",
      "depcruise:html",
      "depcruise:text",
      "depcruise:focus",
    ]);
  });
});
