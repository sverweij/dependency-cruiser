import { createRequireJSON } from "../backwards.utl.mjs";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const tsFixtures = requireJSON("./fixtures/ts.json");

describe("extract/getDependencies - TypeScript - ", () => {
  tsFixtures.forEach((pFixture) => runFixture(pFixture, "acorn"));
  tsFixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  tsFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
