// eslint disable because import/no-unresolved,node/no-missing-import don't
// know about (local) module imports yet
/* eslint-disable import/no-unresolved,node/no-missing-import */
import { strictEqual } from "node:assert";
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
      strictEqual(typeof dependencyCruiser, "object");
      strictEqual(typeof dependencyCruiser.cruise, "function");
      strictEqual(typeof dependencyCruiser.format, "function");
      strictEqual(Array.isArray(dependencyCruiser.allExtensions), true);
      strictEqual(typeof dependencyCruiser.getAvailableTranspilers, "function");
    });

    it("exposes an extract-babel-config function", () => {
      strictEqual(typeof extractBabelConfig, "function");
    });

    it("exposes an extract-depcruise-config function", () => {
      strictEqual(typeof extractDepcruiseConfig, "function");
    });

    it("exposes an extract-ts-config function", () => {
      strictEqual(typeof extractTsConfig, "function");
    });

    it("exposes an extract-webpack-resolve-config function", () => {
      strictEqual(typeof extractWebpackResolveConfig, "function");
    });
  });
}
