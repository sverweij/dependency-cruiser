/** @type {import('dependency-cruiser').IConfiguration} */
/** @type {import('../../..').IConfiguration} */
module.exports = {
  options: {
    tsPreCompilationDeps: true,
    baseDir: "src",

    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
        theme: {
          graph: {
            splines: "ortho",
            rankdir: "TD",
          },
          modules: [
            {
              criteria: { source: "^common" },
              attributes: { fillcolor: "#cccccc" },
            },
          ],
          dependencies: [
            {
              criteria: { "rules[0].severity": "error" },
              attributes: { fontcolor: "red", color: "red" },
            },
            {
              criteria: { "rules[0].severity": "warn" },
              attributes: { fontcolor: "orange", color: "orange" },
            },
            {
              criteria: { "rules[0].severity": "info" },
              attributes: { fontcolor: "blue", color: "blue" },
            },
          ],
        },
      },
    },
  },
};
