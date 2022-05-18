import { createRequireJSON } from "../backwards.utl.mjs";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const tsFixtures = requireJSON("./__fixtures__/ts.json");

describe("[I] extract/getDependencies - TypeScript - ", () => {
  tsFixtures.forEach((pFixture) => runFixture(pFixture, "acorn"));
  tsFixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  tsFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
