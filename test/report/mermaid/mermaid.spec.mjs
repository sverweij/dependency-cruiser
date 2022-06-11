import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import mermaid from "../../../src/report/mermaid.js";
import mermaidReporterPlugin from "../../../configs/plugins/mermaid-reporter-plugin.js";
import { createRequireJSON } from "../../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const mockPath = join(__dirname, "__mocks__");

const same = (pName, pMermaidModule = mermaid) => {
  const definition = requireJSON(`./__mocks__/${pName}.json`);
  const expected = readFileSync(join(mockPath, `${pName}.mmd`), "utf8");
  const output = pMermaidModule(definition, { minify: false }).output;
  expect(output).to.deep.equal(expected);
};

const sameWithMinified = (pName, pMermaidModule = mermaid) => {
  const definition = requireJSON(`./__mocks__/${pName}.json`);
  const expected = readFileSync(join(mockPath, `${pName}.min.mmd`), "utf8");
  const output = pMermaidModule(definition, { minify: true }).output;
  expect(output).to.deep.equal(expected);
};

describe("[I] report/mermaid", () => {
  it("renders a mermaid - render directories", () => {
    same("dependency-cruiser-2019-01-14");
    sameWithMinified("dependency-cruiser-2019-01-14");
  });
  it("renders a mermaid - modules in the root don't come in a cluster", () =>
    same("clusterless"));
  it("renders a mermaid - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () =>
    same("es6-unresolvable-deps"));
  it("renders a mermaid - matchesDoNotFollow NOT rendered as folders", () =>
    same("do-not-follow-deps"));
  it("renders a mermaid - renders orphan module", () => same("orphan-deps"));
  it("renders a mermaid - rendered strings that mermaid cannot parse are escaped.", () =>
    same("contains-strings-to-be-escaped"));
  it("renders a mermaid - rendered strings that replaced from unknown figures.", () =>
    same("unknown-deps"));
  it("renders a mermaid - renders focussed elements with highlights", () => {
    same("with-focus");
    sameWithMinified("with-focus");
  });
});

describe("[I] configs/plugins/mermaid-reporter-plugin", () => {
  it("still renders mermaid with the mermaid reporter as a 'plugin'", () => {
    same("dependency-cruiser-2019-01-14", mermaidReporterPlugin);
    sameWithMinified("dependency-cruiser-2019-01-14", mermaidReporterPlugin);
  });
});
