import { deepEqual } from "node:assert/strict";
import _cloneDeep from "lodash/cloneDeep.js";
import theming from "#report/dot/theming.mjs";

describe("[U] report/dot/theming - determineModuleColors - default theme", () => {
  it("empty module => no colors", () => {
    deepEqual(
      theming.determineAttributes({}, theming.normalizeTheme({}).module),
      {},
    );
  });

  it("core module => grey", () => {
    deepEqual(
      theming.determineAttributes(
        { coreModule: true },
        theming.normalizeTheme({}).modules,
      ),
      { color: "grey", fontcolor: "grey" },
    );
  });

  it("couldNotResolve => red", () => {
    deepEqual(
      theming.determineAttributes(
        { couldNotResolve: true },
        theming.normalizeTheme({}).modules,
      ),
      { color: "red", fontcolor: "red" },
    );
  });

  it("json => darker yellowish fillcolor", () => {
    deepEqual(
      theming.determineAttributes(
        { source: "package.json" },
        theming.normalizeTheme({}).modules,
      ),
      { fillcolor: "#ffee44" },
    );
  });

  it("normalizeTheme doesn't mutate the default theme", () => {
    const lOriginalDefaultTheme = _cloneDeep(theming.normalizeTheme());

    theming.normalizeTheme({ graph: { someAttribute: 1234 } });
    deepEqual(theming.normalizeTheme(), lOriginalDefaultTheme);
  });
});
