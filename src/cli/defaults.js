module.exports = {
  OLD_DEFAULT_RULES_FILE_NAME: ".dependency-cruiser.json",
  RULES_FILE_NAME_SEARCH_ARRAY: [
    ".dependency-cruiser.json",
    ".dependency-cruiser.js",
    ".dependency-cruiser.cjs",
  ],
  DEFAULT_BASELINE_FILE_NAME: ".dependency-cruiser-known-violations.json",
  DEFAULT_CONFIG_FILE_NAME: ".dependency-cruiser.js",
  WEBPACK_CONFIG: "webpack.config.js",
  TYPESCRIPT_CONFIG: "tsconfig.json",
  BABEL_CONFIG: ".babelrc",
  PACKAGE_MANIFEST: "package.json",
  OUTPUT_TYPE: "err",
  OUTPUT_TO: "-",
  CACHE_FOLDER: "node_modules/.cache/dependency-cruiser",
};
