import { deepEqual, equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequireJSON } from "../../../backwards.utl.mjs";
import dot from "#report/dot/index.mjs";

const render = dot("custom");
const requireJSON = createRequireJSON(import.meta.url);

const deps = requireJSON("./__mocks__/dependency-cruiser-2020-01-25.json");
const orphans = requireJSON("./__mocks__/orphans.json");
const rxjs = requireJSON("./__mocks__/rxjs.json");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const fixturesFolder = join(__dirname, "__fixtures__");
const consolidatedDot = readFileSync(
  join(fixturesFolder, "dependency-cruiser-2020-01-25.dot"),
  "utf8",
);
const consolidatedOrphansDot = readFileSync(
  join(fixturesFolder, "orphans.dot"),
  "utf8",
);
const consolidatedRxJs = readFileSync(join(fixturesFolder, "rxjs.dot"), "utf8");

describe("[I] report/dot/custom-level reporter", () => {
  it("consolidates to custome levels", () => {
    const lReturnValue = render(deps);

    deepEqual(lReturnValue.output, consolidatedDot);
    equal(lReturnValue.exitCode, 0);
  });

  it("consolidates module only transgressions correctly", () => {
    const lReturnValue = render(orphans);

    deepEqual(lReturnValue.output, consolidatedOrphansDot);
    equal(lReturnValue.exitCode, 0);
  });

  it("consolidates a slightly larger code base in a timely fashion", () => {
    const lReturnValue = render(rxjs);

    deepEqual(lReturnValue.output, consolidatedRxJs);
    equal(lReturnValue.exitCode, 0);
  });
});
