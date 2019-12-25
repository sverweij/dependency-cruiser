const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const defaultTheme = require("../../../../src/report/dot/common/defaultTheme.json");
const render = require("../../../../src/report/dot/moduleLevel");
const clusterless = require("./mocks/clusterless.json");
const bunchOfModules = require("./mocks/bunch-of-modules.json");
const orphanDeps = require("./mocks/orphan-deps.json");
const unresolvableDeps = require("./mocks/es6-unresolvable-deps.json");
const doNotFollowDeps = require("./mocks/do-not-follow-deps.json");
const prefixUri = require("./mocks/prefix-uri.json");
const prefixNonUri = require("./mocks/prefix-non-uri.json");
const boringTheme = require("./boringTheme.json");

const mockPath = path.join(__dirname, "mocks");
const clusterlessFixture = fs.readFileSync(
  path.join(mockPath, "clusterless.dot"),
  "utf8"
);
const unresolvableFixture = fs.readFileSync(
  path.join(mockPath, "es6-unresolvable-deps.dot"),
  "utf8"
);
const doNotFollowFixture = fs.readFileSync(
  path.join(mockPath, "do-not-follow.dot"),
  "utf8"
);
const doNotFollowFixtureBoring = fs.readFileSync(
  path.join(mockPath, "do-not-follow-boring.dot"),
  "utf8"
);
const orphanFixture = fs.readFileSync(
  path.join(mockPath, "orphan-deps.dot"),
  "utf8"
);
const orphanFixtureBoring = fs.readFileSync(
  path.join(mockPath, "orphan-deps-boring.dot"),
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
  path.join(__dirname, "mocks/bunch-of-modules.dot"),
  "utf8"
);
const boringColorFixture = fs.readFileSync(
  path.join(__dirname, "mocks/bunch-of-modules-boring.dot"),
  "utf8"
);

describe("report/dot/moduleLevel reporter", () => {
  it("renders a dot - modules in the root don't come in a cluster", () => {
    expect(render(clusterless, boringTheme).output).to.deep.equal(
      clusterlessFixture
    );
  });

  it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
    expect(render(unresolvableDeps, boringTheme).output).to.deep.equal(
      unresolvableFixture
    );
  });

  it("renders a dot - boringScheme matchesDoNotFollow NOT rendered as folders", () => {
    expect(render(doNotFollowDeps, boringTheme).output).to.deep.equal(
      doNotFollowFixtureBoring
    );
  });

  it("renders a dot - default color scheme matchesDoNotFollow rendered as folders", () => {
    expect(render(doNotFollowDeps).output).to.deep.equal(doNotFollowFixture);
  });

  it("renders a dot - boringScheme renders modules with module level transgression with NO severity deduced colors", () => {
    expect(render(orphanDeps, boringTheme).output).to.deep.equal(
      orphanFixtureBoring
    );
  });

  it("renders a dot - default color schme renders modules with module level transgression with severity deduced colors", () => {
    expect(render(orphanDeps).output).to.deep.equal(orphanFixture);
  });

  it("renders a dot - uri prefix get concatenated", () => {
    expect(render(prefixUri, boringTheme).output).to.deep.equal(
      prefixUriFixture
    );
  });

  it("renders a dot - non-uri prefixes get path.posix.joined", () => {
    expect(render(prefixNonUri, boringTheme).output).to.deep.equal(
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
  it("colors boringly when passed the boring color scheme", () => {
    expect(render(bunchOfModules, boringTheme).output).to.deep.equal(
      boringColorFixture
    );
  });
});

/* eslint max-len: 0 */
