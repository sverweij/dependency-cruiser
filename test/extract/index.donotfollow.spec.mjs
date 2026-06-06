import { deepEqual } from "node:assert/strict";
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
});

/* eslint n/global-require: 0*/
