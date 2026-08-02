/* oxlint-disable no-console */
import { format } from "prettier";

function getStream(pStream) {
  return new Promise((pResolve, pReject) => {
    let lInputAsString = "";

    pStream
      .on("data", (pChunk) => {
        lInputAsString += pChunk;
      })
      .on("error", (pError) => {
        pReject(pError);
      })
      .on("end", () => {
        pResolve(lInputAsString);
      });
  });
}

if (!process.permission) {
  process.stderr.write(
    "This script only runs with node\'s permission model.\n\n",
  );
  process.exit(1);
}
// drop is not available in older node versions, like ^22, yet
if (Object.hasOwn(process.permission, "drop")) {
  process.permission.drop("fs.read", "..");
  process.permission.drop("fs.read", "/");
  process.permission.drop("fs.write", "..");
  process.permission.drop("fs.write", "/");
}

const lJSONAsString = await getStream(process.stdin);
const $package = JSON.parse(lJSONAsString);
const lGeneratedSource = `/* generated - don't edit */
  module.exports = {
    version: "${$package.version}",
    engines: {
      node: "${$package.engines.node}",
    },
    supportedTranspilers: ${JSON.stringify($package.supportedTranspilers)}
  }`;

console.log(await format(lGeneratedSource, { parser: "babel" }));
