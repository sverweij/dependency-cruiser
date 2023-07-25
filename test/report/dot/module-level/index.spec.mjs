import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import defaultTheme from "../../../../src/report/dot/default-theme.mjs";
import dot from "../../../../src/report/dot/index.mjs";
import { createRequireJSON } from "../../../backwards.utl.mjs";

const defaultRender = dot();
const render = dot("module");
const requireJSON = createRequireJSON(import.meta.url);

const clusterLess = requireJSON("./__mocks__/clusterless.json");
const bunchOfModules = requireJSON("./__mocks__/bunch-of-modules.json");
const focusMeModules = requireJSON(
  "./__mocks__/dependency-cruiser-2022-07-17-focus-me.json",
);
const orphanDeps = requireJSON("./__mocks__/orphan-deps.json");
const unresolvableDeps = requireJSON("./__mocks__/es6-unresolvable-deps.json");
const doNotFollowDeps = requireJSON("./__mocks__/do-not-follow-deps.json");
const prefixUri = requireJSON("./__mocks__/prefix-uri.json");
const prefixNonUri = requireJSON("./__mocks__/prefix-non-uri.json");
const bareTheme = requireJSON("./bare-theme.json");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const fixturesPath = join(__dirname, "__fixtures__");
const clusterLessFixture = readFileSync(
  join(fixturesPath, "clusterless.dot"),
  "utf8",
);
const unresolvableFixture = readFileSync(
  join(fixturesPath, "es6-unresolvable-deps.dot"),
  "utf8",
);
const doNotFollowFixtureDefaultTheme = readFileSync(
  join(fixturesPath, "do-not-follow-deps-default-theme.dot"),
  "utf8",
);
const doNotFollowFixture = readFileSync(
  join(fixturesPath, "do-not-follow-deps.dot"),
  "utf8",
);
const orphanFixture = readFileSync(
  join(fixturesPath, "orphan-deps-default-theme.dot"),
  "utf8",
);
const orphanFixtureBoring = readFileSync(
  join(fixturesPath, "orphan-deps.dot"),
  "utf8",
);
const prefixUriFixture = readFileSync(
  join(fixturesPath, "prefix-uri.dot"),
  "utf8",
);
const prefixNonUriFixture = readFileSync(
  join(fixturesPath, "prefix-non-uri.dot"),
  "utf8",
);
const defaultColorFixture = readFileSync(
  join(fixturesPath, "bunch-of-modules-default-theme.dot"),
  "utf8",
);
const bareColorFixture = readFileSync(
  join(fixturesPath, "bunch-of-modules.dot"),
  "utf8",
);
const focusMeModulesFixture = readFileSync(
  join(fixturesPath, "dependency-cruiser-2022-07-17-focus-me.dot"),
  "utf8",
);

describe("[I] report/dot/module-level reporter", () => {
  it("renders a dot - modules in the root don't come in a cluster", () => {
    strictEqual(
      render(clusterLess, { theme: bareTheme }).output,
      clusterLessFixture,
    );
  });

  it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
    strictEqual(
      render(unresolvableDeps, { theme: bareTheme }).output,
      unresolvableFixture,
    );
  });

  it("renders a dot - bare theme matchesDoNotFollow NOT rendered as folders", () => {
    strictEqual(
      render(doNotFollowDeps, { theme: bareTheme }).output,
      doNotFollowFixture,
    );
  });

  it("renders a dot - default color theme matchesDoNotFollow rendered as folders", () => {
    strictEqual(render(doNotFollowDeps).output, doNotFollowFixtureDefaultTheme);
  });

  it("renders a dot - bare theme renders modules with module level transgression with NO severity deduced colors", () => {
    strictEqual(
      render(orphanDeps, { theme: bareTheme }).output,
      orphanFixtureBoring,
    );
  });

  it("renders a dot - default theme renders modules with module level transgression with severity deduced colors", () => {
    strictEqual(render(orphanDeps).output, orphanFixture);
  });

  it("renders a dot - uri prefix get concatenated", () => {
    strictEqual(
      render(prefixUri, { theme: bareTheme }).output,
      prefixUriFixture,
    );
  });

  it("renders a dot - non-uri prefixes get path.posix.joined", () => {
    strictEqual(
      render(prefixNonUri, { theme: bareTheme }).output,
      prefixNonUriFixture,
    );
  });

  it("richly colors modules when passed the default theme", () => {
    strictEqual(
      render(bunchOfModules, { theme: defaultTheme }).output,
      defaultColorFixture,
    );
  });

  it("richly colors modules when passed no theme", () => {
    strictEqual(render(bunchOfModules).output, defaultColorFixture);
  });

  it("colors boringly when passed a bare theme", () => {
    strictEqual(
      render(bunchOfModules, { theme: bareTheme }).output,
      bareColorFixture,
    );
  });

  it("Also renders on module level when the reporter granularity isn't specified", () => {
    strictEqual(
      defaultRender(bunchOfModules, { theme: bareTheme }).output,
      bareColorFixture,
    );
  });

  it("applies filter when passed", () => {
    strictEqual(
      render(focusMeModules, { theme: bareTheme }).output,
      focusMeModulesFixture,
    );
  });
});

/* eslint max-len: 0 */
