import { match, equal } from "node:assert/strict";
import report from "#report/index.mjs";

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

const lAvailableReporters = report.getAvailableReporters();
const lReporters = await Promise.all(
  lAvailableReporters
    .filter(
      (pReporterName) =>
        pReporterName !== "null" && pReporterName !== "x-dot-webpage",
    )
    .map(async (pReporter) => {
      const lReporter = await report.getReporter(pReporter);
      const lResult = lReporter(MINIMAL_CRUISE_RESULT);
      return { reporter: pReporter, output: lResult.output };
    }),
);

function spawnFunction(pString, pCommandsArray) {
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
}

describe("[I] most reporters' output ends on an EOL", () => {
  lReporters.forEach(({ reporter, output }) => {
    it(`the ${reporter} reporter output ends on an EOL`, () => {
      match(output, /\n$/);
    });
  });

  it("the x-dot-webpage reporter output ends on an EOL", async () => {
    const lXDotWebpageReporter = await report.getReporter("x-dot-webpage");

    const lResult = lXDotWebpageReporter(MINIMAL_CRUISE_RESULT, {
      spawnFunction,
    });
    match(lResult.output, /\n$/);
  });

  it("the null reporter output DOES NOT end on an EOL", async () => {
    const lNullReporter = await report.getReporter("null");
    const lResult = lNullReporter(MINIMAL_CRUISE_RESULT);
    equal(lResult.output, "");
  });
});
