const expect = require("chai").expect;
const errHTML = require("../../../src/report/err-html");
const everythingFineResult = require("../fixtures/everything-fine.json");
const validationMoreThanOnce = require("../fixtures/violation-more-than-once.json");

describe("report/err-html", () => {
  const lOkeliDokelyKey = "gummy bears";
  const lOkeliDokelyHeader = "No violations found";

  it("happy day no errors", () => {
    const lResult = errHTML(everythingFineResult);

    expect(lResult.output).to.contain(lOkeliDokelyKey);
    expect(lResult.output).to.contain(lOkeliDokelyHeader);
    expect(lResult.exitCode).to.equal(0);
  });

  it("report with errors", () => {
    const lReport = errHTML(validationMoreThanOnce);

    expect(lReport.output).to.not.contain(lOkeliDokelyKey);
    expect(lReport.output).to.not.contain(lOkeliDokelyHeader);
    expect(lReport.output).to.contain("All violations");
    expect(lReport.output).to.contain("<strong>127</strong> modules");
    expect(lReport.output).to.contain("<strong>259</strong> dependencies");
    expect(lReport.output).to.contain("<strong>0</strong> errors");
    expect(lReport.output).to.contain("<strong>1</strong> warnings");
    expect(lReport.output).to.contain("<strong>2</strong> informational");

    expect(lReport.output).to.contain("<td><strong>2</strong></td>");
    expect(lReport.output).to.contain(
      '<a href="https://github.com/sverweij/dependency-cruiser/blob/develop/src/cli/compileConfig/index.js">'
    );
    expect(lReport.exitCode).to.equal(0);
  });
});
