import tryImport from "semver-try-require";
import meta from "#meta.cjs";

const typescript = await tryImport(
  "typescript",
  meta.supportedTranspilers.typescript,
);

function getCompilerOptions(pFlavor, pTSConfig) {
  let lCompilerOptions = {};

  if (pFlavor === "tsx") {
    lCompilerOptions.jsx = "react";
  }

  if (pFlavor === "esm") {
    // see https://www.typescriptlang.org/docs/handbook/esm-node.html
    lCompilerOptions.module = "nodenext";
    // when we're doing something with esm (so cts, mts extensions) we can
    // assume TypeScript >=4.7 - which supports target es2022 - which should
    // be easier (and hence we assume faster) to transpile
    lCompilerOptions.target = "es2022";
  }

  return {
    // target: "es2022" should also be OK - but we don't know which version of
    // the TypeScript compiler we're using, so for we keep this for backwards
    // compatibility.
    target: "es2015",
    ...lCompilerOptions,
    ...(pTSConfig?.options ?? {}),
  };
}

export default function typescriptWrap(pFlavor) {
  return {
    isAvailable: () => typescript !== false,

    transpile: (pSource, _pFileName, pTranspileOptions = {}) =>
      typescript.transpileModule(pSource, {
        ...(pTranspileOptions.tsConfig || {}),
        compilerOptions: getCompilerOptions(
          pFlavor,
          pTranspileOptions.tsConfig || {},
        ),
      }).outputText,
  };
}
