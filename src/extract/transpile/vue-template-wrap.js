const _get = require("lodash/get");
const tryRequire = require("semver-try-require");
const { supportedTranspilers } = require("../../../src/meta.js");

const vueTemplateCompiler = tryRequire(
  "vue-template-compiler",
  supportedTranspilers["vue-template-compiler"]
);

module.exports = {
  isAvailable: () => vueTemplateCompiler !== false,

  transpile: (pSource) =>
    _get(vueTemplateCompiler.parseComponent(pSource), "script.content", ""),
};
