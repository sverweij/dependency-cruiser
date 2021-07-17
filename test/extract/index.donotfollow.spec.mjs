import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import extract from "../../src/extract/index.js";
import normalize from "../../src/main/options/normalize.js";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.js";
import { createRequireJSON } from "../backwards.utl.mjs";

use(chaiJSONSchema);

const requireJSON = createRequireJSON(import.meta.url);

describe("extract/index - do not follow", () => {
  it("do not follow - doNotFollow.path", () => {
    const lOptions = normalize.normalizeCruiseOptions({
      doNotFollow: {
        path: "donotfollowonceinthisfolder",
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/donotfollow/index.js"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(requireJSON("./fixtures/donotfollow.json"));
  });

  it("do not follow - doNotFollow.dependencyTypes", () => {
    const lOptions = normalize.normalizeCruiseOptions({
      doNotFollow: {
        dependencyTypes: ["npm-no-pkg"],
      },
    });
    const lResolveOptions = normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      lOptions
    );
    const lResult = extract(
      ["./test/extract/fixtures/donotfollow-dependency-types/index.js"],
      lOptions,
      lResolveOptions
    );

    expect(lResult).to.deep.equal(
      requireJSON("./fixtures/donotfollow-dependency-types.json")
    );
  });
});

/* eslint node/global-require: 0*/
