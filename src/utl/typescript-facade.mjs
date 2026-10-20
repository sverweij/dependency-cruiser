/* eslint-disable security/detect-object-injection */
import { dirname, resolve } from "node:path";
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

/**
 * One interface over the two flavors of the typescript compiler
 * - typescript <7: the compiler written in typescript, with its API
 *   available in-process on the module itself.
 * - typescript >=7.1: the native compiler. Its API (typescript/sync and
 *   typescript/ast) talks to a separate process running the compiler.
 *
 * @typedef {object} ITypeScriptFacade
 * @property {boolean} isNative - true when this is the native (>=7.1) compiler
 * @property {string} version - version of the typescript compiler
 * @property {Record<string, any>} SyntaxKind - the compiler's SyntaxKind enum
 * @property {Record<string, any>} ScriptTarget - the compiler's ScriptTarget enum
 * @property {Record<string, any>} ModuleKind - the compiler's ModuleKind enum
 * @property {Record<string, any>} JsxEmit - the compiler's JsxEmit enum
 * @property {(pNode: any, pCallback: (pNode: any) => void) => void} forEachChild -
 *           calls pCallback for each child node of pNode
 * @property {(pNode: any) => boolean} isReparsed - true for nodes the
 *           compiler synthesized from something else (e.g. jsdoc in javascript)
 * @property {(pFileName: string, pSource: string) => any} createSourceFile -
 *           parses pSource into an AST
 * @property {(pSource: string, pOptions?: {compilerOptions?: Record<string, any>, fileName?: string}) => {outputText: string}} transpileModule -
 *           transpiles pSource to javascript
 * @property {(pFileName: string) => {config?: any, error?: any}} readConfigFile -
 *           reads the tsconfig pFileName
 * @property {(pConfig: any, pFileName: string) => import("typescript").ParsedCommandLine} parseJsonConfigFileContent -
 *           parses (and flattens) the tsconfig pConfig that was read from pFileName
 * @property {(pDiagnostics: readonly any[]) => string} formatDiagnostics -
 *           formats pDiagnostics into a human readable string
 */

const FIRST_NATIVE_MAJOR_VERSION = 7;

/**
 * @param {typeof import("typescript")} pTypeScript
 * @returns {ITypeScriptFacade}
 */
function getClassicFacade(pTypeScript) {
  const lFormatDiagnosticsHost = {
    getCanonicalFileName(pFileName) {
      let lReturnValue = pFileName.toLowerCase();

      // depends on the platform which branch is taken, hence the c8 ignore
      /* c8 ignore start */
      if (pTypeScript?.sys?.useCaseSensitiveFileNames ?? false) {
        lReturnValue = pFileName;
      }
      /* c8 ignore stop */
      return lReturnValue;
    },
    getCurrentDirectory() {
      return process.cwd();
    },
    getNewLine() {
      return "\n";
    },
  };

  return {
    isNative: false,
    version: pTypeScript.version,
    SyntaxKind: pTypeScript.SyntaxKind,
    ScriptTarget: pTypeScript.ScriptTarget,
    ModuleKind: pTypeScript.ModuleKind,
    JsxEmit: pTypeScript.JsxEmit,
    forEachChild: (pNode, pCallback) => {
      pTypeScript.forEachChild(pNode, pCallback);
    },
    isReparsed: () => false,
    createSourceFile: (pFileName, pSource) =>
      pTypeScript.createSourceFile(
        pFileName,
        pSource,
        pTypeScript.ScriptTarget.Latest,
        false,
      ),
    transpileModule: (pSource, pOptions) =>
      pTypeScript.transpileModule(pSource, pOptions),
    readConfigFile: (pFileName) =>
      pTypeScript.readConfigFile(pFileName, pTypeScript.sys.readFile),
    parseJsonConfigFileContent: (pConfig, pFileName) =>
      pTypeScript.parseJsonConfigFileContent(
        pConfig,
        pTypeScript.sys,
        dirname(resolve(pFileName)),
        {},
        pFileName,
      ),
    formatDiagnostics: (pDiagnostics) =>
      pTypeScript.formatDiagnostics(pDiagnostics, lFormatDiagnosticsHost),
  };
}

// The code below only runs with the native compiler (or without any
// typescript compiler). The regular test (& coverage) run uses the classic
// one, so c8 can't see this is covered by the run against the native one.
/* c8 ignore start */
/**
 * The classic compiler's transpileModule accepts both names ("commonjs") and
 * values (1) for options that are enums. The native one only takes values,
 * so this lets its own tsconfig parser translate any names into values.
 * Options it doesn't recognize (anymore) are left out.
 *
 * @param {any} pAPI - instance of the native compiler's API
 * @returns {(pCompilerOptions?: Record<string, any>) => Record<string, any>}
 */
