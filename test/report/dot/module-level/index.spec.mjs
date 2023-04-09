import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import defaultTheme from "../../../../src/report/dot/default-theme.mjs";
import dot from "../../../../src/report/dot/index.mjs";
import { createRequireJSON } from "../../../backwards.utl.mjs";

const defaultRender = dot();
const render = dot("module");
const requireJSON = createRequireJSON(import.meta.url);

const clusterLess = requireJSON("./__mocks__/clusterless.json");
const bunchOfModules = requireJSON("./__mocks__/bunch-of-modules.json");
const focusMeModules = requireJSON(
  "./__mocks__/dependency-cruiser-2022-07-17-focus-me.json"
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
  "utf8"
);
const unresolvableFixture = readFileSync(
  join(fixturesPath, "es6-unresolvable-deps.dot"),
  "utf8"
);
const doNotFollowFixtureDefaultTheme = readFileSync(
  join(fixturesPath, "do-not-follow-deps-default-theme.dot"),
  "utf8"
);
const doNotFollowFixture = readFileSync(
  join(fixturesPath, "do-not-follow-deps.dot"),
  "utf8"
);
const orphanFixture = readFileSync(
  join(fixturesPath, "orphan-deps-default-theme.dot"),
  "utf8"
);
const orphanFixtureBoring = readFileSync(
  join(fixturesPath, "orphan-deps.dot"),
  "utf8"
);
const prefixUriFixture = readFileSync(
  join(fixturesPath, "prefix-uri.dot"),
  "utf8"
);
const prefixNonUriFixture = readFileSync(
  join(fixturesPath, "prefix-non-uri.dot"),
  "utf8"
);
const defaultColorFixture = readFileSync(
  join(fixturesPath, "bunch-of-modules-default-theme.dot"),
  "utf8"
);
const bareColorFixture = readFileSync(
  join(fixturesPath, "bunch-of-modules.dot"),
  "utf8"
);
const focusMeModulesFixture = readFileSync(
  join(fixturesPath, "dependency-cruiser-2022-07-17-focus-me.dot"),
  "utf8"
);

describe("[I] report/dot/module-level reporter", () => {
  it("renders a dot - modules in the root don't come in a cluster", () => {
    expect(render(clusterLess, { theme: bareTheme }).output).to.deep.equal(
      clusterLessFixture
    );
  });

  it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
    expect(render(unresolvableDeps, { theme: bareTheme }).output).to.deep.equal(
      unresolvableFixture
    );
  });

  it("renders a dot - bare theme matchesDoNotFollow NOT rendered as folders", () => {
    expect(render(doNotFollowDeps, { theme: bareTheme }).output).to.deep.equal(
      doNotFollowFixture
    );
  });

  it("renders a dot - default color theme matchesDoNotFollow rendered as folders", () => {
    expect(render(doNotFollowDeps).output).to.deep.equal(
      doNotFollowFixtureDefaultTheme
    );
  });

  it("renders a dot - bare theme renders modules with module level transgression with NO severity deduced colors", () => {
    expect(render(orphanDeps, { theme: bareTheme }).output).to.deep.equal(
      orphanFixtureBoring
    );
  });

  it("renders a dot - default theme renders modules with module level transgression with severity deduced colors", () => {
    expect(render(orphanDeps).output).to.deep.equal(orphanFixture);
  });

  it("renders a dot - uri prefix get concatenated", () => {
    expect(render(prefixUri, { theme: bareTheme }).output).to.deep.equal(
      prefixUriFixture
    );
  });

  it("renders a dot - non-uri prefixes get path.posix.joined", () => {
    expect(render(prefixNonUri, { theme: bareTheme }).output).to.deep.equal(
      prefixNonUriFixture
    );
  });

  it("richly colors modules when passed the default theme", () => {
    expect(
      render(bunchOfModules, { theme: defaultTheme }).output
    ).to.deep.equal(defaultColorFixture);
  });

  it("richly colors modules when passed no theme", () => {
    expect(render(bunchOfModules).output).to.deep.equal(defaultColorFixture);
  });

  it("colors boringly when passed a bare theme", () => {
    expect(render(bunchOfModules, { theme: bareTheme }).output).to.deep.equal(
      bareColorFixture
    );
  });

  it("Also renders on module level when the reporter granularity isn't specified", () => {
    expect(
      defaultRender(bunchOfModules, { theme: bareTheme }).output
    ).to.deep.equal(bareColorFixture);
  });

  it("applies filter when passed", () => {
    expect(render(focusMeModules, { theme: bareTheme }).output).to.deep.equal(
      focusMeModulesFixture
    );
  });
});

/* eslint max-len: 0 */
