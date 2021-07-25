export default [
  {
    source: "./snok.js",
    orphan: false,
    dependencies: [
      {
        resolved: "snak.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./snak.js",
        moduleSystem: "cjs",
        matchesDoNotFollow: false,
      },
    ],
  },
  {
    source: "snak.js",
    orphan: false,
    dependencies: [],
  },
];