function getCompilerOptionsNormalizer(pAPI) {
  /** @type {Map<string, Record<string, any>>} */
  const lCache = new Map();

  return (pCompilerOptions = {}) => {
    const lStringOptions = Object.fromEntries(
      Object.entries(pCompilerOptions).filter(
        ([, pValue]) => typeof pValue === "string",
      ),
    );
    const lStringOptionKeys = Object.keys(lStringOptions);

    if (lStringOptionKeys.length === 0) {
      return pCompilerOptions;
    }
    const lCacheKey = JSON.stringify(lStringOptions);

    if (!lCache.has(lCacheKey)) {
      lCache.set(
        lCacheKey,
        pAPI.parseJsonConfigFileContent(
          { compilerOptions: lStringOptions, files: [] },
          { configDirectory: process.cwd() },
        ).options,
      );
    }
    const lParsedOptions = lCache.get(lCacheKey);

    return Object.fromEntries(
      Object.entries(pCompilerOptions)
        .map(([pKey, pValue]) =>
          lStringOptionKeys.includes(pKey)
            ? [pKey, lParsedOptions[pKey]]
            : [pKey, pValue],
        )
        .filter(([, pValue]) => pValue !== undefined),
    );
  };
}

/**
 * @param {{version: string}} pTypeScript
 * @returns {Promise<ITypeScriptFacade>}
 * @throws {Error} when the native compiler's binary isn't available (e.g.
 *         on unsupported platforms, or when optional dependencies weren't
 *         installed)
 */
async function getNativeFacade(pTypeScript) {
  const [lSync, lAST] = await Promise.all([
    import("typescript/sync"),
    import("typescript/ast"),
  ]);
  // this starts the compiler process. That process doesn't keep node from
  // exiting and stops when node does, so there's no need to close it.
  const lAPI = new lSync.API({ cwd: process.cwd() });
  const normalizeCompilerOptions = getCompilerOptionsNormalizer(lAPI);

  return {
    isNative: true,
    version: pTypeScript.version,
    SyntaxKind: lAST.SyntaxKind,
    ScriptTarget: lAST.ScriptTarget,
    ModuleKind: lSync.ModuleKind,
    JsxEmit: lSync.JsxEmit,
    // nodes created by anything else than the native compiler (e.g. ASTs
    // from json) don't have the forEachChild method. They're treated as
    // having no children.
    forEachChild: (pNode, pCallback) => {
      pNode.forEachChild?.(pCallback);
    },
    isReparsed: (pNode) =>
      // flags is a bit field
      // oxlint-disable-next-line no-bitwise
      ((pNode.flags ?? 0) & lAST.NodeFlags.Reparsed) !== 0,
    createSourceFile: (pFileName, pSource) => {
      const lRetainedSourceFile = lAPI.createSourceFile(pFileName, pSource);
      // the source file is already copied over from the compiler process,
      // so it stays usable after releasing it there
      lRetainedSourceFile.dispose();
      return lRetainedSourceFile.sourceFile;
    },
    transpileModule: (pSource, pOptions) =>
      lAPI.transpileModule(pSource, {
        compilerOptions: normalizeCompilerOptions(pOptions?.compilerOptions),
        fileName: pOptions?.fileName,
      }),
    // The compiler process resolves relative paths against the directory it
    // was started in - which can differ from the current one => resolve
    // here
    readConfigFile: (pFileName) => lAPI.readConfigFile(resolve(pFileName)),
    parseJsonConfigFileContent: (pConfig, pFileName) =>
      lAPI.parseJsonConfigFileContent(pConfig, {
        configFileName: resolve(pFileName),
      }),
    formatDiagnostics: (pDiagnostics) =>
      lSync.formatDiagnostics(pDiagnostics, lAPI),
  };
}

/**
 * @param {any} pTypeScript - the typescript module, or false if it isn't available
 * @returns {Promise<ITypeScriptFacade|false>}
 */
async function getFacade(pTypeScript) {
  if (!pTypeScript) {
    return false;
  }
  if (Number.parseInt(pTypeScript.version, 10) >= FIRST_NATIVE_MAJOR_VERSION) {
    try {
      return await getNativeFacade(pTypeScript);
    } catch {
      return false;
    }
  }
  /* c8 ignore stop */
  return getClassicFacade(pTypeScript);
}

/**
 * The typescript compiler behind a facade that hides the differences
 * between the classic (<7) and the native (>=7.1) compiler, or false when
 * no supported version of the typescript compiler is available.
 *
 * @type {ITypeScriptFacade|false}
 */
export default await getFacade(
  await tryImport("typescript", meta.supportedTranspilers.typescript),
);
