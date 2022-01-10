import { expect } from "chai";
import validate from "../../../src/main/options/validate.js";

describe("[U] main/options/validate", () => {
  it("throws when a invalid module system is passed ", () => {
    expect(() => {
      validate.validateCruiseOptions({
        moduleSystems: ["notavalidmodulesystem"],
      });
    }).to.throw("Invalid module system list: 'notavalidmodulesystem'\n");
  });

  it("passes when a valid module system is passed", () => {
    expect(() => {
      validate.validateCruiseOptions({ moduleSystems: ["cjs"] });
    }).to.not.throw();
  });

  it("throws when a invalid output type is passed ", () => {
    expect(() => {
      validate.validateCruiseOptions({ outputType: "notAValidOutputType" });
    }).to.throw("'notAValidOutputType' is not a valid output type.\n");
  });

  it("passes when a valid output type is passed", () => {
    expect(() => {
      validate.validateCruiseOptions({ outputType: "err" });
    }).to.not.throw();
  });

  it("throws when a non-integer is passed as maxDepth", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: "not an integer" });
    }).to.throw(
      "'not an integer' is not a valid depth - use an integer between 0 and 99"
    );
  });

  it("throws when > 99 is passed as maxDepth (string)", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: "101" });
    }).to.throw("'101' is not a valid depth - use an integer between 0 and 99");
  });

  it("throws when > 99 is passed as maxDepth (number)", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: 101 });
    }).to.throw("'101' is not a valid depth - use an integer between 0 and 99");
  });

  it("throws when < 0 is passed as maxDepth (string)", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: "-1" });
    }).to.throw("'-1' is not a valid depth - use an integer between 0 and 99");
  });

  it("throws when < 0 is passed as maxDepth (number)", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: -1 });
    }).to.throw("'-1' is not a valid depth - use an integer between 0 and 99");
  });

  it("passes when a valid depth is passed as maxDepth (string)", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: "42" });
    }).to.not.throw();
  });

  it("passes when a valid depth is passed as maxDepth (number)", () => {
    expect(() => {
      validate.validateCruiseOptions({ maxDepth: 42 });
    }).to.not.throw();
  });

  it("throws when --exclude is passed an unsafe regex", () => {
    expect(() => {
      validate.validateCruiseOptions({ exclude: "([A-Za-z]+)*" });
    }).to.throw(
      "The pattern '([A-Za-z]+)*' will probably run very slowly - cowardly refusing to run.\n"
    );
  });

  it("throws when exclude.path is passed an unsafe regex", () => {
    expect(() => {
      validate.validateCruiseOptions({ exclude: "([A-Za-z]+)*" });
    }).to.throw(
      "The pattern '([A-Za-z]+)*' will probably run very slowly - cowardly refusing to run.\n"
    );
  });

  it("throws when exclude.pathNot is passed an unsafe regex", () => {
    expect(() => {
      validate.validateCruiseOptions({ exclude: "([A-Za-z]+)*" });
    }).to.throw(
      "The pattern '([A-Za-z]+)*' will probably run very slowly - cowardly refusing to run.\n"
    );
  });

  it("throws when doNotFollow.pathNot is passed an unsafe regex", () => {
    expect(() => {
      validate.validateCruiseOptions({ doNotFollow: "([A-Za-z]+)*" });
    }).to.throw(
      "The pattern '([A-Za-z]+)*' will probably run very slowly - cowardly refusing to run.\n"
    );
  });

  it("passes when --exclude is passed a safe regex", () => {
    expect(() => {
      validate.validateCruiseOptions({ exclude: "([A-Za-z]+)" });
    }).to.not.throw();
  });

  it("passes when --validate is passed a safe regex in rule-set.exclude", () => {
    expect(() => {
      validate.validateCruiseOptions({
        ruleSet: { options: { exclude: "([A-Za-z]+)" } },
      });
    }).to.not.throw();
  });

  it("throws when --validate is passed an unsafe regex in rule-set.exclude", () => {
    expect(() => {
      validate.validateCruiseOptions({
        ruleSet: { options: { exclude: "(.*)+" } },
      });
    }).to.throw(
      "The pattern '(.*)+' will probably run very slowly - cowardly refusing to run.\n"
    );
  });

  it("command line options trump those passed in --validate rule-set", () => {
    const lOptions = validate.validateCruiseOptions({
      exclude: "from the commandline",
      ruleSet: { options: { exclude: "from the ruleset" } },
    });

    expect(lOptions.exclude).to.equal("from the commandline");
  });

  it("options passed in --validate rule-set drip down to the proper options", () => {
    const lOptions = validate.validateCruiseOptions({
      doNotFollow: "from the commandline",
      ruleSet: { options: { exclude: "from the ruleset" } },
    });

    expect(lOptions.exclude).to.equal("from the ruleset");
    expect(lOptions.doNotFollow).to.equal("from the commandline");
  });
});
