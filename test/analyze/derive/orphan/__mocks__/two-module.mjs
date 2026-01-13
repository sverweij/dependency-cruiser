export default [
  {
    source: "./snok.js",
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
    dependencies: [],
  },
];
