/* eslint-disable node/no-missing-require */
/* eslint-disable node/global-require */
const { expect } = require("chai");
const semver = require("semver");

/*
 * 'exports' in package.json only work in some of the latest node versions.
 */
if (semver.satisfies(process.versions.node, "^12.19 || >=14.7")) {
  describe("[E] api from commonjs (on node ^12.19 || >= 14.7)", () => {
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("exposes dependency-cruiser main with some functions", () => {
      const dependencyCruiser = require("dependency-cruiser");
      expect(typeof dependencyCruiser).to.equal("object");
      expect(typeof dependencyCruiser.cruise).to.equal("function");
      expect(typeof dependencyCruiser.format).to.equal("function");
      expect(Array.isArray(dependencyCruiser.allExtensions)).to.equal(true);
      expect(typeof dependencyCruiser.getAvailableTranspilers).to.equal(
        "function"
      );
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("exposes an extract-babel-config function", () => {
      const extractBabelConfig = require("dependency-cruiser/config-utl/extract-babel-config");
      expect(typeof extractBabelConfig).to.equal("function");
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("exposes an extract-depcruise-config function", () => {
      const extractDepcruiseConfig = require("dependency-cruiser/config-utl/extract-depcruise-config");
      expect(typeof extractDepcruiseConfig).to.equal("function");
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("exposes an extract-ts-config function", () => {
      const extractTsConfig = require("dependency-cruiser/config-utl/extract-ts-config");
      expect(typeof extractTsConfig).to.equal("function");
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("exposes an extract-webpack-resolve-config function", () => {
      const extractWebpackResolveConfig = require("dependency-cruiser/config-utl/extract-webpack-resolve-config");
      expect(typeof extractWebpackResolveConfig).to.equal("function");
    });
  });
}
