import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import {
  addRunScriptsToManifest,
  compileRunScripts,
} from "../../../src/cli/init-config/write-run-scripts-to-manifest.mjs";

describe("[U] cli/init-config/write-run-scripts-to-manifest - logic", () => {
  it("no manifest and no scripts retain the empty manifest with a scripts section", () => {
    deepStrictEqual(addRunScriptsToManifest(), { scripts: {} });
  });

  it("empty manifest and empty scripts object retain the empty manifest with a scripts section", () => {
    deepStrictEqual(addRunScriptsToManifest({}, {}), {
      scripts: {},
    });
  });

  it("manifest with scripts and empty script object retain the original manifest", () => {
    deepStrictEqual(
      addRunScriptsToManifest({ scripts: { test: "jest" } }, {}),
      { scripts: { test: "jest" } }
    );
  });

  it("manifest with scripts and a new script appears in the new manifest", () => {
    deepStrictEqual(
      addRunScriptsToManifest(
        { scripts: { test: "jest" } },
        { depcruise: "depcruise src -v" }
      ),
      {
        scripts: { depcruise: "depcruise src -v", test: "jest" },
      }
    );
  });

  it("manifest with scripts and a update script doesn't overwrite in the manifest", () => {
    deepStrictEqual(
      addRunScriptsToManifest(
        {
          scripts: {
            test: "jest",
            depcruise:
              "depcruise --config custom-cruiser-config.js --err-long bin src test",
          },
        },
        { depcruise: "depcruise src -v" }
      ),
      {
        scripts: {
          test: "jest",
          depcruise:
            "depcruise --config custom-cruiser-config.js --err-long bin src test",
        },
      }
    );
  });
});

describe("[U] cli/init-config/write-run-scripts-to-manifest - compile run script", () => {
  it("no sourcelocation no extra scripts (no init options object)", () => {
    deepStrictEqual(compileRunScripts(), {});
  });
  it("no sourcelocation no extra scripts (empty init options object)", () => {
    deepStrictEqual(compileRunScripts({}, []), {});
  });
  it("sourcelocation => bunch of extra scripts (empty init options object)", () => {
    const lRunScripts = compileRunScripts({ sourceLocation: ["src"] });
    deepStrictEqual(Object.keys(lRunScripts), [
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
