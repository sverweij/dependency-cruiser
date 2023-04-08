import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import extract from "../../src/extract/index.mjs";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";

use(chaiJSONSchema);

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
      lOptions
    );
    const lResult = extract(
      ["./test/extract/__mocks__/donotfollow/index.js"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      requireJSON("./__fixtures__/donotfollow.json")
    );
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
      lOptions
    );
    const lResult = extract(
      ["./test/extract/__mocks__/donotfollow-dependency-types/index.js"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      requireJSON("./__fixtures__/donotfollow-dependency-types.json")
    );
  });
});

/* eslint node/global-require: 0*/
