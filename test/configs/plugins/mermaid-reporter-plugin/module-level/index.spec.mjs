import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import mermaidReporterPlugin from "../../../../../configs/plugins/mermaid-reporter-plugin.js";
import { createRequireJSON } from "../../../../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const mockPath = join(__dirname, "__mocks__");

const same = (pName) => {
  const definition = requireJSON(`./__mocks__/${pName}.json`);
  const expected = readFileSync(join(mockPath, `${pName}.mmd`), "utf8");
  const output = mermaidReporterPlugin(definition).output;
  expect(output).to.deep.equal(expected);
};

describe("[I] configs/plugins/mermaid-reporter-plugin module-level reporter", () => {
  it("renders a mermaid - render directories", () =>
    same("dependency-cruiser-2019-01-14"));
  it("renders a mermaid - modules in the root don't come in a cluster", () =>
    same("clusterless"));
  it("renders a mermaid - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () =>
    same("es6-unresolvable-deps"));
  it("renders a mermaid - matchesDoNotFollow NOT rendered as folders", () =>
    same("do-not-follow-deps"));
  it("renders a mermaid - renders orphan module", () => same("orphan-deps"));
  it("renders a mermaid - uri prefix get concatenated", () =>
    same("prefix-uri"));
  it("renders a mermaid - non-uri prefixes get path.posix.joined", () =>
    same("prefix-non-uri"));
  it("renders a mermaid - rendered strings that mermaid cannot parse are escaped.", () =>
    same("contains-strings-to-be-escaped"));
});
