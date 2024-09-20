import { deepEqual } from "node:assert/strict";
import { getThemeAttributes, normalizeTheme } from "#report/dot/theming.mjs";

describe("[U] report/dot/theming - determineModuleColors - default theme", () => {
  it("empty module => no colors", () => {
    deepEqual(getThemeAttributes({}, normalizeTheme({}).module), {});
  });

  it("core module => grey", () => {
    deepEqual(
      getThemeAttributes({ coreModule: true }, normalizeTheme({}).modules),
      { color: "grey", fontcolor: "grey" },
    );
  });

  it("couldNotResolve => red", () => {
    deepEqual(
      getThemeAttributes({ couldNotResolve: true }, normalizeTheme({}).modules),
      {},
    );
  });

  it("json => darker yellowish fillcolor", () => {
    deepEqual(
      getThemeAttributes(
        { source: "package.json" },
        normalizeTheme({}).modules,
      ),
      { fillcolor: "#ffee44" },
    );
  });

  it("normalizeTheme doesn't mutate the default theme", () => {
    const lOriginalDefaultTheme = structuredClone(normalizeTheme());

    normalizeTheme({ graph: { someAttribute: 1234 } });
    deepEqual(normalizeTheme(), lOriginalDefaultTheme);
  });

  it("determines attributes when the property is a string and one of the criteria is an array", () => {
    deepEqual(
      getThemeAttributes(
        { source: "package.json" },
        normalizeTheme({
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
      getThemeAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        normalizeTheme({
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
      getThemeAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        normalizeTheme({
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
      getThemeAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        normalizeTheme({
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
      getThemeAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        normalizeTheme({
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
      getThemeAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        normalizeTheme({
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
      getThemeAttributes(
        {
          source: "src/heide/does.js",
          dependencyTypes: [
            "local",
            "aliased",
            "aliased-tsconfig",
            "aliased-tsconfig-base-url",
          ],
        },
        normalizeTheme({
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
