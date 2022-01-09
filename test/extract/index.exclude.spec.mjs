import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import extract from "../../src/extract/index.js";
import normalize from "../../src/main/options/normalize.js";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.js";
import { createRequireJSON } from "../backwards.utl.mjs";

use(chaiJSONSchema);

const requireJSON = createRequireJSON(import.meta.url);

describe("[I] extract/index - exclude", () => {
  it("exclude - exclude.path", () => {
    const lOptions = normalize.normalizeCruiseOptions({
      exclude: {
        path: "dynamic-to-circular",
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/__mocks__/exclude/path/es/src"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      requireJSON("./__mocks__/exclude/path/es/output.json")
    );
  });

  it("exclude - exclude.dynamic", () => {
    const lOptions = normalize.normalizeCruiseOptions({
      exclude: {
        dynamic: true,
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/__mocks__/exclude/dynamic/es/src"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      requireJSON("./__mocks__/exclude/dynamic/es/output.json")
    );
  });
});

/* eslint node/global-require: 0*/
