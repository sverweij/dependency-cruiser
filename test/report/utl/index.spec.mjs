import { deepEqual, equal } from "node:assert/strict";
import {
  formatDependencyTo,
  getOneLetterDependencyType,
  getURLForModule,
} from "#report/utl/index.mjs";

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

describe("[U] report/utl/index - getOneLetterDependencyType", () => {
  it("returns empty string when there's no dependency types", () => {
    equal(getOneLetterDependencyType(), "");
  });
  it("returns empty string when there's zero dependency types", () => {
    equal(getOneLetterDependencyType([]), "");
  });
  it("returns the empty string for unknown dependency types", () => {
    equal(getOneLetterDependencyType(["unknown"]), "");
  });
  it("returns 'n' for external dependencies", () => {
    equal(getOneLetterDependencyType(["npm-dev"]), "n");
  });
  it("returns '#' for subpath imports", () => {
    equal(
      getOneLetterDependencyType(["aliased", "aliased-subpath-import"]),
      "#",
    );
  });
  it("returns '@' for other alias types", () => {
    equal(
      getOneLetterDependencyType([
        "aliased",
        "aliased-tsconfig",
        "aliased-tsconfig-paths",
        "local",
      ]),
      "@",
    );
  });
  it("returns '.' for direct local imports", () => {
    equal(getOneLetterDependencyType(["local"]), ".");
  });
  it("returns 'x' for (re-)exports", () => {
    equal(getOneLetterDependencyType(["local", "export"]), "x");
  });
  it("returns 'c' for core dependencies", () => {
    equal(getOneLetterDependencyType(["core"]), "c");
  });
  it("returns 'T' for type-only imports", () => {
    equal(getOneLetterDependencyType(["type-only"]), "T");
  });
  it("returns 'T' for type-imports", () => {
    equal(getOneLetterDependencyType(["type-import"]), "T");
  });
});

describe("[U] report/utl/index - formatDependencyTo", () => {
  const lShowUnresolvedOptions = {
    showExternalModulesUnresolved: true,
    showAliasedModulesUnresolved: true,
  };
  it("returns the 'to' when there's no unresolvedTo", () => {
    equal(
      formatDependencyTo({
        from: "from",
        to: "to",
        dependencyTypes: ["npm"],
        rule: { severity: "info", name: "name" },
      }),
      "to",
    );
  });

  it("returns the 'to' when there's no unresolvedTo even though options indicate so", () => {
    equal(
      formatDependencyTo(
        {
          from: "from",
          to: "to",
          dependencyTypes: ["npm"],
          rule: { severity: "info", name: "name" },
        },
        lShowUnresolvedOptions,
      ),
      "to",
    );
  });
  it("returns the 'to' when there's an unresolvedTo and options indicate to not show it", () => {
    equal(
      formatDependencyTo(
        {
          from: "from",
          to: "to",
          unresolvedTo: "unresolvedTo",
          dependencyTypes: ["npm"],
          rule: { severity: "info", name: "name" },
        },
        {},
      ),
      "to",
    );
  });
  it("returns the 'to' when there's an unresolvedTo and options indicate to display them but it's not a dependency type that supports it (local module)", () => {
    equal(
      formatDependencyTo(
        {
          from: "from",
          to: "to",
          unresolvedTo: "unresolvedTo",
          dependencyTypes: ["local"],
          rule: { severity: "info", name: "name" },
        },
        lShowUnresolvedOptions,
      ),
      "to",
    );
  });
  it("returns the 'unresolvedTo' when there's an unresolvedTo and options indicate so (external module)", () => {
    equal(
      formatDependencyTo(
        {
          from: "from",
          to: "to",
          unresolvedTo: "unresolvedTo",
          dependencyTypes: ["npm"],
          rule: { severity: "info", name: "name" },
        },
        lShowUnresolvedOptions,
      ),
      "unresolvedTo",
    );
  });
  it("returns the 'unresolvedTo' when there's an unresolvedTo and options indicate so (aliased module)", () => {
    equal(
      formatDependencyTo(
        {
          from: "from",
          to: "to",
          unresolvedTo: "unresolvedTo",
          dependencyTypes: ["aliased"],
          rule: { severity: "info", name: "name" },
        },
        lShowUnresolvedOptions,
      ),
      "unresolvedTo",
    );
  });
});
