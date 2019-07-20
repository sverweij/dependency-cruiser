const semver   = require("semver");
const $package = require("../../package.json");

module.exports = function validateNodeEnv(pNodeVersion) {
    const VERSION_ERR = `\nERROR: This node version (${pNodeVersion}) is not supported. dependency-cruiser
       follows the node.js release cycle and runs on these node versions:
       ${$package.engines.node}
       See https://nodejs.org/en/about/releases/ for details.

`;

    if (!semver.satisfies(pNodeVersion, $package.engines.node)) {
        throw new Error(VERSION_ERR);
    }
};
