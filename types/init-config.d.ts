export type OneShotConfigIDType = "preset" | "yes" | "experimental-scripts";

export type ConfigTypeType = "preset" | "self-contained";

export type ExternalModuleResolutionStrategyType = "yarn-pnp" | "node_modules";

export interface IInitConfig {
  /**
   * Whether or not the current folder houses a mono repo
   */
  isMonoRepo: boolean;
  /**
   * Whether or not you allow usage of external dependencies declared in
   * package.jsons of parent folders
   */
  combinedDependencies: boolean;
  /**
   * Whether or not to use a TypeScript config
   */
  useTsConfig: boolean;
  /**
   * The file name of the TypeScript config to use
   */
  tsConfig?: string;
  /**
   * Wheter or not to take dependencies into account that only exist before
   * compilation to javascript
   */
  tsPreCompilationDeps: boolean;
  /**
   * Whether or not to use Yarn plug'n play for module resolution (only useful
   * when the package.json + repo are prepared for this)
   */
  useYarnPnP: boolean;
  /**
   *
   */
  externalModuleResolutionStrategy: ExternalModuleResolutionStrategyType;
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
   * Dependency-cruiser version used
   */
  version: string;
  /**
   * (Formatted) date this config is created
   */
  date: string;
  /**
   * Whether to use one of the presets (`preset`) or be self contained
   * (`self-contained`)
   */
  configType: ConfigTypeType;
  /**
   * For configType === "preset", the name of the preset
   */
  preset?: string;
}

export type IPartialInitConfig = Partial<IInitConfig>;
