import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import { createRequireJSON } from "../../../backwards.utl.mjs";
import dot from "../../../../src/report/dot/index.mjs";

const render = dot("folder");
const requireJSON = createRequireJSON(import.meta.url);

const deps = requireJSON("./__mocks__/dependency-cruiser-2019-01-14.json");
const orphans = requireJSON("./__mocks__/orphans.json");
const rxjs = requireJSON("./__mocks__/rxjs.json");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const fixturesFolder = join(__dirname, "__fixtures__");
const consolidatedDot = readFileSync(
  join(fixturesFolder, "dependency-cruiser-2019-01-14.dot"),
  "utf8"
);
const consolidatedOrphansDot = readFileSync(
  join(fixturesFolder, "orphans.dot"),
  "utf8"
);
const consolidatedRxJs = readFileSync(join(fixturesFolder, "rxjs.dot"), "utf8");

describe("[I] report/dot/folder-level reporter", () => {
  it("consolidates to folder level", () => {
    const lReturnValue = render(deps);

    expect(lReturnValue.output).to.deep.equal(consolidatedDot);
    expect(lReturnValue.exitCode).to.equal(0);
  });

  it("consolidates module only transgressions correctly", () => {
    const lReturnValue = render(orphans);

    expect(lReturnValue.output).to.deep.equal(consolidatedOrphansDot);
    expect(lReturnValue.exitCode).to.equal(0);
  });

  it("consolidates a slightly larger code base in a timely fashion", () => {
    const lReturnValue = render(rxjs);

    expect(lReturnValue.output).to.deep.equal(consolidatedRxJs);
    expect(lReturnValue.exitCode).to.equal(0);
  });
});

/* eslint max-len: 0 */
