import { readFileSync } from "node:fs";
import { expect } from "chai";
import validate from "../../../src/main/rule-set/validate.mjs";

function shouldBarfWithMessage(pRulesFile, pMessage) {
  expect(() => {
    validate(JSON.parse(readFileSync(pRulesFile, "utf8")));
  }).to.throw(pMessage);
}

function shouldBeOK(pRulesFile) {
  const lRulesObject = JSON.parse(readFileSync(pRulesFile, "utf8"));

  expect(validate(lRulesObject)).to.deep.equal(lRulesObject);
}

describe("[I] main/rule-set/validate - regular", () => {
  it("barfs on an invalid rules file", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.not-a-valid-rulesfile.json",
      "The supplied configuration is not valid: data must NOT have additional properties."
    );
  });

  it("accepts an empty 'options' object", () => {
    shouldBeOK("./test/validate/__mocks__/rules.empty-options-section.json");
  });

  it("accepts a 'webpackConfig' config", () => {
    shouldBeOK(
      "./test/validate/__mocks__/rules.options-section-webpack-config.json"
    );
  });

  it("accepts a 'dependencyTypes' with value 'aliased'", () => {
    shouldBeOK(
      "./test/validate/__mocks__/rules.no-aliased-dependency-types.json"
    );
  });

  it("accepts some command line options in a 'options' object", () => {
    shouldBeOK("./test/validate/__mocks__/rules.options-section.json");
  });

  it("accepts the 'extends' attribute (string)", () => {
    shouldBeOK("./test/validate/__mocks__/extends/extending.as.string.json");
  });

  it("accepts the 'extends' attribute (array of strings)", () => {
    shouldBeOK("./test/validate/__mocks__/extends/extending.as.array.json");
  });

  it("bails out on non-strings in the 'extends' attribute (number)", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/extends/extending.as.number.json",
      "The supplied configuration is not valid: data/extends must be string, data/extends must be " +
        "array, data/extends must match exactly one schema in oneOf."
    );
  });
});

describe("[I] main/rule-set/validate - regexp safety checks", () => {
  it("bails out on scary regexps in paths", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.scary-regex.json",
      'rule {"from":{"path":".+"},"to":{"path":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
    );
  });

  it("bails out on scary regexps in paths - also when they're arrays", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.scary-regex-array.json",
      'rule {"from":{"path":".+"},"to":{"path":["(.+)*","something else"]}} has an unsafe regular expression. Bailing out.\n'
    );
  });

  it("is ok about regexps in paths that just have a bunch of repetition but no scary star-height", () => {
    shouldBeOK("./test/validate/__mocks__/rules.ok-regex-just-repeating.json");
  });

  it("bails out on scary regexps in pathNots", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.scary-regex-in-pathnot.json",
      'rule {"from":{"path":".+"},"to":{"pathNot":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
    );
  });

  it("bails out on scary regexps in licenses", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.scary-regex-in-license.json",
      'rule {"from":{},"to":{"license":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
    );
  });

  it("bails out on scary regexps in licenseNots", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.scary-regex-in-licensenot.json",
      'rule {"from":{},"to":{"licenseNot":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
    );
  });

  it("bails out on scary regexps in options.doNotFollow", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.options-section-scary-regex-do-not-follow.json",
      "The pattern '(.*)*' will probably run very slowly - cowardly refusing to run.\n"
    );
  });

  it("bails out on scary regexps in options.exclude", () => {
    shouldBarfWithMessage(
      "./test/validate/__mocks__/rules.options-section-scary-regex-exclude.json",
      "The pattern '(.*)*' will probably run very slowly - cowardly refusing to run.\n"
    );
  });
});
