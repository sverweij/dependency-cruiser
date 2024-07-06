import { doesNotThrow, equal, throws } from "node:assert/strict";
import { deepEqual } from "node:assert";
import { assertCruiseOptionsValid } from "#main/options/assert-validity.mjs";

describe("[U] main/options/validate - module systems", () => {
  it("throws when a invalid module system is passed ", () => {
    throws(() => {
      assertCruiseOptionsValid({
        moduleSystems: ["notavalidmodulesystem"],
      });
    }, /Invalid module system list: 'notavalidmodulesystem'/);
  });

  it("passes when a valid module system is passed", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ moduleSystems: ["cjs"] });
    });
  });
});

describe("[U] main/options/validate - output types", () => {
  it("throws when a invalid output type is passed ", () => {
    throws(() => {
      assertCruiseOptionsValid({ outputType: "notAValidOutputType" });
    }, /'notAValidOutputType' is not a valid output type\./);
  });

  it("passes when a valid output type is passed", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ outputType: "err" });
    });
  });
});

describe("[U] main/options/validate - maxDepth", () => {
  it("throws when a non-integer is passed as maxDepth", () => {
    throws(() => {
      assertCruiseOptionsValid({ maxDepth: "not an integer" });
    }, /'not an integer' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed as maxDepth (string)", () => {
    throws(() => {
      assertCruiseOptionsValid({ maxDepth: "101" });
    }, /'101' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed as maxDepth (number)", () => {
    throws(() => {
      assertCruiseOptionsValid({ maxDepth: 101 });
    }, /'101' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed as maxDepth (string)", () => {
    throws(() => {
      assertCruiseOptionsValid({ maxDepth: "-1" });
    }, /'-1' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed as maxDepth (number)", () => {
    throws(() => {
      assertCruiseOptionsValid({ maxDepth: -1 });
    }, /'-1' is not a valid depth - use an integer between 0 and 99/);
  });

  it("passes when a valid depth is passed as maxDepth (string)", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ maxDepth: "42" });
    });
  });

  it("passes when a valid depth is passed as maxDepth (number)", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ maxDepth: 42 });
    });
  });
});

describe("[U] main/options/validate - focusDepth", () => {
  it("throws when a non-integer is passed", () => {
    throws(() => {
      assertCruiseOptionsValid({ focusDepth: "not an integer" });
    }, /'not an integer' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed (string)", () => {
    throws(() => {
      assertCruiseOptionsValid({ focusDepth: "101" });
    }, /'101' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed as maxDepth (number)", () => {
    throws(() => {
      assertCruiseOptionsValid({ focusDepth: 101 });
    }, /'101' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed (string)", () => {
    throws(() => {
      assertCruiseOptionsValid({ focusDepth: "-1" });
    }, /'-1' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed (number)", () => {
    throws(() => {
      assertCruiseOptionsValid({ focusDepth: -1 });
    }, /'-1' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("passes when a valid depth is passed (string)", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ focusDepth: "42" });
    });
  });

  it("passes when a valid depth is passed (number)", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ focusDepth: 42 });
    });
  });
});

describe("[U] main/options/validate - exclude", () => {
  it("throws when --exclude is passed an unsafe regex", () => {
    throws(() => {
      assertCruiseOptionsValid({ exclude: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("throws when exclude.path is passed an unsafe regex", () => {
    throws(() => {
      assertCruiseOptionsValid({ exclude: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("throws when exclude.pathNot is passed an unsafe regex", () => {
    throws(() => {
      assertCruiseOptionsValid({ exclude: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("throws when doNotFollow.pathNot is passed an unsafe regex", () => {
    throws(() => {
      assertCruiseOptionsValid({ doNotFollow: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("passes when --exclude is passed a safe regex", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({ exclude: "([A-Za-z]+)" });
    });
  });

  it("passes when --validate is passed a safe regex in rule-set.exclude", () => {
    doesNotThrow(() => {
      assertCruiseOptionsValid({
        ruleSet: { options: { exclude: "([A-Za-z]+)" } },
      });
    });
  });

  it("throws when --validate is passed an unsafe regex in rule-set.exclude", () => {
    throws(() => {
      assertCruiseOptionsValid({
        ruleSet: { options: { exclude: "(.*)+" } },
      });
    }, /The pattern '\(\.\*\)\+' will probably run very slowly - cowardly refusing to run\./);
  });

  it("command line options trump those passed in --validate rule-set", () => {
    const lOptions = assertCruiseOptionsValid({
      exclude: "from the commandline",
      ruleSet: { options: { exclude: "from the ruleset" } },
    });

    equal(lOptions.exclude, "from the commandline");
  });

  it("options passed in --validate rule-set drip down to the proper options", () => {
    const lOptions = assertCruiseOptionsValid({
      doNotFollow: "from the commandline",
      ruleSet: { options: { exclude: "from the ruleset" } },
    });

    equal(lOptions.exclude, "from the ruleset");
    equal(lOptions.doNotFollow, "from the commandline");
  });
});

describe("[U] main/options/validate - enhancedResolveOptions", () => {
  it("options passed in --validate rule-set drip down to the proper options (objects edition)", () => {
    const lOptions = assertCruiseOptionsValid({
      enhancedResolveOptions: {
        exportsFields: ["exports"],
        conditionNames: ["import", "require"],
        extensions: [".cjs", ".mjs"],
      },
      ruleSet: {
        options: {
          enhancedResolveOptions: {
            exportsFields: ["exports"],
            conditionNames: ["import"],
          },
        },
      },
    });

    deepEqual(lOptions.enhancedResolveOptions, {
      exportsFields: ["exports"],
      conditionNames: ["import", "require"],
      extensions: [".cjs", ".mjs"],
    });
  });
});
