export type OneShotConfigIDType = "yes" | "x-scripts";

export interface IInitConfig {
  /**
   * Whether or not the current folder houses a mono repo
   */
  isMonoRepo: boolean;
  /**
   * Whether or not the current folder is a package is an ESM package
   * by default (and resolutions of external dependencies should be
   * treated as such)
   */
  isTypeModule: boolean;
  /**
   * Whether or not you allow usage of external dependencies declared in
   * package.jsons of parent folders
   */
  combinedDependencies: boolean;
  /**
   * Whether or not to use a TypeScript config
   */
  useJsConfig: boolean;
  /**
   * The file name of the TypeScript config to use
   */
  jsConfig?: string;
  /**
   * Whether or not to use a TypeScript config
   */
  useTsConfig: boolean;
  /**
   * The file name of the TypeScript config to use
   */
  tsConfig?: string;
  /**
   * Whether or not to take dependencies into account that only exist before
   * compilation to javascript
   */
  tsPreCompilationDeps: boolean;
  /**
   * Derived attribute. True if the current project likely uses typescript (has a
   * tsconfig, has files with typescript extensions in source and/ or test
   * folders, or has a truthy tsPreCompilationDeps)
   */
  usesTypeScript: boolean;
  /**
   * Whether or not to use a Webpack config
   */
  useWebpackConfig: boolean;
  /**
   * The file name of the Webpack config to use
   */
  webpackConfig?: string;
  /**
   * Whether or not to use a Babel config
   */
  useBabelConfig: boolean;
  /**
   * The file name of the Babel config to use
   */
  babelConfig?: string;
  /**
   * Whether or not to include some useful scripts in your package.json
   */
  updateManifest: boolean;
  /**
   * An array of (relative) paths to folders to understand as source code
   */
  sourceLocation: string[];
  /**
   * Whether tests are housed in a folder separate from sources
   * or are embedded within the source folder
   */
  hasTestsOutsideSource: boolean;
  /**
   * An array of (relative) paths to folders to understand as test code
   */
  testLocation?: string[];
  /**
   * Whether or not to explicitly pass extensions to the resolver. When not
   * set explicitly dependency-cruiser will pass it all extensions it knows
   * to handle - which makes it more sure to catch everything, at the trade-off
   * of potentially being slower if the number of extensions used in reality
   * is (a lot) smaller.
   */
  specifyResolutionExtensions: boolean;
  /**
   * An array of extensions the resolver should use when resolving dependencies
   */
  resolutionExtensions?: string[];
  /**
   * Dependency-cruiser version used
   */
  version: string;
  /**
   * (Formatted) date this config is created
   */
  date: string;
}

export type IPartialInitConfig = Partial<IInitConfig>;
