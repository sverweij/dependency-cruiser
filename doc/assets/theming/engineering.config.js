module.exports = {
  extends: "./base.config.js",
  options: {
    reporterOptions: {
      dot: {
        theme: {
          replace: false,
          graph: {
            bgcolor: "dodgerblue",
            color: "white",
            fontcolor: "white",
            fillcolor: "transparent",
            splines: "ortho",
          },
          node: {
            color: "white",
            fillcolor: "#ffffff33",
            fontcolor: "white",
          },
          edge: {
            arrowhead: "vee",
            arrowsize: "0.5",
            penwidth: "1.0",
            color: "white",
            fontcolor: "white",
          },
          modules: [
            {
              criteria: { source: "\\.json$" },
              attributes: {
                shape: "cylinder",
                fillcolor: "#ffffff33:#ffffff88",
              },
            },
            {
              criteria: { coreModule: true },
              attributes: {
                color: "white",
                fillcolor: "#ffffff33",
                fontcolor: "white",
              },
            },
          ],
          dependencies: [
            {
              criteria: { resolved: "\\.json$" },
              attributes: { arrowhead: "obox" },
            },
          ],
        },
      },
    },
  },
};
