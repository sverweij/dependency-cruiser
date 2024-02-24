const { EOL } = require("node:os");
const isEmpty = require("lodash/isEmpty");
const tryRequire = require("semver-try-require");
const meta = require("#meta.cjs");

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
    meta.supportedTranspilers["vue-template-compiler"],
  );

  if (lCompiler === false) {
    lCompiler = tryRequire(
      "@vue/compiler-sfc",
      meta.supportedTranspilers["@vue/compiler-sfc"],
    );
    lIsVue3 = true;
  }

  return { lCompiler, lIsVue3 };
}

const { lCompiler: vueTemplateCompiler, lIsVue3: isVue3 } =
  getVueTemplateCompiler();

// eslint-disable-next-line complexity
function vue3Transpile(pSource) {
  const lParsedComponent = vueTemplateCompiler.parse(pSource);
  const lErrors = lParsedComponent?.errors;

  if (!isEmpty(lErrors)) {
    return "";
  }

  const lScriptContent = lParsedComponent?.descriptor?.script?.content ?? "";
  const lScriptSetupContent =
    lParsedComponent?.descriptor?.scriptSetup?.content ?? "";

  if (lScriptContent && lScriptSetupContent) {
    return lScriptContent + EOL + lScriptSetupContent;
  }

  return lScriptContent || lScriptSetupContent;
}

function vue2Transpile(pSource) {
  return vueTemplateCompiler.parseComponent(pSource)?.script?.content ?? "";
}

module.exports = {
  isAvailable: () => vueTemplateCompiler !== false,
  transpile: (pSource) =>
    isVue3 ? vue3Transpile(pSource) : vue2Transpile(pSource),
};
