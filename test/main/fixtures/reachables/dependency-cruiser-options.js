module.exports = {
  options: {
    includeOnly: "src",
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",

        theme: {
          graph: {
            splines: "ortho",
          },
          modules: [
            {
              criteria: { source: "^src/functionality" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: { source: "^src/db" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "^src/utilities" },
              attributes: { fillcolor: "#ffccff" },
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
            {
              criteria: { resolved: "^src/functionality" },
              attributes: { color: "#0000ff77" },
            },
            {
              criteria: { resolved: "^src/db" },
              attributes: { color: "#00770077" },
            },
            {
              criteria: { resolved: "^src/utilities" },
              attributes: { color: "#77007777" },
            },
          ],
        },
      },
      archi: {
        collapsePattern: "^src/[^/]+",
      },
    },
  },
};
