import { deepEqual, ok } from "node:assert/strict";
import cycleStartsOnOne from "./__mocks__/cycle-starts-on-one.mjs";
import cycleStartsOnTwo from "./__mocks__/cycle-starts-on-two.mjs";
import cycleFest from "./__mocks__/cycle-fest.mjs";
import { validate as validateCruiseResult } from "#schema/cruise-result.validate.mjs";
import summarize from "#analyze/summarize/index.mjs";

const DUMMY_ENVIRONMENT = {
  version: "481",
  nodeVersionSupported: "^42",
  nodeVersionFound: "42.1.2",
  osVersionFound: `riscv pinecil@1.2.3`,
  transpilersFound: [],
  extensionsFound: [],
};

function getFakeEnvironmentInfo() {
  return DUMMY_ENVIRONMENT;
}
function getFakeEnvironmentInfoWithTypeScriptFound() {
  return {
    ...DUMMY_ENVIRONMENT,
    transpilersFound: [
      {
        name: "typescript",
        available: true,
        version: ">=2.0.0 <7.0.0",
        currentVersion: "3.4.5",
      },
    ],
  };
}

function getFakeEnvironmentInfoWithSWCNotFound() {
  return {
    ...DUMMY_ENVIRONMENT,
    transpilersFound: [
      {
        name: "swc",
        available: false,
        version: ">=1.0.0 <2.0.0",
        currentVersion: "-",
      },
    ],
  };
}

function getFakeEnvironmentInfoWithSWCFound() {
  return {
    ...DUMMY_ENVIRONMENT,
    transpilersFound: [
      {
        name: "swc",
        available: true,
        version: ">=1.0.0 <2.0.0",
        currentVersion: "@swc/core@1.15.43",
      },
    ],
  };
}
function getFakeEnvironmentInfoWithTypeScriptNotFound() {
  return {
    ...DUMMY_ENVIRONMENT,
    transpilersFound: [
      {
        name: "typescript",
        available: false,
        version: ">=2.0.0 <7.0.0",
        currentVersion: "-",
      },
    ],
  };
}
function getFakeEnvironmentInfoWithBabelFound() {
  return {
    ...DUMMY_ENVIRONMENT,
    transpilersFound: [
      {
        name: "babel",
        available: true,
        version: ">=7.0.0 <9.0.0",
        currentVersion: "@babel/core@8.9.10",
      },
    ],
  };
}
function getFakeEnvironmentInfoWithBabelNotFound() {
  return {
    ...DUMMY_ENVIRONMENT,
    transpilersFound: [
      {
        name: "babel",
        available: false,
        version: ">=7.0.0 <9.0.0",
        currentVersion: "-",
      },
    ],
  };
}

