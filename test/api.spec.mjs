// eslint disable because import/no-unresolved,node/no-missing-import don't
// know about (local) module imports yet
/* eslint-disable import/no-unresolved,node/no-missing-import */
import { expect } from "chai";
import satisfies from "semver/functions/satisfies.js";
import dependencyCruiser from "dependency-cruiser";
import extractBabelConfig from "dependency-cruiser/config-utl/extract-babel-config";
import extractDepcruiseConfig from "dependency-cruiser/config-utl/extract-depcruise-config";
import extractTsConfig from "dependency-cruiser/config-utl/extract-ts-config";
import extractWebpackResolveConfig from "dependency-cruiser/config-utl/extract-webpack-resolve-config";

/*
 * 'exports' in package.json only work in some of the latest node versions.
 */
if (satisfies(process.versions.node, "^12.19 || >=14.7")) {
  describe("[E] api from esm (on node ^12.19 || >= 14.7)", () => {
    it("exposes dependency-cruiser main with some functions", () => {
      expect(typeof dependencyCruiser).to.equal("object");
      expect(typeof dependencyCruiser.cruise).to.equal("function");
      expect(typeof dependencyCruiser.format).to.equal("function");
      expect(Array.isArray(dependencyCruiser.allExtensions)).to.equal(true);
      expect(typeof dependencyCruiser.getAvailableTranspilers).to.equal(
        "function"
      );
    });

    it("exposes an extract-babel-config function", () => {
      expect(typeof extractBabelConfig).to.equal("function");
    });

    it("exposes an extract-depcruise-config function", () => {
      expect(typeof extractDepcruiseConfig).to.equal("function");
    });

    it("exposes an extract-ts-config function", () => {
      expect(typeof extractTsConfig).to.equal("function");
    });

    it("exposes an extract-webpack-resolve-config function", () => {
      expect(typeof extractWebpackResolveConfig).to.equal("function");
    });
  });
}
