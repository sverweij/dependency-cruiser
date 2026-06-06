import { deepEqual } from "node:assert/strict";
import { createRequireJSON } from "../backwards.utl.mjs";
import { normalizeCruiseOptions } from "#main/options/normalize.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import extract from "#extract/index.mjs";

const requireJSON = createRequireJSON(import.meta.url);

describe("[I] extract/index - exclude", () => {
  it("exclude - exclude.path", async () => {
    const lOptions = normalizeCruiseOptions({
      exclude: {
        path: "dynamic-to-circular",
      },
    });
    const lResolveOptions = await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions,
    );
    const lResult = extract(
      ["./test/extract/__mocks__/exclude/path/es/src"],
      lOptions,
      lResolveOptions,
    );

    deepEqual(lResult, requireJSON("./__mocks__/exclude/path/es/output.json"));
  });

  it("exclude - exclude.dynamic", async () => {
    const lOptions = normalizeCruiseOptions({
      exclude: {
        dynamic: true,
      },
    });
    const lResolveOptions = await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions,
    );
    const lResult = extract(
      ["./test/extract/__mocks__/exclude/dynamic/es/src"],
      lOptions,
      lResolveOptions,
    );

    deepEqual(
      lResult,
      requireJSON("./__mocks__/exclude/dynamic/es/output.json"),
    );
  });
});

/* eslint n/global-require: 0*/
