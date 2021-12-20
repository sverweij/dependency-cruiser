// cruise options, cruise result
export type ModuleSystemType = "cjs" | "amd" | "es6" | "tsd";

// cruise options, dependency-cruiser
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
  | string;

export type SeverityType = "error" | "warn" | "info" | "ignore";

// cruise options, cruise result, rule set
export type DependencyType =
  | "aliased"
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
