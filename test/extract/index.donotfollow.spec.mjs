import { deepEqual, equal, notDeepEqual } from "node:assert/strict";
import { createRequireJSON } from "../backwards.utl.mjs";
import { normalizeCruiseOptions } from "#main/options/normalize.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import extract from "#extract/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("[I] extract/index - do not follow", () => {
  it("do not follow - doNotFollow.path", async () => {
    const lOptions = normalizeCruiseOptions({
      doNotFollow: {
        path: "donotfollowonceinthisfolder",
      },
    });
    const lResolveOptions = await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions,
    );
    const lResult = extract(
      ["./test/extract/__mocks__/donotfollow/index.js"],
      lOptions,
      lResolveOptions,
    );

    deepEqual(lResult, requireJSON("./__fixtures__/donotfollow.json"));
  });

  it("do not follow - doNotFollow.dependencyTypes", async () => {
    const lOptions = normalizeCruiseOptions({
      doNotFollow: {
        dependencyTypes: ["npm-no-pkg"],
      },
    });
    const lResolveOptions = await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions,
    );
    const lResult = extract(
      ["./test/extract/__mocks__/donotfollow-dependency-types/index.js"],
      lOptions,
      lResolveOptions,
    );

    deepEqual(
      lResult,
      requireJSON("./__fixtures__/donotfollow-dependency-types.json"),
    );
  });

  it("does not add duplicate stubs for repeated imports of a non-followable module", async () => {
    const lOptions = normalizeCruiseOptions({
      parser: "tsc",
      doNotFollow: {
        path: "duplicate-stub",
      },
    });
    const lResolveOptions = await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions,
    );
    const lResult = extract(
      [
        "./test/extract/__mocks__/donotfollow-duplicate-stubs/mixed-imports.ts",
        "./test/extract/__mocks__/donotfollow-duplicate-stubs/same-kind-imports.ts",
      ],
      lOptions,
      lResolveOptions,
    );

    const lStubModules = lResult.filter(({ source }) =>
      source.includes("/node_modules/duplicate-stub/"),
    );
    const lMixedImportsModule = lResult.find(({ source }) =>
      source.endsWith("/mixed-imports.ts"),
    );
    const lSameKindImportsModule = lResult.find(({ source }) =>
      source.endsWith("/same-kind-imports.ts"),
    );

    equal(lStubModules.length, 1);
    equal(lMixedImportsModule.dependencies.length, 2);
    equal(
      new Set(lMixedImportsModule.dependencies.map(({ resolved }) => resolved))
        .size,
      1,
    );
    notDeepEqual(
      lMixedImportsModule.dependencies[0].dependencyTypes,
      lMixedImportsModule.dependencies[1].dependencyTypes,
    );
    equal(lSameKindImportsModule.dependencies.length, 1);
  });
});

/* eslint n/global-require: 0*/
