const expect = require("chai").expect;
const theming = require("../../../src/report/dot/theming");

describe("report/dot/theming - determineModuleColors - default theme", () => {
  it("empty module => no colors", () => {
    expect(
      theming.determineAttributes({}, theming.normalizeTheme({}).module)
    ).to.deep.equal({});
  });

  it("core module => grey", () => {
    expect(
      theming.determineAttributes(
        { coreModule: true },
        theming.normalizeTheme({}).modules
      )
    ).to.deep.equal({ color: "grey", fontcolor: "grey" });
  });

  it("couldNotResolve => red", () => {
    expect(
      theming.determineAttributes(
        { couldNotResolve: true },
        theming.normalizeTheme({}).modules
      )
    ).to.deep.equal({ color: "red", fontcolor: "red" });
  });

  it("json => darker yellowish fillcolor", () => {
    expect(
      theming.determineAttributes(
        { source: "package.json" },
        theming.normalizeTheme({}).modules
      )
    ).to.deep.equal({ fillcolor: "#ffee44" });
  });
});
