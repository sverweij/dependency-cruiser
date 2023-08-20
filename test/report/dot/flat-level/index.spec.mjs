import { deepStrictEqual, strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import dot from "../../../../src/report/dot/index.mjs";
import { createRequireJSON } from "../../../backwards.utl.mjs";

const render = dot("flat");
const requireJSON = createRequireJSON(import.meta.url);

const deps = requireJSON("./__mocks__/dependency-cruiser-2020-01-25.json");
const orphans = requireJSON("./__mocks__/orphans.json");
const rxjs = requireJSON("./__mocks__/rxjs.json");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const fixturesFolder = join(__dirname, "__fixtures__");
const flatDot = readFileSync(
  join(fixturesFolder, "dependency-cruiser-2020-01-25.dot"),
  "utf8",
);
const flatOrphansDot = readFileSync(
  join(fixturesFolder, "orphans.dot"),
  "utf8",
);
const flatRxJs = readFileSync(join(fixturesFolder, "rxjs.dot"), "utf8");

describe("[I] report/dot/flat-level reporter", () => {
  it("consolidates to flat levels", () => {
    const lReturnValue = render(deps);

    strictEqual(lReturnValue.output, flatDot);
    strictEqual(lReturnValue.exitCode, 0);
  });

  it("consolidates module only transgressions correctly", () => {
    const lReturnValue = render(orphans);

    strictEqual(lReturnValue.output, flatOrphansDot);
    strictEqual(lReturnValue.exitCode, 0);
  });

  it("consolidates a slightly larger code base in a timely fashion", () => {
    const lReturnValue = render(rxjs);

    strictEqual(lReturnValue.output, flatRxJs);
    strictEqual(lReturnValue.exitCode, 0);
  });
});

/* eslint max-len: 0 */
