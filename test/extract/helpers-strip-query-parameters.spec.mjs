import { expect } from "chai";
import { stripQueryParameters } from "../../src/extract/helpers.mjs";

describe("[U] extract/helpers - stripQueryParams", () => {
  it("leaves the empty string alone", () => {
    expect(stripQueryParameters("")).to.equal("");
  });

  it("leaves paths without query parameters alone", () => {
    expect(stripQueryParameters("normal/path/would/say.js")).to.equal(
      "normal/path/would/say.js"
    );
  });

  it("strips query parameters from paths", () => {
    expect(
      stripQueryParameters(
        "normal/path/would/say.js?these=are&query=parameters"
      )
    ).to.equal("normal/path/would/say.js");
  });
});
