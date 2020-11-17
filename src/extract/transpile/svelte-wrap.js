const tryRequire = require("semver-try-require");
const _get = require("lodash/get");

const svelte = tryRequire(
  "svelte",
  require("../../../package.json").supportedTranspilers.svelte
);

// eslint-disable-next-line import/order, node/no-unpublished-require, node/global-require
const svelteCompile = svelte && require("svelte/compiler");

module.exports = (pTsWrapper) => ({
  isAvailable: () => svelteCompile !== false,
  transpile: async (pSource, pTranspileOptions = {}) => {
    const optionallyCompileTsToJsInSvelte = await svelteCompile.preprocess(
      pSource,
      {
        script: ({ content, attributes }) => {
          if (attributes.lang !== "ts" || !pTsWrapper.isAvailable()) {
            return { code: content };
          }
          const compiledToTsFromJs = pTsWrapper.transpile(content, {
            ...pTranspileOptions,
            tsConfig: {
              ..._get(pTranspileOptions, "tsConfig", {}),
              options: {
                ..._get(pTranspileOptions, "tsConfig.options", {}),
                importsNotUsedAsValues: "preserve",
                jsx: "preserve",
              },
            },
          });
          return { code: compiledToTsFromJs };
        },
      }
    );
    const compiledSvelteCode = svelteCompile.compile(
      optionallyCompileTsToJsInSvelte.code
    );
    return compiledSvelteCode.js.code;
  },
});
