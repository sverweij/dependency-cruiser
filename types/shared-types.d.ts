// cruise options, cruise result
export type ModuleSystemType = "cjs" | "amd" | "es6" | "tsd";

// cruise options, dependency-cruiser
export type OutputType =
  | "json"
  | "html"
  | "dot"
  | "ddot"
  | "csv"
  | "err"
  | "err-long"
  | "err-html"
  | "teamcity"
  | "anon";

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
  | "unknown";
