import { deepEqual } from "node:assert/strict";
import { getURLForModule } from "#report/utl/index.mjs";

describe("[I] report/utl/index - getURLForModule", () => {
  it("returns the correct URL for a core module", () => {
    const lModule = {
      source: "fs",
      dependencyTypes: ["core"],
    };
    const lExpectedURL = "https://nodejs.org/api/fs.html";
    deepEqual(getURLForModule(lModule), lExpectedURL);
  });

  it("returns the correct URL for a Bun core module", () => {
    const lModule = {
      source: "bun:test",
      dependencyTypes: ["core"],
    };
    const lExpectedURL = "https://bun.sh/docs/api/test";
    deepEqual(getURLForModule(lModule), lExpectedURL);
  });

  it("returns the correct URL for an external module", () => {
    const lModule = {
      source: "node_modules/semver/functions/satisfies.js",
      dependencyTypes: ["npm"],
    };
    const lExpectedURL = "https://www.npmjs.com/package/semver";
    deepEqual(getURLForModule(lModule), lExpectedURL);
  });

  it("returns the correct URL for a scoped external module", () => {
    const lModule = {
      source: "node_modules/@org/beep/index.js",
      dependencyTypes: ["npm"],
    };
    const lExpectedURL = "https://www.npmjs.com/package/@org/beep";
    deepEqual(getURLForModule(lModule), lExpectedURL);
  });

  it("if it's not in node_modules it's not finding the package name, even though it might be an 'npm' dependencyType", () => {
    const lModule = {
      source: "claude_modules/beep/index.js",
      dependencyTypes: ["npm"],
    };
    const lExpectedURL = "https://www.npmjs.com/package/";
    deepEqual(getURLForModule(lModule), lExpectedURL);
  });

  it("returns the correct URL with a prefix", () => {
    const lModule = {
      source: "src/index.js",
    };
    const lPrefix = "https://github.com/username/repo/blob/main/";
    const lExpectedURL =
      "https://github.com/username/repo/blob/main/src/index.js";
    deepEqual(getURLForModule(lModule, lPrefix), lExpectedURL);
  });

  it("returns an URL with prefix, filePath and suffix", () => {
    const lModule = {
      source: "src/index.js",
    };
    const lPrefix = "coverage/";
    const lSuffix = ".gcov.html";
    const lExpectedURL = "coverage/src/index.js.gcov.html";
    deepEqual(getURLForModule(lModule, lPrefix, lSuffix), lExpectedURL);
  });

  it("returns the source when no URL can be derived", () => {
    const lModule = {
      source: "src/index.js",
    };
    deepEqual(getURLForModule(lModule), lModule.source);
  });
});
