import { EOL } from "node:os";
/**
 * @import { IOptions, IEnvironmentIssue } from "../../../types/cruise-result.mjs"
 * @import { IAvailableTranspiler } from "../../../types/environment.mjs"
 */

/**
 * @param { IOptions } pOptions
 * @param { IAvailableTranspiler[] } pAvailableTranspilers
 * @returns { boolean }
 */
function swcIsConsistent(pOptions, pAvailableTranspilers) {
  const lSWCNeeded = (pOptions?.parser ?? "acorn") === "swc";
  return lSWCNeeded
    ? pAvailableTranspilers.some(
        (pTranspiler) => pTranspiler.name === "swc" && pTranspiler.available,
      )
    : true;
}

/**
 * @param { IOptions } pOptions
 * @param { IAvailableTranspiler[] } pAvailableTranspilers
 * @returns { boolean }
 */
function tscIsConsistent(pOptions, pAvailableTranspilers) {
  const lTSCNeeded =
    Boolean(pOptions?.tsPreCompilationDeps) ||
    Boolean(pOptions?.detectJSDocImports) ||
    (pOptions?.parser ?? "acorn") === "tsc";
  return lTSCNeeded
    ? pAvailableTranspilers.some(
        (pTranspiler) =>
          pTranspiler.name === "typescript" && pTranspiler.available,
      )
    : true;
}

function typeScriptIsConsistent(pOptions, pAvailableTranspilers) {
  const lTypeScriptNeeded =
    Boolean(pOptions?.tsConfig) &&
    !(
      // these two options require tsc (covered in tscIsConsistent), so
      // to prevent typeScriptIsConsistent from also firing (and printing
      // two messages) we exclude them here
      Boolean(pOptions?.tsPreCompilationDeps) ||
      Boolean(pOptions?.detectJSDocImports)
    );
  return lTypeScriptNeeded
    ? pAvailableTranspilers.some(
        (pTranspiler) =>
          (pTranspiler.name === "typescript" ||
            (pTranspiler.name === "swc" && pOptions?.parser === "swc")) &&
          pTranspiler.available,
      )
    : true;
}

/**
 * @param { IOptions } pOptions
 * @param { IAvailableTranspiler[] } pAvailableTranspilers
 * @returns { boolean }
 */
function babelIsConsistent(pOptions, pAvailableTranspilers) {
  return Boolean(pOptions?.babelConfig)
    ? pAvailableTranspilers.some(
        (pTranspiler) => pTranspiler.name === "babel" && pTranspiler.available,
      )
    : true;
}

/**
 * @param {IOptions} pOptions
 * @param {IAvailableTranspiler[]} pAvailableTranspilers
 * @returns {{issues?: IEnvironmentIssue[]}}
 */
export function determineEnvironmentIssues(pOptions, pAvailableTranspilers) {
  const lIssues = [];
  if (!tscIsConsistent(pOptions, pAvailableTranspilers)) {
    const tsTranspiler = pAvailableTranspilers.find(
      (pTranspiler) => pTranspiler.name === "typescript",
    );

    lIssues.push({
      severity: "warn",
      name: "missing-tsc-transpiler",
      description:
        `dependency-cruiser detected a TypeScript environment,${EOL}` +
        `    but not a compatible TypeScript compiler (${tsTranspiler.name}: ${tsTranspiler.version}). This means${EOL}` +
        `    it's likely to have missed TypeScript sources and dependencies.${EOL}${EOL}` +
        `    Install typescript to get better results (e.g. npm i -D typescript@^6 or typescript@^7.1).${EOL}${EOL}` +
        `    => typescript@7.0 is not supported as its API lacks what dependency-cruiser needs.${EOL}`,
    });
  }
  if (!typeScriptIsConsistent(pOptions, pAvailableTranspilers)) {
    const tsTranspilersString = pAvailableTranspilers
      .filter(
        (pTranspiler) =>
          pTranspiler.name === "typescript" || pTranspiler.name === "swc",
      )
      .map((pTranspiler) => `${pTranspiler.name}: ${pTranspiler.version}`)
      .join(", ");
    lIssues.push({
      severity: "warn",
      name: "missing-typescript-transpiler",
      description:
        `dependency-cruiser detected an environment that needs a TypeScript compiler of some sort,${EOL}` +
        `    but did not find one of the supported ones (${tsTranspilersString}).${EOL}` +
        `    This means it's likely to have missed TypeScript sources and dependencies.${EOL}${EOL}` +
        `    Install one of the above for better results.${EOL}${EOL}` +
        `    => if you choose to use swc don't forget to set the "parser" option to "swc"${EOL}` +
        `    => typescript@7.0 is not supported as its API lacks what dependency-cruiser needs.${EOL}`,
    });
  }
  if (!swcIsConsistent(pOptions, pAvailableTranspilers)) {
    const swcTranspiler = pAvailableTranspilers.find(
      (pTranspiler) => pTranspiler.name === "swc",
    );

    lIssues.push({
      severity: "warn",
      name: "missing-swc-transpiler",
      description:
        `dependency-cruiser found swc configured as compiler, but ${EOL}` +
        `    it did not find a compatible version of swc (${swcTranspiler.name}: ${swcTranspiler.version}).${EOL}` +
        `    dependency-cruiser might have missed some sources or dependencies.${EOL}${EOL}` +
        `    Install swc (e.g. npm i -D @swc/core) to get better results.${EOL}`,
    });
  }
  if (!babelIsConsistent(pOptions, pAvailableTranspilers)) {
    const babelTranspiler = pAvailableTranspilers.find(
      (pTranspiler) => pTranspiler.name === "babel",
    );

    lIssues.push({
      severity: "warn",
      name: "missing-babel-transpiler",
      description:
        `dependency-cruiser detected a babel configuration, but not a${EOL}` +
        `    compatible babel transpiler (${babelTranspiler.name}: ${babelTranspiler.version}). If you indeed use babel,${EOL}` +
        `    dependency-cruiser might have missed some sources or dependencies.${EOL}${EOL}` +
        `    Install babel (e.g. npm i -D @babel/core@^7) to get better results.${EOL}`,
    });
  }
  return lIssues.length > 0 ? { issues: lIssues } : {};
}
