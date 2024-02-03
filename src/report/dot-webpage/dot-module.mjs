// @ts-check
import { spawnSync } from "node:child_process";
import dotModuleReporter from "../dot/dot-module.mjs";
import { wrappapiccha } from "./wrap-in-html.mjs";

const CONSTANTS = {
  exec: "dot",
  format: "svg",
};

/**
 * @param {string} pDot Dot program
 * @param {IDotPictureReporterOptions} pOptions
 * @returns {string} the dot program converted to svg, wrapped in html
 */
function convert(pDot, pOptions) {
  /* c8 ignore next */
  const lSpawnFunction = pOptions.spawnFunction || spawnSync;
  const { stdout, status, error } = lSpawnFunction(
    CONSTANTS.exec,
    [`-T${CONSTANTS.format}`],
    {
      input: pDot,
    },
  );
  if (status === 0) {
    return stdout.toString("binary");
  } else if (error) {
    throw error;
  } else {
    throw new Error(
      `Unexpected error occurred executing GraphViz' dot. Exit code ${status}`,
    );
  }
}

/**
 * @param {IDotPictureReporterOptions} pOptions
 * @returns {boolean}
 */
function isAvailable(pOptions) {
  /* c8 ignore next */
  const lSpawnFunction = pOptions.spawnFunction || spawnSync;
  const { status, stderr } = lSpawnFunction(CONSTANTS.exec, ["-V"]);
  return (
    status === 0 && stderr.toString("utf8").startsWith("dot - graphviz version")
  );
}

/**
 * @typedef {import("../../../types/cruise-result.mjs").ICruiseResult} ICruiseResult
 * @typedef {import("../../../types/reporter-options.mjs").IDotReporterOptions} IDotReporterOptions
 * @typedef {import("../../../types/dependency-cruiser.mjs").IReporterOutput} IReporterOutput
 * @typedef {IDotReporterOptions & { spawnFunction?: typeof spawnSync }} IDotPictureReporterOptions
 */

/**
 * Returns the results of a cruise as an svg picture, using the dot reporter
 * and a system call to the GraphViz dot executable.
 *
 * @param {ICruiseResult} pResults
 * @param {IDotPictureReporterOptions} pPicchaReporterOptions
 * @returns {IReporterOutput}
 */
export default function piccha(pResults, pPicchaReporterOptions) {
  const { output } = dotModuleReporter(pResults, pPicchaReporterOptions);

  if (!isAvailable(pPicchaReporterOptions)) {
    throw new Error(
      "GraphViz dot, which is required for the 'x-dot-webpage' reporter doesn't seem to be available on this system. See the GraphViz download page for instruction on how to get it on your system: https://www.graphviz.org/download/",
    );
  }
  return {
    output: wrappapiccha(convert(output, pPicchaReporterOptions)),
    exitCode: 0,
  };
}
