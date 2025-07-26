import { doesNotThrow, throws } from "node:assert/strict";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";

describe("[U] cli/validateNodeEnv", () => {
  it("throws when an older and unsupported node version is passed", () => {
    throws(() => {
      assertNodeEnvironmentSuitable("6.0.0");
    });
  });

  it("throws when a newer but unsupported node version is passed", () => {
    throws(() => {
      assertNodeEnvironmentSuitable("9.0.0");
    });
  });

  it("doesn't throw when an empty node version is passed (assuming test is run on a supported platform)", () => {
    doesNotThrow(() => {
      assertNodeEnvironmentSuitable("");
    });
  });

  it("doesn't throw when a null node version is passed (assuming test is run on a supported platform)", () => {
    doesNotThrow(() => {
      assertNodeEnvironmentSuitable(null);
    });
  });

  it("doesn't throw when an undefined node version is passed (assuming test is run on a supported platform)", () => {
    doesNotThrow(() => {
      assertNodeEnvironmentSuitable();
    });
  });

  it("doesn't throw when no node version is passed (assuming this test is run on a supported platform ...)", () => {
    doesNotThrow(() => {
      assertNodeEnvironmentSuitable();
    });
  });

  it("doesn't throw when a supported node version is passed", () => {
    doesNotThrow(() => {
      assertNodeEnvironmentSuitable("22.0.0");
    });
  });
});
