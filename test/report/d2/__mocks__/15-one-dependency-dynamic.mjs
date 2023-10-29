/** @type {import('../../../../types/dependency-cruiser').ICruiseResult} */
export default {
  modules: [
    {
      source: "aap/noot/mies.js",
      dependencies: [
        {
          resolved: "aap/noot/zus.js",
          module: "#noot/zus.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dynamic: true,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          moduleSystem: "es6",
          dependencyTypes: ["aliased", "aliased-subpath-import", "local"],
        },
      ],
    },
    {
      source: "aap/noot/zus.js",
      dependencies: [],
    },
  ],
  summary: {
    optionsUsed: {},
  },
};
