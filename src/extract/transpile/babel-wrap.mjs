import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

const babel = await tryImport("@babel/core", meta.supportedTranspilers.babel);

export default {
  isAvailable: () => babel !== false,

  version: () => `@babel/core@${babel.version}`,

  transpile: (pSource, pFileName, pTranspileOptions = {}) =>
    babel.transformSync(pSource, {
      ...(pTranspileOptions.babelConfig || {}),
      // Some babel plugins assume a piece of source to have a filename.
      // See https://github.com/sverweij/dependency-cruiser/issues/410
      filename: pFileName,
    }).code,
};
