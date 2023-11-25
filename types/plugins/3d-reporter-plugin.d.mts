import type { IReporterOutput, ICruiseResult } from "../dependency-cruiser.mjs";

declare module "3d-reporter-plugin" {
  /**
   * Sample plugin: 3d representation
   *
   * @param {ICruiseResult} pCruiseResult - the output of a dependency-cruise adhering to dependency-cruiser's cruise result schema
   * @return {IReporterOutput} - output: a string, exitCode: 0
   */
  export default function ThreeDReporterPlugin(
    pCruiseResult: ICruiseResult
  ): IReporterOutput;
}
