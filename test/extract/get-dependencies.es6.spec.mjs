import { createRequireJSON } from "../backwards.utl.mjs";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const es6Fixtures = requireJSON("./__fixtures__/es6.json");

/* eslint-disable mocha/no-top-level-hooks */

describe("[I] extract/getDependencies - ES6 - ", () => {
  es6Fixtures.forEach((pFixture) => runFixture(pFixture, "acorn"));
  es6Fixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  es6Fixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
