import { createRequireJSON } from "../backwards.utl.mjs";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const tsTypesFixtures = requireJSON("./__fixtures__/ts-types.json");

describe("[I] extract/getDependencies - TypeScript - ", () => {
  // swc doesn't seem to recognize type only imports yet (or we don't
  // pick it from the AST yet - TODO: investigate that)
  // tsTypesFixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  tsTypesFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
