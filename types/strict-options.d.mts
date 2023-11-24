import type {
  ICruiseOptions,
  IFormatOptions,
  ExternalModuleResolutionStrategyType,
} from "./options.mjs";
import type { ModuleSystemType, OutputType } from "./shared-types.mjs";
import type { IStrictRuleSet } from "./strict-rule-set.mjs";
import type {
  IStrictDoNotFollowType,
  IStrictExcludeType,
  IStrictFocusType,
  IStrictHighlightType,
  IStrictIncludeOnlyType,
  IStrictReachesType,
} from "./strict-filter-types.mjs";
import type { ICacheOptions } from "./cache-options.mjs";

/**
 * the ICruiseOptions interface is lenient in what it accepts for convenience
 * and/ or backwards compatibility reasons. Internally we use a stricter version
 * of ICruiseOptions that
 * - allows only one data type per attribute
 * - makes some attributes mandatory so they're easier to work with
 */
export interface IStrictCruiseOptions extends ICruiseOptions {
  validate: boolean;
  ruleSet?: IStrictRuleSet;
  doNotFollow: IStrictDoNotFollowType;
  exclude: IStrictExcludeType;
  includeOnly?: IStrictIncludeOnlyType;
  focus?: IStrictFocusType;
  reaches?: IStrictReachesType;
  highlight?: IStrictHighlightType;
  collapse?: string;
  maxDepth: number;
  moduleSystems: ModuleSystemType[];
  baseDir: string;
  tsPreCompilationDeps: boolean | "specify";
  extraExtensionsToScan: string[];
  preserveSymlinks: boolean;
  externalModuleResolutionStrategy: ExternalModuleResolutionStrategyType;
  exoticRequireStrings: string[];
  metrics: boolean;
  cache?: false | ICacheOptions;
}

export interface IStrictFormatOptions extends IFormatOptions {
  exclude?: IStrictExcludeType;
  includeOnly?: IStrictIncludeOnlyType;
  focus?: IStrictFocusType;
  reaches?: IStrictFocusType;
  collapse?: string;
  outputType: OutputType;
}
