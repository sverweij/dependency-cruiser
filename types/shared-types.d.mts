// cruise options, cruise result
export type ModuleSystemType = "cjs" | "amd" | "es6" | "tsd";

// cruise options, dependency-cruiser
/* as we don't care about types beyond code completion, we ignore the
 * eslint warning that the 'string' type is redundant here.
 */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type OutputType =
  | "json"
  | "html"
  | "dot"
  | "cdot"
  | "archi"
  | "ddot"
  | "fdot"
  | "flat"
  | "csv"
  | "err"
  | "err-long"
  | "err-html"
  | "teamcity"
  | "anon"
  | "text"
  | "metrics"
  | "markdown"
  | "mermaid"
  | "d2"
  | "null"
  // for plugins: string. TODO: research whether it's possible to
  // tie this down to the `^plugin:[^:]+-reporter-plugin.[cm]?js$` regex
  | string;

export type SeverityType = "error" | "warn" | "info" | "ignore";

// cruise options, cruise result, rule set
export type DependencyType =
  | "aliased-subpath-import"
  | "aliased-tsconfig-base-url"
  | "aliased-tsconfig-paths"
  | "aliased-tsconfig"
  | "aliased-webpack"
  | "aliased-workspace"
  | "aliased"
  | "amd-define"
  | "amd-require"
  | "amd-exotic-require"
  | "core"
  | "deprecated"
  | "dynamic-import"
  | "exotic-require"
  | "export"
  | "import-equals"
  | "import"
  | "local"
  | "localmodule"
  | "npm-bundled"
  | "npm-dev"
  | "npm-no-pkg"
  | "npm-optional"
  | "npm-peer"
  | "npm-unknown"
  | "npm"
  | "pre-compilation-only"
  | "require"
  | "triple-slash-amd-dependency"
  | "triple-slash-directive"
  | "triple-slash-file-reference"
  | "triple-slash-type-reference"
  | "type-import"
  | "type-only"
  | "undetermined"
  | "unknown";

export type ProtocolType = "data:" | "file:" | "node:";

export type ViolationType =
  | "dependency"
  | "module"
  | "cycle"
  | "reachability"
  | "instability";

export type RuleScopeType = "module" | "folder";

export interface IMiniDependency {
  /**
   * The name of the module
   */
  name: string;
  /**
   * The dependency types of the module relative to the previous module " +
   * in the chain it is a part of (e.g. a cycle)
   */
  dependencyTypes: DependencyType[];
}

export type ExperimentalStatsType = {
  /**
   * the number of top level statements in the module. Attribute only
   * available when the cruise was executed with the 'experimentalStats
   * option set to 'true'.
   */
  topLevelStatementCount: number;
  /**
   * the size of the module in bytes. Attribute only available when
   * the cruise was executed with the 'experimentalStats' option set to
   * 'true'.
   */
  size: number;
};
