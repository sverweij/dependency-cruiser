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
  | "aliased"
  | "aliased-subpath-import"
  | "aliased-tsconfig"
  | "aliased-webpack"
  | "aliased-workspace"
  | "core"
  | "deprecated"
  | "local"
  | "localmodule"
  | "npm"
  | "npm-bundled"
  | "npm-dev"
  | "npm-no-pkg"
  | "npm-optional"
  | "npm-peer"
  | "npm-unknown"
  | "undetermined"
  | "unknown"
  | "type-only";

export type ProtocolType = "data:" | "file:" | "node:";

export type ViolationType =
  | "dependency"
  | "module"
  | "cycle"
  | "reachability"
  | "instability";

export type RuleScopeType = "module" | "folder";
