import type { IReporterOutput, ICruiseResult } from "../dependency-cruiser.mjs";

declare module "stats-reporter-plugin" {
  /**
   * Sample plugin: stats in json format
   *
   * @param {ICruiseResult} pCruiseResult - the output of a dependency-cruise adhering to dependency-cruiser's cruise result schema
   * @return {IReporterOutput} - output: output: some stats on modules and dependencies in json format, exitCode: 0
   */
  export default function statsReporterPlugin(
    pCruiseResult: ICruiseResult
  ): IReporterOutput;
}
