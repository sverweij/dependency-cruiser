import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

/**
 * @type {import("@astrojs/compiler/sync") | false}
 */
const astro = await tryImport(
  "@astrojs/compiler/sync",
  meta.supportedTranspilers["@astrojs/compiler"],
);

/**
 * @type {Record<string, string | Record<string,string>> | false}
 */
const astroPackageInfo = await tryImport(
  "@astrojs/compiler/package.json",
  meta.supportedTranspilers["@astrojs/compiler"],
);

/**
 *
 * @param {import("./meta").ITranspilerWrapper} pTsxWrapper
 *
 * @returns {import("./meta").ITranspilerWrapper["transpile"]}
 */
function getTranspiler(pTsxWrapper) {
  return (pSource, pFileName, pTranspilerOptions) => {
    const lTSXCode = astro.convertToTSX(pSource, {
      filename: pFileName,
      sourcemap: false,
      includeStyles: false,
    }).code;

    let lJSCode = lTSXCode;
    if (pTsxWrapper.isAvailable()) {
      lJSCode = pTsxWrapper.transpile(lTSXCode, "dummy.tsx", {
        ...pTranspilerOptions,
        tsConfig: {
          ...(pTranspilerOptions?.tsConfig || {}),
          options: {
            ...(pTranspilerOptions?.tsConfig?.options || {}),
            // https://github.com/withastro/astro/blob/dacebaf8df6293558091a18123aed966e4e57415/packages/astro/tsconfigs/base.json#L28-L29
            jsx: "preserve",
          },
        },
      });
    }
    return lJSCode;
  };
}

/**
 *
 * @param {import("./meta").ITranspilerWrapper} pTsxWrapper
 *
 * @returns {import("./meta").ITranspilerWrapper}
 */
export default function astroWrap(pTsxWrapper) {
  return {
    isAvailable: () => astro !== false,
    version: () =>
      `@astrojs/compiler@${astroPackageInfo?.version ?? "unknown"}`,
    transpile: getTranspiler(pTsxWrapper),
  };
}
