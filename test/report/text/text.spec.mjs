import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { equal } from "node:assert/strict";
import normalizeNewline from "normalize-newline";
import dependencies from "./__mocks__/dependencies.mjs";
import cruiseResultWithFocus from "./__mocks__/cruise-result-with-focus.mjs";
import renderText from "#report/text.mjs";

describe("[I] report/text", () => {
  it("renders a bunch of dependencies", () => {
    const lResult = renderText(dependencies);
    const lExpectedOutput = normalizeNewline(
      readFileSync(
        fileURLToPath(
          new URL("__fixtures__/dependencies.txt", import.meta.url),
        ),
        "utf8",
      ),
    );

    equal(normalizeNewline(lResult.output), lExpectedOutput);
    equal(lResult.exitCode, 0);
  });

  it("renders dependencies - focused modules highlighted when highlightFocused === true", () => {
    const lResult = renderText(cruiseResultWithFocus, {
      highlightFocused: true,
    });

    // const lExpectedOutput =
    //   "\u001B[4msrc/main/rule-set/normalize.js\u001B[24m → src/main/utl/normalize-re-properties.js\n" +
    //   "\u001B[4msrc/main/rule-set/normalize.js\u001B[24m → node_modules/lodash/cloneDeep.js\n" +
    //   "\u001B[4msrc/main/rule-set/normalize.js\u001B[24m → node_modules/lodash/has.js\n" +
    //   "src/main/index.js → \u001B[4msrc/main/rule-set/normalize.js\u001B[24m\n" +
    //   "test/enrich/derive/reachable/index.spec.mjs → \u001B[4msrc/main/rule-set/normalize.js\u001B[24m\n" +
    //   "test/main/rule-set/normalize.spec.mjs → \u001B[4msrc/main/rule-set/normalize.js\u001B[24m\n" +
    //   "test/validate/parse-ruleset.utl.mjs → \u001B[4msrc/main/rule-set/normalize.js\u001B[24m\n";

    // we're running our tests with NO_COLOR=1, so the expected output is without the ANSI codes
    // TODO: figure out a way to still do this that isn't super klunky
    const lExpectedOutput =
      "src/main/rule-set/normalize.js → src/main/utl/normalize-re-properties.js\n" +
      "src/main/rule-set/normalize.js → node_modules/lodash/cloneDeep.js\n" +
      "src/main/rule-set/normalize.js → node_modules/lodash/has.js\n" +
      "src/main/index.js → src/main/rule-set/normalize.js\n" +
      "test/enrich/derive/reachable/index.spec.mjs → src/main/rule-set/normalize.js\n" +
      "test/main/rule-set/normalize.spec.mjs → src/main/rule-set/normalize.js\n" +
      "test/validate/parse-ruleset.utl.mjs → src/main/rule-set/normalize.js\n";
    equal(normalizeNewline(lResult.output), lExpectedOutput);
  });

  it("renders dependencies - no highlights when highlightFocused === false", () => {
    const lResult = renderText(cruiseResultWithFocus, {
      highlightFocused: false,
    });

    const lExpectedOutput =
      "src/main/rule-set/normalize.js → src/main/utl/normalize-re-properties.js\n" +
      "src/main/rule-set/normalize.js → node_modules/lodash/cloneDeep.js\n" +
      "src/main/rule-set/normalize.js → node_modules/lodash/has.js\n" +
      "src/main/index.js → src/main/rule-set/normalize.js\n" +
      "test/enrich/derive/reachable/index.spec.mjs → src/main/rule-set/normalize.js\n" +
      "test/main/rule-set/normalize.spec.mjs → src/main/rule-set/normalize.js\n" +
      "test/validate/parse-ruleset.utl.mjs → src/main/rule-set/normalize.js\n";
    equal(normalizeNewline(lResult.output), lExpectedOutput);
  });
});
