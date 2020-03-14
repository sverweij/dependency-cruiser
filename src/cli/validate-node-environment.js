const semver = require("semver");
const $package = require("../../package.json");

module.exports = function validateNodeEnvironment(pNodeVersion) {
  // not using default parameter here because the check should run
  // run on node 4 as well
  const lNodeVersion = pNodeVersion || process.versions.node;
  const VERSION_ERR = `\nERROR: Your node version (${lNodeVersion}) is not supported. dependency-cruiser
       follows the node.js release cycle and runs on these node versions:
       ${$package.engines.node}
       See https://nodejs.org/en/about/releases/ for details.

`;

  if (!semver.satisfies(lNodeVersion, $package.engines.node)) {
    throw new Error(VERSION_ERR);
  }
};
