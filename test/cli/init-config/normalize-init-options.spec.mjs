import { expect } from "chai";
import normalizeInitOptions from "../../../src/cli/init-config/normalize-init-options.js";

describe("[U] cli/init-config/normalize-init-options", () => {
  it("If it's a mono repo, doesn't return a testLocation array", () => {
    expect(
      normalizeInitOptions({ isMonoRepo: true }).testLocation
    ).to.deep.equal([]);
  });

  it("If it's a mono repo, hasTestOutsideSource is false", () => {
    expect(
      normalizeInitOptions({ isMonoRepo: true }).hasTestsOutsideSource
    ).to.equal(false);
  });

  // TODO: add scenarios now covered by more integration/ e2e style tests
  // as well
});
