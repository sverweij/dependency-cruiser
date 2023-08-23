import { deepEqual } from "node:assert/strict";
import moduleUtl from "../../../src/report/dot/module-utl.mjs";

describe("[U] report/dot/module-utl", () => {
  it("extractFirstTransgression - keeps as is when there's no transgressions", () => {
    deepEqual(moduleUtl.extractFirstTransgression({ dependencies: [] }), {
      dependencies: [],
    });
  });

  it("extractFirstTransgression - adds the first module rule if there's at least one", () => {
    deepEqual(
      moduleUtl.extractFirstTransgression({
        dependencies: [],
        rules: [
          { name: "error-thing", severity: "error" },
          { name: "warn-thing", severity: "warn" },
        ],
      }),
      {
        dependencies: [],
        tooltip: "error-thing",
        rules: [
          { name: "error-thing", severity: "error" },
          { name: "warn-thing", severity: "warn" },
        ],
      },
    );
  });

  it("extractFirstTransgression - adds the first dependency rule if there's at least one", () => {
    deepEqual(
      moduleUtl.extractFirstTransgression({
        dependencies: [
          {
            rules: [
              { name: "error-thing", severity: "error" },
              { name: "warn-thing", severity: "warn" },
            ],
          },
        ],
      }),
      {
        dependencies: [
          {
            rule: { name: "error-thing", severity: "error" },
            rules: [
              { name: "error-thing", severity: "error" },
              { name: "warn-thing", severity: "warn" },
            ],
          },
        ],
      },
    );
  });

  it("flatLabel - returns the value of source as label", () => {
    deepEqual(
      moduleUtl.flatLabel(true)({ source: "aap/noot/mies/wim/zus.jet" }),
      {
        source: "aap/noot/mies/wim/zus.jet",
        label: "<aap/noot/mies/wim/<BR/><B>zus.jet</B>>",
        tooltip: "zus.jet",
      },
    );
  });

  it("flatLabel - returns the value of source & instability metric as label when instability is known", () => {
    deepEqual(
      moduleUtl.flatLabel(true)({
        source: "aap/noot/mies/wim/zus.jet",
        instability: "0.481",
      }),
      {
        source: "aap/noot/mies/wim/zus.jet",
        label: `<aap/noot/mies/wim/<BR/><B>zus.jet</B> <FONT color="#808080" point-size="8">48%</FONT>>`,
        tooltip: "zus.jet",
        instability: "0.481",
      },
    );
  });

  it("flatLabel - returns the value of source when instability is known, but showMetrics is false", () => {
    deepEqual(
      moduleUtl.flatLabel(false)({
        source: "aap/noot/mies/wim/zus.jet",
        instability: "0.481",
      }),
      {
        source: "aap/noot/mies/wim/zus.jet",
        label: `<aap/noot/mies/wim/<BR/><B>zus.jet</B>>`,
        tooltip: "zus.jet",
        instability: "0.481",
      },
    );
  });
});
