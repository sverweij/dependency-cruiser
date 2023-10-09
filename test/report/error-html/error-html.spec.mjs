import { match, equal, doesNotMatch } from "node:assert/strict";
import everythingFineResult from "./__mocks__/everything-fine.mjs";
import validationMoreThanOnce from "./__mocks__/violation-more-than-once.mjs";
import validationMoreThanOnceWithAnIgnore from "./__mocks__/violation-more-than-once-with-an-ignore.mjs";
import orphansCyclesMetrics from "./__mocks__/orphans-cycles-metrics.mjs";
import errorHTML from "#report/error-html/index.mjs";

describe("[I] report/error-html", () => {
  const lOkeliDokelyKey = "gummy bears";
  const lOkeliDokelyHeader = "No violations found";

  it("happy day no errors", () => {
    const lResult = errorHTML(everythingFineResult);

    match(lResult.output, new RegExp(lOkeliDokelyKey));
    match(lResult.output, new RegExp(lOkeliDokelyHeader));
    equal(lResult.exitCode, 0);
  });

  it("report with errors", () => {
    const lResult = errorHTML(validationMoreThanOnce);

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));
    match(lResult.output, /All violations/);
    match(lResult.output, /<strong>127<\/strong> modules/);
    match(lResult.output, /<strong>259<\/strong> dependencies/);
    match(lResult.output, /<strong>0<\/strong> errors/);
    match(lResult.output, /<strong>1<\/strong> warnings/);
    match(lResult.output, /<strong>2<\/strong> informational/);

    match(lResult.output, /<td><strong>2<\/strong><\/td>/);
    match(
      lResult.output,
      /<a href="https:\/\/github.com\/sverweij\/dependency-cruiser\/blob\/develop\/src\/cli\/compileConfig\/index.js">/,
    );
    equal(lResult.exitCode, 0);
  });

  it("report with violations and ignored violations", () => {
    const lResult = errorHTML(validationMoreThanOnceWithAnIgnore);

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));
    match(lResult.output, /All violations/);
    match(lResult.output, /<strong>127<\/strong> modules/);
    match(lResult.output, /<strong>259<\/strong> dependencies/);
    match(lResult.output, /<strong>0<\/strong> errors/);
    match(lResult.output, /<strong>0<\/strong> warnings/);
    match(lResult.output, /<strong>1<\/strong> informational/);
    match(lResult.output, /<strong>2<\/strong> ignored/);
    match(lResult.output, /also show ignored violations/);
    match(lResult.output, /<th>ignored<\/th>/);
    match(lResult.output, /<tr class="ignored">/);

    match(
      lResult.output,
      /<a href="https:\/\/github.com\/sverweij\/dependency-cruiser\/blob\/develop\/src\/cli\/compileConfig\/index.js">/,
    );
    equal(lResult.exitCode, 0);
  });

  it("report nicely on orphans, cycles and metric rules", () => {
    const lResult = errorHTML(orphansCyclesMetrics);

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));

    // empty 'to' column for module only rules
    match(
      lResult.output,
      />src\/schema\/baseline-violations\.schema\.js<\/a><\/td>[^<]*<td><\/td>/,
    );
    // cycles as cycles in the 'to' column:
    match(
      lResult.output,
      /src\/extract\/transpile &rightarrow;<br\/>src\/extract\/parse/,
    );
    // metrics violations with the 'instability' for the involved modules in:
    match(
      lResult.output,
      /src\/extract\/transpile\/index\.js<\/a>&nbsp;<span class="extra">\(I: 33%\)<\/span><\/td>[^<]*<td>src\/extract\/transpile\/meta.js&nbsp;<span class="extra">\(I: 80%\)<\/span>/,
    );
  });
});
