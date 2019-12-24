module.exports = {
  options: {
    doNotFollow: {
      dependencyTypes: [
        "npm",
        "npm-dev",
        "npm-optional",
        "npm-peer",
        "npm-bundled",
        "npm-no-pkg"
      ]
    },
    includeOnly: "^src/main",
    exclude: "/filesAndDirs/"
  }
};
