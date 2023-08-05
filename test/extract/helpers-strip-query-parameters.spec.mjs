import { strictEqual } from "node:assert";
import { stripQueryParameters } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - stripQueryParams", () => {
  it("leaves the empty string alone", () => {
    strictEqual(stripQueryParameters(""), "");
  });

  it("leaves paths without query parameters alone", () => {
    strictEqual(
      stripQueryParameters("normal/path/would/say.js"),
      "normal/path/would/say.js",
    );
  });

  it("strips query parameters from paths", () => {
    strictEqual(
      stripQueryParameters(
        "normal/path/would/say.js?these=are&query=parameters",
      ),
      "normal/path/would/say.js",
    );
  });
});
