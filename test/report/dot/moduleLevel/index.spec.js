const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const render = require("../../../../src/report/dot/moduleLevel");
const deps = require("./mocks/cjs-no-dependency-valid.json");
const orphanDeps = require("./mocks/orphan-deps.json");
const unresolvableDeps = require("./mocks/es6-unresolvable-deps.json");
const doNotFollowDeps = require("./mocks/do-not-follow-deps.json");
const prefixUri = require("./mocks/prefix-uri.json");
const prefixNonUri = require("./mocks/prefix-non-uri.json");
const boringScheme = require("./boringTheme.json");

const mockPath = path.join(__dirname, "mocks");
const clusterlessFixture = fs.readFileSync(
  path.join(mockPath, "clusterless.dot"),
  "utf8"
);
const unresolvableFixture = fs.readFileSync(
  path.join(mockPath, "unresolvable.dot"),
  "utf8"
);
const doNotFollowFixture = fs.readFileSync(
  path.join(mockPath, "donotfollow.dot"),
  "utf8"
);
const doNotFollowFixtureBoring = fs.readFileSync(
  path.join(mockPath, "donotfollow-boring.dot"),
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

describe("report/dot/moduleLevel reporter", () => {
  it("renders a dot - modules in the root don't come in a cluster", () => {
    expect(render(deps, boringScheme).output).to.deep.equal(clusterlessFixture);
  });

  it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
    expect(render(unresolvableDeps, boringScheme).output).to.deep.equal(
      unresolvableFixture
    );
  });

  it("renders a dot - boringScheme matchesDoNotFollow NOT rendered as folders", () => {
    expect(render(doNotFollowDeps, boringScheme).output).to.deep.equal(
      doNotFollowFixtureBoring
    );
  });

  it("renders a dot - default color scheme matchesDoNotFollow rendered as folders", () => {
    expect(render(doNotFollowDeps).output).to.deep.equal(doNotFollowFixture);
  });

  it("renders a dot - boringScheme renders modules with module level transgression with NO severity deduced colors", () => {
    expect(render(orphanDeps, boringScheme).output).to.deep.equal(
      orphanFixtureBoring
    );
  });

  it("renders a dot - default color schme renders modules with module level transgression with severity deduced colors", () => {
    expect(render(orphanDeps).output).to.deep.equal(orphanFixture);
  });

  it("renders a dot - uri prefix get concatenated", () => {
    expect(render(prefixUri, boringScheme).output).to.deep.equal(
      prefixUriFixture
    );
  });

  it("renders a dot - non-uri prefixes get path.posix.joined", () => {
    expect(render(prefixNonUri, boringScheme).output).to.deep.equal(
      prefixNonUriFixture
    );
  });
});

/* eslint max-len: 0 */
