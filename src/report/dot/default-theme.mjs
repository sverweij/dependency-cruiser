export default {
  graph: {
    rankdir: "LR",
    splines: "true",
    overlap: "false",
    nodesep: "0.16",
    ranksep: "0.18",
    fontname: "Helvetica-bold",
    fontsize: "9",
    style: "rounded,bold,filled",
    fillcolor: "#ffffff",
    compound: "true",
  },
  node: {
    shape: "box",
    style: "rounded, filled",
    height: "0.2",
    color: "black",
    fillcolor: "#ffffcc",
    fontcolor: "black",
    fontname: "Helvetica",
    fontsize: 9,
  },
  edge: {
    arrowhead: "normal",
    arrowsize: "0.6",
    penwidth: "2.0",
    color: "#00000033",
    fontname: "Helvetica",
    fontsize: "9",
  },
  modules: [
    {
      criteria: { consolidated: true },
      attributes: { shape: "box3d" },
    },
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
      criteria: { coreModule: true },
      attributes: { color: "grey", fontcolor: "grey" },
    },
    {
      criteria: { source: "node_modules" },
      attributes: { fillcolor: "#c40b0a1a", fontcolor: "#c40b0a" },
    },
    {
      criteria: { matchesDoNotFollow: true },
      attributes: { shape: "folder" },
    },
    {
      criteria: { orphan: true },
      attributes: { fillcolor: "#ccffcc" },
    },
    {
      criteria: { source: "\\.json$" },
      attributes: { fillcolor: "#ffee44" },
    },
    {
      criteria: { source: "\\.jsx$" },
      attributes: { fillcolor: "#ffff77" },
    },
    {
      criteria: { source: "\\.vue$" },
      attributes: { fillcolor: "#41f083" },
    },
    {
      criteria: { source: "\\.([cm]?ts)$" },
      attributes: { fillcolor: "#ddfeff" },
    },
    {
      criteria: { source: "\\.tsx$" },
      attributes: { fillcolor: "#bbfeff" },
    },
    {
      criteria: { source: "\\.svelte$" },
      attributes: { fillcolor: "#febbff" },
    },
    {
      criteria: { source: "(\\.coffee|\\.litcoffee|\\.coffee\\.md)$" },
      attributes: { fillcolor: "#eeccaa" },
    },
    {
      criteria: { source: "(\\.csx|\\.cjsx)$" },
      attributes: { fillcolor: "#eebb77" },
    },
    {
      criteria: { source: "\\.ls$/g" },
      attributes: { fillcolor: "pink" },
    },
    {
      criteria: { matchesHighlight: true },
      attributes: {
        fillcolor: "lime",
        penwidth: 2,
      },
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
      criteria: { dynamic: true },
      attributes: { style: "dashed" },
    },
    {
      criteria: { circular: true },
      attributes: { arrowhead: "normalnoneodot" },
    },
    {
      criteria: {
        dependencyTypes: [
          "pre-compilation-only",
          "triple-slash-type-reference",
          "type-import",
          "type-only",
        ],
      },
      attributes: { arrowhead: "onormal", penwidth: "1.0" },
    },
    {
      criteria: { dependencyTypes: ["export"] },
      attributes: { arrowhead: "inv" },
    },
    {
      criteria: { dependencyTypes: "core" },
      attributes: { style: "dashed", penwidth: "1.0" },
    },
    {
      criteria: { dependencyTypes: "npm" },
      attributes: { penwidth: "1.0" },
    },
  ],
};
