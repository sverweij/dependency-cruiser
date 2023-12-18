import { deepEqual, ok } from "node:assert/strict";
import extractKnownViolations from "#config-utl/extract-known-violations.mjs";

describe("[I] config-utl/extractKnownViolations", () => {
  const WORKINGDIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKINGDIR);
  });

  it("Throws when passed a non-existing file", async () => {
    let lError = "none";

    try {
      await extractKnownViolations("this_file_really_does_not_exist");
    } catch (pError) {
      lError = pError.toString();
    }
    ok(lError.includes(`ENOENT: no such file or directory, open`));
    ok(lError.includes("this_file_really_does_not_exist"));
  });

  it("Throws a SyntaxError when passed non-json", async () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");

    let lError = "none";

    try {
      await extractKnownViolations("this-is-no-json.txt");
    } catch (pError) {
      lError = pError;
    }

    ok(lError instanceof SyntaxError);
  });

  it("Return the parsed json content of the violations file", async () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");
    deepEqual(await extractKnownViolations("known-violations.json"), [
      {
        from: "src/schema/baseline-violations.schema.js",
        to: "src/schema/baseline-violations.schema.js",
        rule: {
          severity: "error",
          name: "not-unreachable-from-cli",
        },
      },
      {
        from: "src/cli/format.js",
        to: "src/cli/format.js",
        rule: {
          severity: "info",
          name: "not-reachable-from-folder-index",
        },
      },
    ]);
  });

  it("Makes a forward compatible version of the known violations", async () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");
    deepEqual(
      await extractKnownViolations(
        "known-violations-with-cycles-in-old-format.json",
      ),
      [
        {
          type: "cycle",
          from: "tmp-errors/cycle-1.js",
          to: "tmp-errors/cycle-2.js",
          rule: {
            severity: "error",
            name: "no-circular",
          },
          cycle: [
            {
              name: "tmp-errors/cycle-2.js",
              dependencyTypes: [],
            },
            {
              name: "tmp-errors/cycle-3.js",
              dependencyTypes: [],
            },
            {
              name: "tmp-errors/cycle-4.js",
              dependencyTypes: [],
            },
            {
              name: "tmp-errors/cycle-1.js",
              dependencyTypes: [],
            },
          ],
        },
        {
          type: "module",
          from: "tmp-errors/mod.mts",
          to: "tmp-errors/mod.mts",
          rule: {
            severity: "error",
            name: "no-orphans",
          },
        },
        {
          type: "dependency",
          from: "tmp-errors/call-mod.mts",
          to: "./mod.mjs",
          rule: {
            severity: "error",
            name: "not-to-unresolvable",
          },
        },
      ],
    );
  });

  it("Leaves new format cycles alone", async () => {
    process.chdir("./test/config-utl/__mocks__/known-violations");
    deepEqual(
      await extractKnownViolations(
        "known-violations-with-cycles-in-new-format.json",
      ),
      [
        {
          type: "cycle",
          from: "tmp-errors/cycle-1.js",
          to: "tmp-errors/cycle-2.js",
          rule: {
            severity: "error",
            name: "no-circular",
          },
          cycle: [
            {
              name: "tmp-errors/cycle-2.js",
              dependencyTypes: ["local", "require"],
            },
            {
              name: "tmp-errors/cycle-3.js",
              dependencyTypes: ["local", "require"],
            },
            {
              name: "tmp-errors/cycle-4.js",
              dependencyTypes: ["local", "require"],
            },
            {
              name: "tmp-errors/cycle-1.js",
              dependencyTypes: ["local", "require"],
            },
          ],
        },
        {
          type: "module",
          from: "tmp-errors/mod.mts",
          to: "tmp-errors/mod.mts",
          rule: {
            severity: "error",
            name: "no-orphans",
          },
        },
        {
          type: "dependency",
          from: "tmp-errors/call-mod.mts",
          to: "./mod.mjs",
          rule: {
            severity: "error",
            name: "not-to-unresolvable",
          },
        },
      ],
    );
  });
});
