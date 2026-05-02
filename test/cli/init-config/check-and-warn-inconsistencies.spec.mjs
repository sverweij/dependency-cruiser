import { deepEqual } from "node:assert/strict";
import {
  WritableTestStream,
  UnCalledWritableTestStream,
} from "../writable-test-stream.utl.mjs";
import { checkAndWarnInconsistencies } from "#cli/init-config/check-and-warn-inconsistencies.mjs";

function noAvailableTranspilers() {
  return [];
}

function availableTranspilersTSOn() {
  return [
    {
      name: "typescript",
      version: "*",
      available: true,
      currentVersion: "6.0.6",
    },
  ];
}

function availableTranspilersBabelOn() {
  return [
    {
      name: "babel",
      version: "*",
      available: true,
      currentVersion: "6.0.3",
    },
  ];
}

describe("[I] cli/init-config/check-and-warn-inconsistencies", () => {
  it("remains silent when no typescript features are used (and typescript is installed)", () => {
    checkAndWarnInconsistencies(
      {},
      new UnCalledWritableTestStream(),
      availableTranspilersTSOn,
    );
  });
  it("remains silent when no typescript features are used (and typescript is NOT installed)", () => {
    checkAndWarnInconsistencies(
      {},
      new UnCalledWritableTestStream(),
      noAvailableTranspilers,
    );
  });
  it("remains silent when typescript features are used (and typescript is installed)", () => {
    checkAndWarnInconsistencies(
      { usesTypeScript: true },
      new UnCalledWritableTestStream(),
      availableTranspilersTSOn,
    );
  });
  it("prints stuff on stderr when typescript features are used (and typescript is NOT installed)", () => {
    checkAndWarnInconsistencies(
      { usesTypeScript: true },
      new WritableTestStream(/TypeScript compiler isn't installed/),
      noAvailableTranspilers,
    );
  });

  it("remains silent when no babel features are used (and babel is installed)", () => {
    checkAndWarnInconsistencies(
      {},
      new UnCalledWritableTestStream(),
      availableTranspilersBabelOn,
    );
  });
  it("remains silent when no babel features are used (and babel is NOT installed)", () => {
    checkAndWarnInconsistencies(
      {},
      new UnCalledWritableTestStream(),
      noAvailableTranspilers,
    );
  });
  it("remains silent when babel features are used (and babel is installed)", () => {
    checkAndWarnInconsistencies(
      { babelConfig: ".babelrc.json5" },
      new UnCalledWritableTestStream(),
      availableTranspilersBabelOn,
    );
  });
  it("prints stuff on stderr when babel features are used (and babel is NOT installed)", () => {
    checkAndWarnInconsistencies(
      { babelConfig: "babylon.5" },
      new WritableTestStream(/Babel isn't installed/),
      noAvailableTranspilers,
    );
  });
  it("prints warnings for both babel and typescript if options for both are inconsistent", () => {
    checkAndWarnInconsistencies(
      { usesTypeScript: true, babelConfig: "babylon.5" },
      new WritableTestStream(/typescript.+babel/s),
      noAvailableTranspilers,
    );
  });
  it("doesn't change the passed init options when everything is hunky-dory", () => {
    const lInitOptions = { usesTypeScript: false };
    const lInitOptionsAfterCheck = checkAndWarnInconsistencies(
      lInitOptions,
      new UnCalledWritableTestStream(),
      availableTranspilersTSOn,
    );
    deepEqual(lInitOptionsAfterCheck, lInitOptions);
  });
  it("doesn't change the passed init options when something is amiss", () => {
    const lInitOptions = { usesTypeScript: true };
    const lInitOptionsAfterCheck = checkAndWarnInconsistencies(
      lInitOptions,
      new WritableTestStream(/typescript/),
      noAvailableTranspilers,
    );
    deepEqual(lInitOptionsAfterCheck, lInitOptions);
  });
});
