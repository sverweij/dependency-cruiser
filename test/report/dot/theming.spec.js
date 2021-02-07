const _cloneDeep = require("lodash/cloneDeep");
const { expect } = require("chai");
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

  it("normalizeTheme doesn't mutate the default theme", () => {
    const lOriginalDefaultTheme = _cloneDeep(theming.normalizeTheme());

    theming.normalizeTheme({ graph: { someAttribute: 1234 } });
    expect(theming.normalizeTheme()).to.deep.equal(lOriginalDefaultTheme);
  });
});
