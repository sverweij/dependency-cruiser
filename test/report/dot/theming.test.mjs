import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import _cloneDeep from "lodash/cloneDeep.js";
import theming from "../../../src/report/dot/theming.mjs";

describe("[U] report/dot/theming - determineModuleColors - default theme", () => {
  it("empty module => no colors", () => {
    deepStrictEqual(
      theming.determineAttributes({}, theming.normalizeTheme({}).module),
      {}
    );
  });

  it("core module => grey", () => {
    deepStrictEqual(
      theming.determineAttributes(
        { coreModule: true },
        theming.normalizeTheme({}).modules
      ),
      { color: "grey", fontcolor: "grey" }
    );
  });

  it("couldNotResolve => red", () => {
    deepStrictEqual(
      theming.determineAttributes(
        { couldNotResolve: true },
        theming.normalizeTheme({}).modules
      ),
      { color: "red", fontcolor: "red" }
    );
  });

  it("json => darker yellowish fillcolor", () => {
    deepStrictEqual(
      theming.determineAttributes(
        { source: "package.json" },
        theming.normalizeTheme({}).modules
      ),
      { fillcolor: "#ffee44" }
    );
  });

  it("normalizeTheme doesn't mutate the default theme", () => {
    const lOriginalDefaultTheme = _cloneDeep(theming.normalizeTheme());

    theming.normalizeTheme({ graph: { someAttribute: 1234 } });
    deepStrictEqual(theming.normalizeTheme(), lOriginalDefaultTheme);
  });
});
