const expect = require("chai").expect;
const stripQueryParams = require("../../../src/extract/utl/strip-query-params");

describe("extract/utl/stripQueryParams", () => {
  it("leaves the empty string alone", () => {
    expect(stripQueryParams("")).to.equal("");
  });

  it("leaves paths without query parameters alone", () => {
    expect(stripQueryParams("normal/path/would/say.js")).to.equal(
      "normal/path/would/say.js"
    );
  });

  it("strips query parameters from paths", () => {
    expect(
      stripQueryParams("normal/path/would/say.js?these=are&query=parameters")
    ).to.equal("normal/path/would/say.js");
  });
});
