import { throws, ok, equal, match } from "node:assert/strict";
import dotModule from "#report/dot-webpage/dot-module.mjs";

const MINIMAL_CRUISE_RESULT = {
  modules: [],
  summary: {
    error: 0,
    info: 0,
    warn: 0,
    ignore: 0,
    totalCruised: 0,
    violations: [],
    optionsUsed: {},
  },
};

describe("[I] dot-picture", () => {
  it("should throw an error when dot is not available", () => {
    const lDotPictureReporterOptions = {
      spawnFunction: () => ({
        stdout: "foo bar baz",
        stderr: "error: command not found: dot",
        status: 1,
      }),
    };

    throws(() => {
      dotModule(MINIMAL_CRUISE_RESULT, lDotPictureReporterOptions);
    }, /GraphViz dot, which is required for the 'x-dot-webpage' reporter/);
  });

  it("throws an error when dot is available but isn't graphviz dot", () => {
    const lDotPictureReporterOptions = {
      spawnFunction: () => ({
        stderr: "dot - sneaky template engine version 0.0.1",
        status: 0,
      }),
    };

    throws(() => {
      dotModule(MINIMAL_CRUISE_RESULT, lDotPictureReporterOptions);
    }, /GraphViz dot, which is required for the 'x-dot-webpage' reporter doesn't/);
  });

  it("throws an error when dot throws an error", () => {
    const lDotPictureReporterOptions = {
      spawnFunction: (_pString, pCommandsArray) => {
        if (pCommandsArray[0] === "-V") {
          return {
            stderr: "dot - graphviz version 1.2.3.4",
            status: 0,
          };
        } else {
          return {
            stdout: "foo bar",
            stderr: "baz quux corge grault garply waldo fred plugh xyzzy thud",
            status: 1,
            error: new Error("some error, doesn't really matter which"),
          };
        }
      },
    };

    throws(() => {
      dotModule(MINIMAL_CRUISE_RESULT, lDotPictureReporterOptions);
    }, /some error, doesn't really matter which/);
  });

  it("throws an error when dot doesn't throw an error, but nonetheless fails", () => {
    const lDotPictureReporterOptions = {
      spawnFunction: (_pString, pCommandsArray) => {
        if (pCommandsArray[0] === "-V") {
          return {
            stderr: "dot - graphviz version 1.2.3.4",
            status: 0,
          };
        } else {
          return {
            stdout: "foo bar",
            stderr: "baz quux corge grault garply",
            status: 42,
          };
        }
      },
    };

    throws(() => {
      dotModule(MINIMAL_CRUISE_RESULT, lDotPictureReporterOptions);
    }, /GraphViz' dot returned an error \(exit code 42\)/);
  });

  it("should return an object with output and exitCode when dot is available", () => {
    const lDotPictureReporterOptions = {
      spawnFunction: (_pString, pCommandsArray) => {
        if (pCommandsArray[0] === "-V") {
          return {
            stderr: "dot - graphviz version 1.2.3.4",
            status: 0,
          };
        } else {
          return {
            stdout: "<svg></svg>",
            status: 0,
          };
        }
      },
    };

    const result = dotModule(MINIMAL_CRUISE_RESULT, lDotPictureReporterOptions);

    ok(result);
    ok(result.output);
    equal(result.exitCode, 0);
    match(result.output, /<html/);
    match(result.output, /<[/]html/);
    match(result.output, /<svg/);
  });
});
