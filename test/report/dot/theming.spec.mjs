import { deepEqual } from "node:assert/strict";
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
      {},
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
    const lOriginalDefaultTheme = structuredClone(theming.normalizeTheme());

    theming.normalizeTheme({ graph: { someAttribute: 1234 } });
    deepEqual(theming.normalizeTheme(), lOriginalDefaultTheme);
  });

  it("determines attributes when the property is a string and one of the criteria is an array", () => {
    deepEqual(
      theming.determineAttributes(
        { source: "package.json" },
        theming.normalizeTheme({
          modules: [
            {
              criteria: { source: ["package.json", "package-lock.json"] },
              attributes: { fillcolor: "red" },
            },
          ],
        }).modules,
      ),
      { fillcolor: "red" },
    );
  });

  it("determines attributes when the property is an array and one of the criteria is an array", () => {
    deepEqual(
      theming.determineAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        theming.normalizeTheme({
          modules: [
            {
              criteria: { dependencyTypes: ["aliased-tsconfig"] },
              attributes: { fillcolor: "blue" },
            },
          ],
        }).modules,
      ),
      { fillcolor: "blue" },
    );
  });

  it("determines attributes when the property is an array and one of the criteria is an array - on multiple it takes the logical OR", () => {
    deepEqual(
      theming.determineAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        theming.normalizeTheme({
          modules: [
            {
              criteria: {
                dependencyTypes: [
                  "npm",
                  "aliased-workspace",
                  "aliased-tsconfig",
                ],
              },
              attributes: { fillcolor: "blue" },
            },
          ],
        }).modules,
      ),
      { fillcolor: "blue" },
    );
  });

  it("determines attributes when the property is an array and one of the criteria is a regexy array", () => {
    deepEqual(
      theming.determineAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        theming.normalizeTheme({
          modules: [
            {
              criteria: { dependencyTypes: ["aliased-t.+"] },
              attributes: { fillcolor: "blue" },
            },
          ],
        }).modules,
      ),
      { fillcolor: "blue" },
    );
  });

  it("determines attributes when the property is an array and one of the criteria is a regexy array but there's no match", () => {
    deepEqual(
      theming.determineAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        theming.normalizeTheme({
          modules: [
            {
              criteria: { dependencyTypes: ["npm"] },
              attributes: { fillcolor: "blue" },
            },
          ],
        }).modules,
      ),
      {},
    );
  });

  it("determines attributes when the property is an array and one of the criteria is a string", () => {
    deepEqual(
      theming.determineAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        theming.normalizeTheme({
          modules: [
            {
              criteria: { dependencyTypes: "aliased-tsconfig" },
              attributes: { fillcolor: "blue" },
            },
          ],
        }).modules,
      ),
      { fillcolor: "blue" },
    );
  });

  it("determines attributes when the property is an array and one of the criteria is a regexy string", () => {
    deepEqual(
      theming.determineAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        theming.normalizeTheme({
          modules: [
            {
              criteria: { dependencyTypes: "aliased-tsconfig" },
              attributes: { fillcolor: "blue" },
            },
          ],
        }).modules,
      ),
      { fillcolor: "blue" },
    );
  });
});
