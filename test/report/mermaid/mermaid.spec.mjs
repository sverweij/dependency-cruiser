import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
// eslint-plugins import and node don't yet understand these 'self references'
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import mermaidReporterPlugin from "dependency-cruiser/mermaid-reporter-plugin";
import mermaid from "../../../src/report/mermaid.mjs";
import { createRequireJSON } from "../../backwards.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const mockPath = join(__dirname, "__mocks__");

const same = (pName, pOptions, pMermaidModule = mermaid) => {
  const definition = requireJSON(`./__mocks__/${pName}.json`);
  const expected = readFileSync(
    join(
      mockPath,
      `${pName}${(pOptions || {}).minify === false ? ".mmd" : ".min.mmd"}`
    ),
    "utf8"
  );
  const output = pMermaidModule(definition, pOptions).output;
  expect(output).to.deep.equal(expected);
};

describe("[I] report/mermaid", () => {
  it("renders a mermaid - render directories", () => {
    same("dependency-cruiser-2019-01-14", { minify: false });
    same("dependency-cruiser-2019-01-14", { minify: true });
  });
  it("renders a mermaid - modules in the root don't come in a cluster", () =>
    same("clusterless", { minify: false }));
  it("renders a mermaid - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () =>
    same("es6-unresolvable-deps", { minify: false }));
  it("renders a mermaid - matchesDoNotFollow NOT rendered as folders", () =>
    same("do-not-follow-deps", { minify: false }));
  it("renders a mermaid - renders orphan module", () =>
    same("orphan-deps", { minify: false }));
  it("renders a mermaid - rendered strings that mermaid cannot parse are escaped.", () =>
    same("contains-strings-to-be-escaped", { minify: false }));
  it("renders a mermaid - rendered strings that replaced from unknown figures.", () =>
    same("unknown-deps", { minify: false }));
  it("renders a mermaid - renders focused elements with highlights - unminified", () => {
    same("with-focus", { minify: false });
  });
  it("renders a mermaid - renders focused elements with highlights - no options passed", () => {
    // eslint-disable-next-line no-undefined
    same("with-focus", undefined);
  });
  it("renders a mermaid - renders focused elements with highlights - minified", () => {
    same("with-focus", { minify: true });
  });
  it("renders collapsed nodes correctly", () => {
    same("collapsed", { minify: true });
  });
});

describe("[I] configs/plugins/mermaid-reporter-plugin", () => {
  it("still renders mermaid with the mermaid reporter as a 'plugin'", () => {
    same(
      "dependency-cruiser-2019-01-14",
      { minify: false },
      mermaidReporterPlugin
    );
    same(
      "dependency-cruiser-2019-01-14",
      { minify: true },
      mermaidReporterPlugin
    );
  });
});