describe("[I] analyze/summarize", () => {
  it("doesn't add a rule set when there isn't one", () => {
    const lSummary = summarize([], {}, [], [], getFakeEnvironmentInfo);
    deepEqual(lSummary, {
      error: 0,
      info: 0,
      ignore: 0,
      optionsUsed: {
        args: "",
      },
      totalCruised: 0,
      totalDependenciesCruised: 0,
      violations: [],
      warn: 0,
      environment: DUMMY_ENVIRONMENT,
    });
    validateCruiseResult({ modules: [], summary: lSummary });
  });
  it("adds a rule set when there is one", () => {
    const lSummary = summarize(
      [],
      { ruleSet: { required: [] } },
      [],
      [],
      getFakeEnvironmentInfo,
    );
    deepEqual(lSummary, {
      error: 0,
      info: 0,
      ignore: 0,
      optionsUsed: {
        args: "",
      },
      ruleSetUsed: {
        required: [],
      },
      totalCruised: 0,
      totalDependenciesCruised: 0,
      violations: [],
      warn: 0,
      environment: DUMMY_ENVIRONMENT,
    });
    validateCruiseResult({ modules: [], summary: lSummary });
  });

  it("consistently summarizes the same circular dependency, regardless the order", () => {
    const lOptions = {
      ruleSet: {
        forbidden: [
          {
            name: "no-circular",
            severity: "warn",
            from: {},
            to: {
              circular: true,
            },
          },
        ],
      },
    };
    const lResult1 = summarize(
      cycleStartsOnOne,
      lOptions,
      ["src"],
      [],
      getFakeEnvironmentInfo,
    );
    const lResult2 = summarize(
      cycleStartsOnTwo,
      lOptions,
      ["src"],
      [],
      getFakeEnvironmentInfo,
    );

    deepEqual(lResult1, lResult2);
    validateCruiseResult({ modules: [], summary: lResult1 });
  });

  it("summarizes all circular dependencies, even when there's more per thingus", () => {
    const lOptions = {
      ruleSet: {
        forbidden: [
          {
            name: "no-circular",
            severity: "warn",
            from: {},
            to: {
              circular: true,
            },
          },
        ],
      },
    };
    const lExpected = {
      violations: [
        {
          type: "cycle",
          from: "src/brand.js",
          to: "src/domain.js",
          unresolvedTo: "./domain",
          dependencyTypes: ["local"],
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: [
            {
              name: "src/domain.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/market.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/brand.js",
              dependencyTypes: ["local"],
            },
          ],
        },
        {
          type: "cycle",
          from: "src/brand.js",
          to: "src/market.js",
          unresolvedTo: "./market",
          dependencyTypes: ["local"],
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: [
            {
              name: "src/market.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/brand.js",
              dependencyTypes: ["local"],
            },
          ],
        },
        {
          type: "cycle",
          from: "src/domain.js",
          to: "src/market.js",
          unresolvedTo: "./market",
          dependencyTypes: ["local"],
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: [
            {
              name: "src/market.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/domain.js",
              dependencyTypes: ["local"],
            },
          ],
        },
      ],
      error: 0,
      warn: 3,
      info: 0,
      ignore: 0,
      totalCruised: 3,
      totalDependenciesCruised: 5,
      optionsUsed: {
        args: "src",
      },
      ruleSetUsed: {
        forbidden: [
          {
            name: "no-circular",
            severity: "warn",
            from: {},
            to: {
              circular: true,
            },
          },
        ],
      },
      environment: DUMMY_ENVIRONMENT,
    };

    const lSummary = summarize(
      cycleFest,
      lOptions,
      ["src"],
      [],
      getFakeEnvironmentInfo,
    );
    deepEqual(lSummary, lExpected);
    validateCruiseResult({ modules: [], summary: lSummary });
  });

  it("includes known violations in the summary", () => {
    const lKnownViolations = [
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
    ];
    deepEqual(
      summarize(
        [],
        { knownViolations: lKnownViolations },
        [],
        [],
        getFakeEnvironmentInfo,
      ),
      {
        error: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {
          args: "",
          knownViolations: lKnownViolations,
        },
        totalCruised: 0,
        totalDependenciesCruised: 0,
        violations: [],
        warn: 0,
        environment: DUMMY_ENVIRONMENT,
      },
    );
  });

  it("doesn't include known violations key when none exist", () => {
    deepEqual(
      summarize([], { knownViolations: [] }, [], [], getFakeEnvironmentInfo),
      {
        error: 0,
        info: 0,
        ignore: 0,
        optionsUsed: {
          args: "",
        },
        totalCruised: 0,
        totalDependenciesCruised: 0,
        violations: [],
        warn: 0,
        environment: DUMMY_ENVIRONMENT,
      },
    );
  });

  it("violating something with moreUnstable & instabilities", () => {
    const lSummary = summarize(
      [
        {
          source: "violation.js",
          instability: 0.42,
          dependencies: [
            {
              resolved: "dont-touch-this.js",
              module: "dont-touch-this-but-unresolved.js",
              dependencyTypes: [],
              instability: 1,
              valid: false,
              rules: [
                {
                  name: "a-rule",
                  severity: "warn",
                },
              ],
            },
          ],
        },
      ],
      {
        ruleSet: {
          forbidden: [{ name: "a-rule", from: {}, to: { moreUnstable: true } }],
        },
      },
      [],
      [],
      getFakeEnvironmentInfo,
    );

    deepEqual(lSummary, {
      violations: [
        {
          type: "instability",
          from: "violation.js",
          to: "dont-touch-this.js",
          unresolvedTo: "dont-touch-this-but-unresolved.js",
          dependencyTypes: [],
          rule: {
            name: "a-rule",
            severity: "warn",
          },
          metrics: {
            from: {
              instability: 0.42,
            },
            to: {
              instability: 1,
            },
          },
        },
      ],
      info: 0,
      warn: 1,
      error: 0,
      ignore: 0,
      totalDependenciesCruised: 1,
      totalCruised: 1,
      optionsUsed: {
        args: "",
      },
      ruleSetUsed: {
        forbidden: [
          {
            from: {},
            name: "a-rule",
            to: {
              moreUnstable: true,
            },
          },
        ],
      },
      environment: DUMMY_ENVIRONMENT,
    });
    validateCruiseResult({ modules: [], summary: lSummary });
  });

  it("emits an issue into the 'environment' when a typescript transpiler is expected but missing (tsconfig)", () => {
    const lSummary = summarize(
      [],
      { tsConfig: { fileName: "./tsconfig.json" } },
      [],
      [],
      getFakeEnvironmentInfoWithTypeScriptNotFound,
    );
    ok(lSummary.environment.issues);
    ok(
      lSummary.environment.issues.some(
        (pIssue) => pIssue.name === "missing-typescript-transpiler",
      ),
    );
  });

  it("emits an issue into the 'environment' when a typescript transpiler is expected but missing (tsPrecompilationDeps)", () => {
    const lSummary = summarize(
      [],
      { tsPreCompilationDeps: true },
      [],
      [],
      getFakeEnvironmentInfoWithTypeScriptNotFound,
    );
    ok(lSummary.environment.issues);
    ok(
      lSummary.environment.issues.some(
        (pIssue) => pIssue.name === "missing-typescript-transpiler",
      ),
    );
  });

  it("emits an issue into the 'environment' when a typescript transpiler is expected but missing (detectJSDocImports)", () => {
    const lSummary = summarize(
      [],
      { detectJSDocImports: true },
      [],
      [],
      getFakeEnvironmentInfoWithTypeScriptNotFound,
    );
    ok(lSummary.environment.issues);
    ok(
      lSummary.environment.issues.some(
        (pIssue) => pIssue.name === "missing-typescript-transpiler",
      ),
    );
  });

  it("emits an issue into the 'environment' when a typescript transpiler is expected but missing (parser === 'tsc')", () => {
    const lSummary = summarize(
      [],
      { parser: "tsc" },
      [],
      [],
      getFakeEnvironmentInfoWithTypeScriptNotFound,
    );
    ok(lSummary.environment.issues);
    ok(
      lSummary.environment.issues.some(
        (pIssue) => pIssue.name === "missing-typescript-transpiler",
      ),
    );
  });

  it("emits an issue into the 'environment' when a typescript transpiler is expected but missing (parser === 'swc')", () => {
    const lSummary = summarize(
      [],
      { parser: "swc" },
      [],
      [],
      getFakeEnvironmentInfoWithSWCNotFound,
    );
    ok(lSummary.environment.issues);
    ok(
      lSummary.environment.issues.some(
        (pIssue) => pIssue.name === "missing-swc-transpiler",
      ),
    );
  });

  it("emits no 'environment' when swc is expected but missing (parser === 'swc')", () => {
    const lSummary = summarize(
      [],
      { parser: "swc" },
      [],
      [],
      getFakeEnvironmentInfoWithSWCFound,
    );
    ok(!Object.hasOwn(lSummary.environment, "issues"));
  });

  it("does not emit an issue into the 'environment' when a typescript transpiler is expected and not missing", () => {
    const lSummary = summarize(
      [],
      { tsConfig: { fileName: "./tsconfig.json" } },
      [],
      [],
      getFakeEnvironmentInfoWithTypeScriptFound,
    );

    ok(!Object.hasOwn(lSummary.environment, "issues"));
  });

  it("emits an issue into the 'environment' when a babel transpiler is expected but missing", () => {
    const lSummary = summarize(
      [],
      { babelConfig: { fileName: "./.babelrc" } },
      [],
      [],
      getFakeEnvironmentInfoWithBabelNotFound,
    );
    ok(lSummary.environment.issues);
    ok(
      lSummary.environment.issues.some(
        (pIssue) => pIssue.name === "missing-babel-transpiler",
      ),
    );
  });

  it("does not emit an issue into the 'environment' when a babel transpiler is expected and not missing", () => {
    const lSummary = summarize(
      [],
      { babelConfig: { fileName: "./.babelrc" } },
      [],
      [],
      getFakeEnvironmentInfoWithBabelFound,
    );

    ok(!Object.hasOwn(lSummary.environment, "issues"));
  });
});
