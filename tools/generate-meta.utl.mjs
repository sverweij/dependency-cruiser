import prettier from "prettier";
import getStream from "get-stream";

getStream(process.stdin).then((pJSONAsString) => {
  const $package = JSON.parse(pJSONAsString);
  const lGeneratedSource = `/* generated - don't edit */
  
  module.exports = {
      version: "${$package.version}",
      engines: {
        node: "${$package.engines.node}",
      },
      supportedTranspilers: ${JSON.stringify($package.supportedTranspilers)}
      }`;
  console.log(prettier.format(lGeneratedSource, { parser: "babel" }));
});
