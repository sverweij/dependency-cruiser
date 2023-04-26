/** @type {import('../').IConfiguration} */
export default {
  extends: "../.dependency-cruiser.json",
  forbidden: [
    {
      name: "folder-SDP",
      scope: "folder",
      severity: "info",
      comment:
        "This folder dependency violates the 'stable dependencies' principle as it depends on a folder that is likely to be more prone to changes.",
      from: {},
      to: {
        moreUnstable: true,
      },
    },
    {
      name: "SDP",
      severity: "info",
      comment:
        "This dependency violates the 'stable dependencies' principle; it depends on a module that is likely to be more prone to changes than it is itself. Consider refactoring. ",
      from: {
        pathNot: "^test/",
      },
      to: {
        moreUnstable: true,
      },
    },
    {
      name: "no-folder-cycles",
      scope: "folder",
      severity: "warn",
      comment:
        "This folder is part of a circular relationship. You might want to refactor that a bit.",
      from: {},
      to: {
        circular: true,
      },
    },
  ],
  options: {
    cache: {
      folder: "node_modules/.cache/dependency-cruiser/show-metrics",
    },
    includeOnly: { path: "^(bin|src)" },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
      dot: {
        showMetrics: true,
        theme: {
          replace: false,
          graph: {
            splines: "ortho", // "ortho" looks nicer, but with the full graph takes long
          },
          modules: [
            {
              criteria: { source: "\\.c?js$" },
              attributes: {
                // fontcolor: "fuchsia",
                color: "transparent",
              },
            },
            {
              criteria: { matchesFocus: true },
              attributes: {
                fillcolor: "lime",
                penwidth: 2,
              },
            },
            {
              criteria: { matchesReaches: true },
              attributes: {
                fillcolor: "lime",
                penwidth: 2,
              },
            },
            {
              criteria: { matchesHighlight: true },
              attributes: {
                fillcolor: "yellow",
                penwidth: 2,
              },
            },
            {
              criteria: { source: "^src/cli" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: { source: "^src/config-utl" },
              attributes: { fillcolor: "#99ffff" },
            },
            {
              criteria: { source: "^src/report" },
              attributes: { fillcolor: "#ffccff" },
            },
            {
              criteria: { source: "^src/extract" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "^src/enrich" },
              attributes: { fillcolor: "#77eeaa" },
            },
            {
              criteria: { source: "^src/validate" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: { source: "^src/main" },
              attributes: { fillcolor: "#ffcccc" },
            },
            {
              criteria: { source: "^src/utl" },
              attributes: { fillcolor: "#cccccc" },
            },
            {
              criteria: { source: "^src/graph-utl" },
              attributes: { fillcolor: "#ffcccc" },
            },
            {
              criteria: {
                source: "^src/meta\\.js$|\\.template\\.js$|\\.schema\\.mjs$",
              },
              attributes: { style: "filled" },
            },
            {
              criteria: { source: "\\.json$" },
              attributes: { shape: "cylinder" },
            },
          ],
          dependencies: [
            {
              criteria: { "rules[0].severity": "error" },
              attributes: { fontcolor: "red", color: "red" },
            },
            {
              criteria: { "rules[0].severity": "warn" },
              attributes: {
                fontcolor: "orange",
                color: "orange",
              },
            },
            {
              criteria: { "rules[0].severity": "info" },
              attributes: { fontcolor: "blue", color: "blue" },
            },
            {
              criteria: { valid: false },
              attributes: { fontcolor: "red", color: "red" },
            },
            {
              criteria: { resolved: "^src/cli" },
              attributes: { color: "#0000ff77" },
            },
            {
              criteria: { resolved: "^src/config-utl" },
              attributes: { color: "#22999977" },
            },
            {
              criteria: { resolved: "^src/report" },
              attributes: { color: "#ff00ff77" },
            },
            {
              criteria: { resolved: "^src/extract" },
              attributes: { color: "#00770077" },
            },
            {
              criteria: { resolved: "^src/enrich" },
              attributes: { color: "#00776677" },
            },
            {
              criteria: { resolved: "^src/validate" },
              attributes: { color: "#0000ff77" },
            },
            {
              criteria: { resolved: "^src/main" },
              attributes: { color: "#77000077" },
            },
            {
              criteria: { resolved: "^src/utl" },
              attributes: { color: "#aaaaaa77" },
            },
            {
              criteria: { resolved: "^src/graph-utl" },
              attributes: { color: "#77000077" },
            },
          ],
        },
      },
    },
  },
};
