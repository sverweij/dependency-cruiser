import { expect } from "chai";
import summarize from "../../src/enrich/summarize/summarize-modules.js";

describe("enrich/summarize-modules - summarize extraction", () => {
  it("empty", () => {
    const lResult = summarize([]);

    expect(lResult).to.deep.equal({
      violations: [],
      info: 0,
      warn: 0,
      error: 0,
      totalDependenciesCruised: 0,
      totalCruised: 0,
    });
  });

  it("single source - no violations", () => {
    const lResult = summarize([
      {
        source: "violationless.js",
        dependencies: [],
        valid: true,
      },
    ]);

    expect(lResult).to.deep.equal({
      violations: [],
      info: 0,
      warn: 0,
      error: 0,
      totalDependenciesCruised: 0,
      totalCruised: 1,
    });
  });

  it("single source - one module level violation", () => {
    const lResult = summarize([
      {
        source: "violation.js",
        dependencies: [],
        valid: false,
        rules: [
          {
            name: "a-rule",
            severity: "warn",
          },
        ],
      },
    ]);

    expect(lResult).to.deep.equal({
      violations: [
        {
          from: "violation.js",
          to: "violation.js",
          rule: {
            name: "a-rule",
            severity: "warn",
          },
        },
      ],
      info: 0,
      warn: 1,
      error: 0,
      totalDependenciesCruised: 0,
      totalCruised: 1,
    });
  });

  it("single source - one module level violation ('reaches')", () => {
    const lResult = summarize(
      [
        {
          source: "violation.js",
          dependencies: [
            {
              resolved: "via.js",
            },
          ],
          reaches: [
            {
              asDefinedInRule: "a-rule",
              modules: [
                {
                  source: "dont-touch-this.js",
                  via: ["via", "romana"],
                },
                {
                  source: "mc-hammer.js",
                  via: ["directly"],
                },
              ],
            },
          ],
          valid: false,
          rules: [
            {
              name: "a-rule",
              severity: "warn",
            },
          ],
        },
      ],
      { forbidden: [{ name: "a-rule", from: {}, to: { reachable: true } }] }
    );

    expect(lResult).to.deep.equal({
      violations: [
        {
          from: "violation.js",
          to: "dont-touch-this.js",
          rule: {
            name: "a-rule",
            severity: "warn",
          },
          via: ["via", "romana"],
        },
        {
          from: "violation.js",
          to: "mc-hammer.js",
          rule: {
            name: "a-rule",
            severity: "warn",
          },
          via: ["directly"],
        },
      ],
      info: 0,
      warn: 2,
      error: 0,
      totalDependenciesCruised: 1,
      totalCruised: 1,
    });
  });

  it("two dependent sources - no violations", () => {
    const lResult = summarize([
      {
        source: "violationless.js",
        dependencies: [
          {
            module: "bolderdash",
            resolved: "bolderdash",
            moduleSystem: "amd",
            coreModule: false,
            dependencyTypes: ["unknown"],
            license: "MIT",
            followable: false,
            matchesDoNotFollow: false,
            couldNotResolve: true,
            valid: true,
          },
        ],
        valid: true,
      },
      {
        source: "bolderdash",
        followable: false,
        matchesDoNotFollow: false,
        coreModule: false,
        couldNotResolve: true,
        dependencyTypes: ["unknown"],
        dependencies: [],
        valid: true,
      },
    ]);

    expect(lResult).to.deep.equal({
      violations: [],
      info: 0,
      warn: 0,
      error: 0,
      totalDependenciesCruised: 1,
      totalCruised: 2,
    });
  });

  it("two dependent sources - module and dependency violations", () => {
    const lResult = summarize([
      {
        source: "violation.js",
        dependencies: [
          {
            module: "bolderdash",
            resolved: "bolderdash",
            moduleSystem: "amd",
            coreModule: false,
            dependencyTypes: ["unknown"],
            license: "MIT",
            followable: false,
            matchesDoNotFollow: false,
            couldNotResolve: true,
            valid: false,
            rules: [
              {
                name: "a-dependency-rule",
                severity: "error",
              },
            ],
          },
        ],
        valid: false,
        rules: [
          {
            name: "a-module-rule",
            severity: "info",
          },
        ],
      },
      {
        source: "bolderdash",
        followable: false,
        matchesDoNotFollow: false,
        coreModule: false,
        couldNotResolve: true,
        dependencyTypes: ["unknown"],
        dependencies: [],
        valid: true,
      },
    ]);

    // also: sorted on from, to
    expect(lResult).to.deep.equal({
      violations: [
        {
          from: "violation.js",
          to: "bolderdash",
          rule: {
            name: "a-dependency-rule",
            severity: "error",
          },
        },
        {
          from: "violation.js",
          to: "violation.js",
          rule: {
            name: "a-module-rule",
            severity: "info",
          },
        },
      ],
      info: 1,
      warn: 0,
      error: 1,
      totalDependenciesCruised: 1,
      totalCruised: 2,
    });
  });
});
