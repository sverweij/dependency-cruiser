const fs = require("fs");
const expect = require("chai").expect;
const deps = require("../../fixtures/cjs-no-dependency-valid.json");
const unresolvableDeps = require("../../fixtures/es6-unresolvable-deps.json");
const doNotFollowDeps = require("../../fixtures/do-not-follow-deps.json");
const orphanDeps = require("../../fixtures/orphan-deps.json");
const prefixUri = require("../../fixtures/prefix-uri.json");
const prefixNonUri = require("../../fixtures/prefix-non-uri.json");
const render = require("../../../../src/report/dot/moduleLevel");
const boringScheme = require("./boringModuleColorScheme.json");

const clusterlessFixture = fs.readFileSync(
  "test/report/fixtures/clusterless.dot",
  "utf8"
);
const unresolvableFixture = fs.readFileSync(
  "test/report/fixtures/unresolvable.dot",
  "utf8"
);
const doNotFollowFixture = fs.readFileSync(
  "test/report/fixtures/donotfollow.dot",
  "utf8"
);
const orphanFixture = fs.readFileSync(
  "test/report/fixtures/orphan-deps.dot",
  "utf8"
);
const prefixUriFixture = fs.readFileSync(
  "test/report/fixtures/prefix-uri.dot",
  "utf8"
);
const prefixNonUriFixture = fs.readFileSync(
  "test/report/fixtures/prefix-non-uri.dot",
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

  it("renders a dot - matchesDoNotFollow rendered as folders", () => {
    expect(render(doNotFollowDeps, boringScheme).output).to.deep.equal(
      doNotFollowFixture
    );
  });

  it("renders a dot - renders modules with module level transgression with a severity deduced color", () => {
    expect(render(orphanDeps, boringScheme).output).to.deep.equal(
      orphanFixture
    );
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
