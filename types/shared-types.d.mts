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

export interface CycleEntryType {
  /**
   * The name of the module in the cycle
   */
  name: string;
  /**
   * "the type of inclusion - local, core, unknown (= we honestly don't
   * know), undetermined (= we didn't bother determining it) or one of
   * the npm dependencies defined in a package.json ('npm' for 'dependencies',
   * 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development,
   * optional, peer dependencies and dependencies in node_modules but not
   * in package.json respectively)
   */
  dependencyTypes: DependencyType[];
}
