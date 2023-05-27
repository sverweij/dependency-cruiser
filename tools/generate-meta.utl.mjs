import prettier from "prettier";
import getStream from "get-stream";

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
