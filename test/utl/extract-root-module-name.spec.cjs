const { equal } = require("node:assert/strict");
const extractRootModuleName = require("#utl/extract-root-module-name.cjs");

describe("[U] extract-root-module-name", () => {
  it("returns the local module name when passed that (same folder)", () => {
    equal(extractRootModuleName("./hoi-pippeloi"), "./hoi-pippeloi");
    equal(extractRootModuleName("./hoi/pippeloi"), "./hoi/pippeloi");
  });
  it("returns the local module name when passed that (one ore more folders up)", () => {
    equal(extractRootModuleName("../hoi-pippeloi"), "../hoi-pippeloi");
    equal(extractRootModuleName("../hoi/pippeloi"), "../hoi/pippeloi");
    equal(extractRootModuleName("../../hoi/pippeloi"), "../../hoi/pippeloi");
  });
  it("returns . when passed current folder", () => {
    equal(extractRootModuleName("."), ".");
    equal(extractRootModuleName("./"), "./");
  });
  it("returns .. when passed one folder up", () => {
    equal(extractRootModuleName(".."), "..");
    equal(extractRootModuleName("../"), "../");
  });
  it("returns the module name when passed an absolute module name", () => {
    equal(extractRootModuleName("/"), "/");
    equal(extractRootModuleName("/Users/root/hello"), "/Users/root/hello");
  });
  it("returns undefined when passed an empty string", () => {
    // eslint-disable-next-line no-undefined
    equal(extractRootModuleName(""), undefined);
  });
  it("returns the module name when there's no special shizzle", () => {
    equal(extractRootModuleName("yodash"), "yodash");
  });
  it("returns the root module when passed a submodule", () => {
    equal(extractRootModuleName("yodash/ship-ahoi"), "yodash");
  });
  it("returns the scope + module when passed scoped module", () => {
    equal(extractRootModuleName("@yodash/yodash"), "@yodash/yodash");
  });
  it("returns the scope + module when passed submodule of a scoped module", () => {
    equal(extractRootModuleName("@yodash/yodash/alaaf"), "@yodash/yodash");
  });
});
