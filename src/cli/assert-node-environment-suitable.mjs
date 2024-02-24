import satisfies from "semver/functions/satisfies.js";
import meta from "#meta.cjs";

export default function assertNodeEnvironmentSuitable(pNodeVersion) {
  // not using default parameter here because the check should run
  // run on node 4 as well
  const lNodeVersion = pNodeVersion || process.versions.node;
  const lVersionError = `\nERROR: Your node version (${lNodeVersion}) is not supported. dependency-cruiser
       follows the node.js release cycle and runs on these node versions:
       ${meta.engines.node}
       See https://nodejs.org/en/about/releases/ for details.

`;

  if (!satisfies(lNodeVersion, meta.engines.node)) {
    throw new Error(lVersionError);
  }
}
