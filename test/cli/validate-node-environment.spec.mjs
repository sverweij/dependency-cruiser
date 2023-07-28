import { doesNotThrow, throws } from "node:assert";
import validateNodeEnvironment from "../../src/cli/validate-node-environment.mjs";

describe("[U] cli/validateNodeEnv", () => {
  it("throws when an older and unsupported node version is passed", () => {
    throws(() => {
      validateNodeEnvironment("6.0.0");
    });
  });

  it("throws when a newer but unsupported node version is passed", () => {
    throws(() => {
      validateNodeEnvironment("9.0.0");
    });
  });

  it("doesn't throw when an empty node version is passed (assuming test is run on a supported platform)", () => {
    doesNotThrow(() => {
      validateNodeEnvironment("");
    });
  });

  it("doesn't throw when a null node version is passed (assuming test is run on a supported platform)", () => {
    doesNotThrow(() => {
      validateNodeEnvironment(null);
    });
  });

  it("doesn't throw when an undefined node version is passed (assuming test is run on a supported platform)", () => {
    doesNotThrow(() => {
      validateNodeEnvironment();
    });
  });

  it("doesn't throw when no node version is passed (assuming this test is run on a supported platform ...)", () => {
    doesNotThrow(() => {
      validateNodeEnvironment();
    });
  });

  it("doesn't throw when a supported node version is passed", () => {
    doesNotThrow(() => {
      validateNodeEnvironment("18.0.0");
    });
  });
});
