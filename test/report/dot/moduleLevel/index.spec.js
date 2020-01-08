const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const defaultTheme = require("../../../../src/report/dot/defaultTheme.json");
const render = require("../../../../src/report/dot")("module");
const clusterless = require("./mocks/clusterless.json");
const bunchOfModules = require("./mocks/bunch-of-modules.json");
const orphanDeps = require("./mocks/orphan-deps.json");
const unresolvableDeps = require("./mocks/es6-unresolvable-deps.json");
const doNotFollowDeps = require("./mocks/do-not-follow-deps.json");
const prefixUri = require("./mocks/prefix-uri.json");
const prefixNonUri = require("./mocks/prefix-non-uri.json");
const bareTheme = require("./bareTheme.json");

const mockPath = path.join(__dirname, "mocks");
const clusterlessFixture = fs.readFileSync(
  path.join(mockPath, "clusterless.dot"),
  "utf8"
);
const unresolvableFixture = fs.readFileSync(
  path.join(mockPath, "es6-unresolvable-deps.dot"),
  "utf8"
);
const doNotFollowFixtureDefaultTheme = fs.readFileSync(
  path.join(mockPath, "do-not-follow-deps-default-theme.dot"),
  "utf8"
);
const doNotFollowFixture = fs.readFileSync(
  path.join(mockPath, "do-not-follow-deps.dot"),
  "utf8"
);
const orphanFixture = fs.readFileSync(
  path.join(mockPath, "orphan-deps-default-theme.dot"),
  "utf8"
);
const orphanFixtureBoring = fs.readFileSync(
  path.join(mockPath, "orphan-deps.dot"),
  "utf8"
);
const prefixUriFixture = fs.readFileSync(
  path.join(mockPath, "prefix-uri.dot"),
  "utf8"
);
const prefixNonUriFixture = fs.readFileSync(
  path.join(mockPath, "prefix-non-uri.dot"),
  "utf8"
);
const defaultColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/bunch-of-modules-default-theme.dot"),
  "utf8"
);
const bareColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/bunch-of-modules.dot"),
  "utf8"
);

describe("report/dot/moduleLevel reporter", () => {
  it("renders a dot - modules in the root don't come in a cluster", () => {
    expect(render(clusterless, bareTheme).output).to.deep.equal(
      clusterlessFixture
    );
  });

  it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
    expect(render(unresolvableDeps, bareTheme).output).to.deep.equal(
      unresolvableFixture
    );
  });

  it("renders a dot - bare theme matchesDoNotFollow NOT rendered as folders", () => {
    expect(render(doNotFollowDeps, bareTheme).output).to.deep.equal(
      doNotFollowFixture
    );
  });

  it("renders a dot - default color theme matchesDoNotFollow rendered as folders", () => {
    expect(render(doNotFollowDeps).output).to.deep.equal(
      doNotFollowFixtureDefaultTheme
    );
  });

  it("renders a dot - bare theme renders modules with module level transgression with NO severity deduced colors", () => {
    expect(render(orphanDeps, bareTheme).output).to.deep.equal(
      orphanFixtureBoring
    );
  });

  it("renders a dot - default theme renders modules with module level transgression with severity deduced colors", () => {
    expect(render(orphanDeps).output).to.deep.equal(orphanFixture);
  });

  it("renders a dot - uri prefix get concatenated", () => {
    expect(render(prefixUri, bareTheme).output).to.deep.equal(prefixUriFixture);
  });

  it("renders a dot - non-uri prefixes get path.posix.joined", () => {
    expect(render(prefixNonUri, bareTheme).output).to.deep.equal(
      prefixNonUriFixture
    );
  });

  it("richly colors modules when passed the default theme", () => {
    expect(render(bunchOfModules, defaultTheme).output).to.deep.equal(
      defaultColorFixture
    );
  });
  it("richly colors modules when passed no theme", () => {
    expect(render(bunchOfModules).output).to.deep.equal(defaultColorFixture);
  });
  it("colors boringly when passed a bare theme", () => {
    expect(render(bunchOfModules, bareTheme).output).to.deep.equal(
      bareColorFixture
    );
  });
});

/* eslint max-len: 0 */
