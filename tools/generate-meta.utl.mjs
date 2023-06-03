/* eslint-disable no-console */
import prettier from "prettier";

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

console.log(prettier.format(lGeneratedSource, { parser: "babel" }));
