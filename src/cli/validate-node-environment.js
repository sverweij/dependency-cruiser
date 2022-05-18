const satisfies = require("semver/functions/satisfies.js");
const { engines } = require("../../src/meta.js");

module.exports = function validateNodeEnvironment(pNodeVersion) {
  // not using default parameter here because the check should run
  // run on node 4 as well
  const lNodeVersion = pNodeVersion || process.versions.node;
  const lVersionError = `\nERROR: Your node version (${lNodeVersion}) is not supported. dependency-cruiser
       follows the node.js release cycle and runs on these node versions:
       ${engines.node}
       See https://nodejs.org/en/about/releases/ for details.

`;

  if (!satisfies(lNodeVersion, engines.node)) {
    throw new Error(lVersionError);
  }
};
