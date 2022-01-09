module.exports = {
  extends: "./dependency-cruiser-options.js",
  allowedSeverity: "info",
  allowed: [
    {
      // Dead wood check: no-unreachable-from-root
      from: {
        path: "^src/index\\.js$",
      },
      to: {
        path: "^src",
        reachable: true,
      },
    },
  ],
};
