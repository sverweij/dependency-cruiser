import prettier from "prettier";
import getStream from "get-stream";

getStream(process.stdin).then((pJSONAsString) => {
  const $package = JSON.parse(pJSONAsString);
  const woink = `/* generated - don't edit */
  
  module.exports = {
      version: "${$package.version}",
      engines: {
        node: "${$package.engines.node}",
      },
      supportedTranspilers: ${JSON.stringify($package.supportedTranspilers)}
      }`;
  console.log(prettier.format(woink, { parser: "babel" }));
});
