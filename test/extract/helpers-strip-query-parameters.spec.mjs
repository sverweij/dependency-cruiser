import { equal } from "node:assert/strict";
import { stripQueryParameters } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - stripQueryParams", () => {
  it("leaves the empty string alone", () => {
    equal(stripQueryParameters(""), "");
  });

  it("leaves paths without query parameters alone", () => {
    equal(
      stripQueryParameters("normal/path/would/say.js"),
      "normal/path/would/say.js",
    );
  });

  it("strips query parameters from paths", () => {
    equal(
      stripQueryParameters(
        "normal/path/would/say.js?these=are&query=parameters",
      ),
      "normal/path/would/say.js",
    );
  });
});
