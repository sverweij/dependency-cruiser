import baseConfig from "../../.dependency-cruiser.mjs";

/** @type {import('../../').IConfiguration} */
export default {
  ...baseConfig,
  options: {
    exclude: ["[.]dependency-cruiser[.]mjs"],
    prefix:
      "https://github.com/sverweij/dependency-cruiser/blob/main/tools/schema/",
    extraExtensionsToScan: [],
    reporterOptions: {
      dot: {
        collapsePattern: ["node_modules/[^/]+"],
        theme: {
          graph: {
            splines: "ortho",
            nodesep: "0.2",
            ranksep: "0.2",
          },
          modules: [
            {
              criteria: { source: "\\.schema\\.mjs$" },
              attributes: {
                color: "darkgreen",
                fillcolor: "darkgreen",
                fontcolor: "#ffffcc",
              },
            },
            {
              criteria: { source: "\\-type\\.mjs$" },
              attributes: {
                fillcolor: "white",
                fontcolor: "black",
                color: "black",
                shape: "underline",
              },
            },
          ],
        },
      },
    },
  },
};
