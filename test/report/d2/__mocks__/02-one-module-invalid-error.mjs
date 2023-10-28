/** @type {import('../../../../types/dependency-cruiser').ICruiseResult} */
export default {
  modules: [
    {
      source: "aap/noot/mies.js",
      valid: false,
      orphan: true,
      rules: [
        {
          severity: "error",
          name: "no-orphans",
          from: {
            path: "aap/noot/mies.js",
          },
          to: {
            path: "aap/noot/mies.js",
          },
        },
      ],
      dependencies: [],
    },
  ],
  summary: {
    optionsUsed: {},
  },
};
