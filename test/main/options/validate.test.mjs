import { doesNotThrow, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";
import { validateCruiseOptions } from "../../../src/main/options/validate.mjs";

describe("[U] main/options/validate - module systems", () => {
  it("throws when a invalid module system is passed ", () => {
    throws(() => {
      validateCruiseOptions({
        moduleSystems: ["notavalidmodulesystem"],
      });
    }, /Invalid module system list: 'notavalidmodulesystem'/);
  });

  it("passes when a valid module system is passed", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ moduleSystems: ["cjs"] });
    });
  });
});

describe("[U] main/options/validate - output types", () => {
  it("throws when a invalid output type is passed ", () => {
    throws(() => {
      validateCruiseOptions({ outputType: "notAValidOutputType" });
    }, /'notAValidOutputType' is not a valid output type\./);
  });

  it("passes when a valid output type is passed", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ outputType: "err" });
    });
  });
});

describe("[U] main/options/validate - maxDepth", () => {
  it("throws when a non-integer is passed as maxDepth", () => {
    throws(() => {
      validateCruiseOptions({ maxDepth: "not an integer" });
    }, /'not an integer' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed as maxDepth (string)", () => {
    throws(() => {
      validateCruiseOptions({ maxDepth: "101" });
    }, /'101' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed as maxDepth (number)", () => {
    throws(() => {
      validateCruiseOptions({ maxDepth: 101 });
    }, /'101' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed as maxDepth (string)", () => {
    throws(() => {
      validateCruiseOptions({ maxDepth: "-1" });
    }, /'-1' is not a valid depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed as maxDepth (number)", () => {
    throws(() => {
      validateCruiseOptions({ maxDepth: -1 });
    }, /'-1' is not a valid depth - use an integer between 0 and 99/);
  });

  it("passes when a valid depth is passed as maxDepth (string)", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ maxDepth: "42" });
    });
  });

  it("passes when a valid depth is passed as maxDepth (number)", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ maxDepth: 42 });
    });
  });
});

describe("[U] main/options/validate - focusDepth", () => {
  it("throws when a non-integer is passed", () => {
    throws(() => {
      validateCruiseOptions({ focusDepth: "not an integer" });
    }, /'not an integer' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed (string)", () => {
    throws(() => {
      validateCruiseOptions({ focusDepth: "101" });
    }, /'101' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when > 99 is passed as maxDepth (number)", () => {
    throws(() => {
      validateCruiseOptions({ focusDepth: 101 });
    }, /'101' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed (string)", () => {
    throws(() => {
      validateCruiseOptions({ focusDepth: "-1" });
    }, /'-1' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("throws when < 0 is passed (number)", () => {
    throws(() => {
      validateCruiseOptions({ focusDepth: -1 });
    }, /'-1' is not a valid focus depth - use an integer between 0 and 99/);
  });

  it("passes when a valid depth is passed (string)", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ focusDepth: "42" });
    });
  });

  it("passes when a valid depth is passed (number)", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ focusDepth: 42 });
    });
  });
});

describe("[U] main/options/validate - exclude", () => {
  it("throws when --exclude is passed an unsafe regex", () => {
    throws(() => {
      validateCruiseOptions({ exclude: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("throws when exclude.path is passed an unsafe regex", () => {
    throws(() => {
      validateCruiseOptions({ exclude: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("throws when exclude.pathNot is passed an unsafe regex", () => {
    throws(() => {
      validateCruiseOptions({ exclude: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("throws when doNotFollow.pathNot is passed an unsafe regex", () => {
    throws(() => {
      validateCruiseOptions({ doNotFollow: "([A-Za-z]+)*" });
    }, /The pattern '\(\[A-Za-z\]\+\)\*' will probably run very slowly - cowardly refusing to run\./);
  });

  it("passes when --exclude is passed a safe regex", () => {
    doesNotThrow(() => {
      validateCruiseOptions({ exclude: "([A-Za-z]+)" });
    });
  });

  it("passes when --validate is passed a safe regex in rule-set.exclude", () => {
    doesNotThrow(() => {
      validateCruiseOptions({
        ruleSet: { options: { exclude: "([A-Za-z]+)" } },
      });
    });
  });

  it("throws when --validate is passed an unsafe regex in rule-set.exclude", () => {
    throws(() => {
      validateCruiseOptions({
        ruleSet: { options: { exclude: "(.*)+" } },
      });
    }, /The pattern '\(\.\*\)\+' will probably run very slowly - cowardly refusing to run\./);
  });

  it("command line options trump those passed in --validate rule-set", () => {
    const lOptions = validateCruiseOptions({
      exclude: "from the commandline",
      ruleSet: { options: { exclude: "from the ruleset" } },
    });

    strictEqual(lOptions.exclude, "from the commandline");
  });

  it("options passed in --validate rule-set drip down to the proper options", () => {
    const lOptions = validateCruiseOptions({
      doNotFollow: "from the commandline",
      ruleSet: { options: { exclude: "from the ruleset" } },
    });

    strictEqual(lOptions.exclude, "from the ruleset");
    strictEqual(lOptions.doNotFollow, "from the commandline");
  });
});
