import { resolve } from "node:path";
import typescript from "#utl/typescript-facade.mjs";

// This RE matches
// - filename.d.ts (, .cts, .mts), but also
// - filename.d.something.ts (, .cts., .mts).
// That second one seems a bit odd, but it _is_ possible; see for instance
// https://www.typescriptlang.org/tsconfig/#allowArbitraryExtensions
// (and I guess, but haven't seen this confirmed in the field or documentation
// that it could be possible to have a declaration file variant of
// https://www.typescriptlang.org/tsconfig/#moduleSuffixes)
const DECLARATION_FILE_RE = /[.]d([.][^./\\]+)?([.][cm]?ts)$/;

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

function getTranspilableFileName(pFileName) {
  if (typeof pFileName !== "string") {
    return undefined;
  }
  // Declaration files (.d.ts, .d.mts, .d.cts, .d.css.ts) get their
  // non-declaration name, because TypeScript emits nothing for a declaration
  // file and throws "Debug Failure. Output generation failed".
  return resolve(pFileName).replace(DECLARATION_FILE_RE, "$1$2");
}

export default function typescriptWrap(pFlavor) {
  return {
    isAvailable: () => typescript !== false,

    version: () => `typescript@${typescript.version}`,

    transpile: (pSource, pFileName, pTranspileOptions = {}) =>
      typescript.transpileModule(pSource, {
        ...(pTranspileOptions.tsConfig || {}),
        fileName: getTranspilableFileName(pFileName),
        compilerOptions: getCompilerOptions(
          pFlavor,
          pTranspileOptions.tsConfig || {},
        ),
      }).outputText,
  };
}
