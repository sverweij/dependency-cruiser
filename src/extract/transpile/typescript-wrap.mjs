import typescript from "#utl/typescript-facade.mjs";

function getCompilerOptions(pFlavor, pTSConfig) {
  const lCompilerOptions = {};

  if (pFlavor === "tsx") {
    lCompilerOptions.jsx = typescript.JsxEmit.React;
  }

  if (pFlavor === "esm") {
    // see https://www.typescriptlang.org/docs/handbook/esm-node.html
    lCompilerOptions.module = typescript.ModuleKind.NodeNext;
    // when we're doing something with esm (so cts, mts extensions) we can
    // assume TypeScript >=4.7 - which supports target es2022 - which should
    // be easier (and hence we assume faster) to transpile
    lCompilerOptions.target = typescript.ScriptTarget.ES2022;
  }

  return {
    // target: "es2022" should also be OK - but we don't know which version of
    // the TypeScript compiler we're using, so for we keep this for backwards
    // compatibility.
    target: typescript.ScriptTarget.ES2015,
    ...lCompilerOptions,
    ...(pTSConfig?.options ?? {}),
  };
}

export default function typescriptWrap(pFlavor) {
  return {
    isAvailable: () => typescript !== false,

    version: () => `typescript@${typescript.version}`,

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
