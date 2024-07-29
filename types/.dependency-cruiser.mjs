import baseConfig from "../.dependency-cruiser.mjs";

/** @type {import('../').IConfiguration} */
export default {
  ...baseConfig,
  options: {
    tsPreCompilationDeps: true,
    extraExtensionsToScan: [],
    exclude: ["[.]dependency-cruiser[.]mjs"],
    reporterOptions: {
      dot: {
        collapsePattern: ["node_modules/[^/]+"],
        theme: {
          graph: { splines: "ortho" },
          modules: [
            {
              criteria: { source: "\\.ts$" },
              attributes: { color: "red", fontcolor: "red" },
            },
          ],
        },
      },
    },
  },
};
