import type { IReporterOutput, ICruiseResult } from "../dependency-cruiser.mjs";

declare module "mermaid-reporter-plugin" {
  /**
   * Mermaid reporter plugin
   *
   * @deprecated use the mermaid reporter baked into the dependency-cruiser itself (--output-type mermaid)
   * @param {ICruiseResult} pCruiseResult - the output of a dependency-cruise adhering to dependency-cruiser's cruise result schema
   * @return {IReporterOutput} - output: the module graph in mermaid format, exitCode: 0
   */
  export default function statsReporterPlugin(
    pCruiseResult: ICruiseResult
  ): IReporterOutput;
}
