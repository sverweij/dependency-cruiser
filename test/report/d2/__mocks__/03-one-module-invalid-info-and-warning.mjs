/** @type {import('../../../../types/dependency-cruiser').ICruiseResult} */
export default {
  modules: [
    {
      source: "aap/noot/mies.js",
      valid: false,
      orphan: true,
      rules: [
        {
          severity: "ignore",
          name: "ignored-rule",
          from: {
            path: "aap/noot/mies.js",
          },
          to: {
            path: "aap/noot/mies.js",
          },
        },
        {
          severity: "info",
          name: "no-orphans",
          from: {
            path: "aap/noot/mies.js",
          },
          to: {
            path: "aap/noot/mies.js",
          },
        },
        {
          severity: "warn",
          name: "some-other-rule",
          from: {
            path: "aap/noot/mies.js",
          },
          to: {
            path: "aap/noot/mies.js",
          },
        },
        {
          severity: "ignore",
          name: "some-other-rule-again",
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
