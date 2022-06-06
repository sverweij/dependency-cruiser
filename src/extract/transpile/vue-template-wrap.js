const { EOL } = require("os");
const isEmpty = require("lodash/isEmpty");
const get = require("lodash/get");
const tryRequire = require("semver-try-require");
const { supportedTranspilers } = require("../../../src/meta.js");

/*
 * vue-template-compiler was replaced by @vue/compiler-sfc for Vue3.
 *
 * if your project uses Vue3, then trying to require vue-template-compiler will
 * cause an incompatibility error - so try @vue/compiler-sfc (which is Vue3's
 * version of vue-template-compiler) if the first one fails
 */
function getVueTemplateCompiler() {
  let lIsVue3 = false;

  let lCompiler = tryRequire(
    "vue-template-compiler",
    supportedTranspilers["vue-template-compiler"]
  );

  if (lCompiler === false) {
    lCompiler = tryRequire(
      "@vue/compiler-sfc",
      supportedTranspilers["@vue/compiler-sfc"]
    );
    lIsVue3 = true;
  }

  return { lCompiler, lIsVue3 };
}

const { lCompiler: vueTemplateCompiler, lIsVue3: isVue3 } =
  getVueTemplateCompiler();

function vue3Transpile(pSource) {
  const parsedComponent = vueTemplateCompiler.parse(pSource);
  const errors = get(parsedComponent, "errors");

  if (!isEmpty(errors)) {
    return "";
  }

  const scriptContent = get(parsedComponent, "descriptor.script.content", "");
  const scriptSetupContent = get(
    parsedComponent,
    "descriptor.scriptSetup.content",
    ""
  );

  if (scriptContent && scriptSetupContent) {
    return scriptContent + EOL + scriptSetupContent;
  }

  return scriptContent || scriptSetupContent;
}

function vue2Transpile(pSource) {
  return get(vueTemplateCompiler.parseComponent(pSource), "script.content", "");
}

module.exports = {
  isAvailable: () => vueTemplateCompiler !== false,
  transpile: (pSource) =>
    isVue3 ? vue3Transpile(pSource) : vue2Transpile(pSource),
};
