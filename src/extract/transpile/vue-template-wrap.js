const _get = require("lodash/get");
const tryRequire = require("semver-try-require");
const vueTemplateCompiler = tryRequire(
  "vue-template-compiler",
  require("../../../package.json").supportedTranspilers["vue-template-compiler"]
);

module.exports = {
  isAvailable: () => vueTemplateCompiler !== false,

  transpile: (pSource) =>
    _get(vueTemplateCompiler.parseComponent(pSource), "script.content", ""),
};
