/* eslint-disable strict */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* rules from the 'recommended' preset: */
    // {
    //   name: 'no-circular',
    //   severity: 'warn',
    //   comment:
    //     'This dependency is part of a circular relationship. You might want to revise ' +
    //     'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
    //   from: {},
    //   to: {
    //     circular: true,
    //   },
    // },
    // {
    //   name: 'no-orphans',
    //   severity: 'info',
    //   comment:
    //     "This is an orphan module - it's likely not used (anymore?). Either use it or remove it. If it's " +
    //     "logical this module is an orphan (i.e. it's a config file), add an exception for it in your " +
    //     'dependency-cruiser configuration.',
    //   from: {
    //     orphan: true,
    //     pathNot: '\\.d\\.ts$',
    //   },
    //   to: {},
    // },
    {
      name: "no-deprecated-core",
      comment:
        "A module depends on a node core module that has been deprecated. Find an alternative - these are " +
        "bound to exist - node doesn't deprecate lightly.",
      severity: "warn",
      from: {},
      to: {
        dependencyTypes: ["core"],
        path: [
          "^(v8/tools/codemap)$",
          "^(v8/tools/consarray)$",
          "^(v8/tools/csvparser)$",
          "^(v8/tools/logreader)$",
          "^(v8/tools/profile_view)$",
          "^(v8/tools/profile)$",
          "^(v8/tools/SourceMap)$",
          "^(v8/tools/splaytree)$",
          "^(v8/tools/tickprocessor-driver)$",
          "^(v8/tools/tickprocessor)$",
          "^(node-inspect/lib/_inspect)$",
          "^(node-inspect/lib/internal/inspect_client)$",
          "^(node-inspect/lib/internal/inspect_repl)$",
          "^(async_hooks)$",
          "^(assert)$",
          "^(punycode)$",
          "^(domain)$",
          "^(constants)$",
          "^(sys)$",
          "^(_linklist)$",
          "^(_stream_wrap)$",
        ],
      },
    },
    {
      name: "not-to-deprecated",
      comment:
        "This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later " +
        "version of that module, or find an alternative. Deprecated modules are a security risk.",
      severity: "warn",
      from: {},
      to: {
        dependencyTypes: ["deprecated"],
      },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
        "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
        "available on live with an non-guaranteed version. Fix it by adding the package to the dependencies " +
        "in your package.json.",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
        pathNot: "packages/.+",
      },
    },
    {
      name: "not-to-unresolvable",
      comment:
        "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
        "module: add it to your package.json. In all other cases you likely already know what to do.",
      severity: "error",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },

    /* rules you might want to tweak for your specific situation: */
    {
      name: "not-to-test",
      comment:
        "This module depends on code within a folder that should only contain tests. As tests don't " +
        "implement functionality this is odd. Either you're writing a test outside the test folder " +
        "or there's something in the test folder that isn't a test.",
      severity: "error",
      from: {
        pathNot: "^(test|spec)",
      },
      to: {
        path: "^(test|spec)",
      },
    },
    {
      name: "not-to-spec",
      comment:
        "This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. " +
        "If there's something in a spec that's of use to other modules, it doesn't have that single " +
        "responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.",
      severity: "error",
      from: {},
      to: {
        path: "\\.spec\\.(js|ts|ls|coffee|litcoffee|coffee\\.md)$",
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "This module depends on an npm package from the 'devDependencies' section of your " +
        "package.json. It looks like something that ships to production, though. To prevent problems " +
        "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
        "section of your package.json. If this module is development only - add it to the " +
        "from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration",
      from: {
        path: "^(src|app|lib)",
        pathNot: "\\.spec\\.(js|ts|ls|coffee|litcoffee|coffee\\.md)$",
      },
      to: {
        dependencyTypes: ["npm-dev"],
      },
    },
    {
      name: "optional-deps-used",
      severity: "info",
      comment:
        "This module depends on an npm package that is declared as an optional dependency " +
        "in your package.json. As this makes sense in limited situations only, it's flagged here. " +
        "If you're using an optional dependency here by design - add an exception to your" +
        "depdency-cruiser configuration.",
      from: {},
      to: {
        dependencyTypes: ["npm-optional"],
      },
    },
  ],
  options: {
    /* conditions specifying which files not to follow further when encountered:
       - path: a regular expression to match
       - dependencyTypes: see https://github.com/sverweij/dependency-cruiser/blob/develop/doc/rules-reference.md#dependencytypes-and-dependencytypesnot
       for a complete list
    */
    doNotFollow: {
      // path: 'node_modules',
      dependencyTypes: [
        "npm",
        "npm-dev",
        "npm-optional",
        "npm-peer",
        "npm-bundled",
        "npm-no-pkg",
      ],
    },

    /* conditions specifying which dependencies to exclude
       - path: a regular expression to match
       - dynamic: a boolean indicating whether to ignore dynamic (true) or static (false) dependencies.
          leave out if you want to exclude neither (recommended!)
    */
    // , exclude : {
    //   path: ''
    //   , dynamic: true
    // }

    /* pattern specifying which files to include (regular expression)
       dependency-cruiser will skip everything not matching this pattern
    */
    includeOnly: "^packages",

    /* list of module systems to cruise */
    // , moduleSystems: ['amd', 'cjs', 'es6', 'tsd']

    /* prefix for links in html and svg output (e.g. https://github.com/you/yourrepo/blob/develop/) */
    prefix: "https://github.com/facebook/react/blob/master/",

    /* false (the default): ignore dependencies that only exist before typescript-to-javascript compilation
       true: also detect dependencies that only exist before typescript-to-javascript compilation
       "specify": for each dependency identify whether it only exists before compilation or also after
     */
    // , tsPreCompilationDeps: false

    /* if true combines the package.jsons found from the module up to the base
       folder the cruise is initiated from. Useful for how (some) mono-repos
       manage dependencies & dependency definitions.
     */
    combinedDependencies: true,

    /* if true leave symlinks untouched, otherwise use the realpath */
    // , preserveSymlinks: false

    /* Typescript project file ('tsconfig.json') to use for
       (1) compilation and
       (2) resolution (e.g. with the paths property)

       The (optional) fileName attribute specifies which file to take (relative to
       dependency-cruiser's current working directory). When not provided
       defaults to './tsconfig.json'.
     */
    // , tsConfig: {
    //  fileName: './tsconfig.json'
    // }

    /* Webpack configuration to use to get resolve options from.

       The (optional) fileName attribute specifies which file to take (relative
       to dependency-cruiser's current working directory. When not provided defaults
       to './webpack.conf.js'.

       The (optional) `env` and `arguments` attributes contain the parameters to be passed if
       your webpack config is a function and takes them (see webpack documentation
       for details)
     */
    // , webpackConfig: {
    //  fileName: './webpack.config.js'
    //  , env: {}
    //  , arguments: {}
    // }

    /* How to resolve external modules - use "yarn-pnp" if you're using yarn's Plug'n'Play.
       otherwise leave it out (or set to the default, which is 'node_modules')
    */
    // , externalModuleResolutionStrategy: 'node_modules'
    /* List of strings you have in use in addition to cjs/ es6 requires
       & imports to declare module dependencies. Use this e.g. if you've
       redeclared require, use a require-wrapper or use window.require as
       a hack.
    */
    // , exoticRequireStrings: []
    // theoretically there's more extensions than just .js (a quick scan learns
    // the packages folder contains .ts, .d.ts, .ls(!) and .coffee). However,
    // likely they either just exist in node_modules, or are of no consequence
    // as when we provide these extensions as well the number of files & dependencies
    // scanned does not go up.
    enhancedResolveOptions: {
      extensions: [".js"],
    },
    progress: { type: "performance-log" },
    reporterOptions: {
      dot: {
        /* pattern of modules that can be consolidated in the detailed
           graphical dependency graph. The default pattern in this configuration
           collapses everything in node_modules to one folder deep so you see
           the external modules, but not the innards your app depends upon.
         */
        collapsePattern: "node_modules/[^/]+",
      },
      archi: {
        /* pattern of modules that can be consolidated in the high level
          graphical dependency graph. If you use the high level graphical
          dependency graph reporter (`archi`) you probably want to tweak
          this collapsePattern to your situation.
        */
        collapsePattern: "^(node_modules|packages|src|lib|app|test|spec)/[^/]+",

        /* Options to tweak the appearance of your graph.See
           https://github.com/sverweij/dependency-cruiser/blob/develop/doc/options-reference.md#reporteroptions
           for details and some examples. If you don't specify a theme
           for 'archi' dependency-cruiser will use the one specified in the
           dot section (see above), if any, and otherwise use the default one.
         */
        theme: {
          graph: {
            /* use splines: 'ortho' for straight lines. Be aware though
              graphviz might take a long time calculating ortho(gonal)
              routings.
           */
            splines: "ortho",
            rankdir: "TD",
          },
          modules: [
            {
              criteria: { source: "tools" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "packages/react-" },
              attributes: { fillcolor: "#ffcccc" },
            },
            {
              criteria: { source: "packages/react$" },
              attributes: { fillcolor: "#ccccff" },
            },
            { criteria: {}, attributes: { fillcolor: "#ffffcc" } },
          ],
          dependencies: [
            {
              criteria: { "rules[0].severity": "error" },
              attributes: { fontcolor: "red", color: "red" },
            },
            {
              criteria: { "rules[0].severity": "warn" },
              attributes: { fontcolor: "orange", color: "orange" },
            },
            {
              criteria: { "rules[0].severity": "info" },
              attributes: { fontcolor: "blue", color: "blue" },
            },
            {
              criteria: { resolved: "tools" },
              attributes: { color: "#00770077" },
            },
            {
              criteria: { resolved: "packages/react-" },
              attributes: { color: "#77000077" },
            },
            {
              criteria: { resolved: "packages/react$" },
              attributes: { color: "#0000ff77" },
            },
            {
              criteria: {},
              attributes: { style: "solid" },
            },
          ],
        },
      },
    },
  },
};
// generated: dependency-cruiser@7.3.0-beta-5 on 2020-02-29T13:39:42.828Z
