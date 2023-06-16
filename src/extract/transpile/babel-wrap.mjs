import meta from "../../meta.js";
import tryImport from "./try-import.cjs";

const babel = await tryImport("@babel/core", meta.supportedTranspilers.babel);

export default {
  isAvailable: () => babel !== false,
  transpile: (pSource, pFileName, pTranspileOptions = {}) =>
    babel.transformSync(pSource, {
      ...(pTranspileOptions.babelConfig || {}),
      // Some babel plugins assume a piece of source to have a filename.
      // See https://github.com/sverweij/dependency-cruiser/issues/410
      filename: pFileName,
    }).code,
};
