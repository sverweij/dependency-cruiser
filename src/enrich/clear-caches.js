const indexedGraph = require("./derive/indexed-graph");

module.exports = function clearCaches() {
  indexedGraph.clearCache();
};
