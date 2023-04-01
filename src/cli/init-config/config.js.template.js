var Handlebars=require("handlebars/runtime"),template=Handlebars.template,templates=Handlebars.templates=Handlebars.templates||{};templates["config.js.template.hbs"]=template({1:function(e,n,t,o,s){var i,r=null!=n?n:e.nullContext||{},a=e.hooks.helperMissing,l="function",c=e.escapeExpression,e=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"  'extends': '"+c(typeof(i=null!=(i=e(t,"preset")||(null!=n?e(n,"preset"):n))?i:a)==l?i.call(r,{name:"preset",hash:{},data:s,loc:{start:{line:4,column:14},end:{line:4,column:24}}}):i)+"',\n  /*\n     the '"+c(typeof(i=null!=(i=e(t,"preset")||(null!=n?e(n,"preset"):n))?i:a)==l?i.call(r,{name:"preset",hash:{},data:s,loc:{start:{line:6,column:10},end:{line:6,column:20}}}):i)+"' preset\n     contains these rules:\n     no-circular          - flags all circular dependencies\n     no-orphans           - flags orphan modules (except typescript .d.ts files)\n     no-deprecated-core   - flags dependencies on deprecated node 'core' modules\n     no-deprecated-npm    - flags dependencies on deprecated npm modules\n     no-non-package-json  - flags (npm) dependencies that don't occur in package.json\n     not-to-unresolvable  - flags dependencies that can't be resolved`\n     no-duplicate-dep-types - flags dependencies that occur more than once in package.json\n\n     If you need to, you can override these rules. E.g. to ignore the\n     no-duplicate-dep-types rule, you can set its severity to \"ignore\" by\n     adding this to the 'forbidden' section:\n     {\n      name: 'no-duplicate-dep-types',\n      severity: 'ignore'\n     }\n\n     Also, by default, the preset does not follow any external modules (things in\n     node_modules or in yarn's plug'n'play magic). If you want to have that\n     differently, just override it the options.doNotFollow key.\n   */\n  forbidden: [\n"},3:function(e,n,t,o,s){return"  forbidden: [\n    /* rules from the 'recommended' preset: */\n    {\n      name: 'no-circular',\n      severity: 'warn',\n      comment:\n        'This dependency is part of a circular relationship. You might want to revise ' +\n        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',\n      from: {},\n      to: {\n        circular: true\n      }\n    },\n    {\n      name: 'no-orphans',\n      comment:\n        \"This is an orphan module - it's likely not used (anymore?). Either use it or \" +\n        \"remove it. If it's logical this module is an orphan (i.e. it's a config file), \" +\n        \"add an exception for it in your dependency-cruiser configuration. By default \" +\n        \"this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration \" +\n        \"files (.d.ts), tsconfig.json and some of the babel and webpack configs.\",\n      severity: 'warn',\n      from: {\n        orphan: true,\n        pathNot: [\n          '(^|/)\\\\.[^/]+\\\\.(js|cjs|mjs|ts|json)$', // dot files\n          '\\\\.d\\\\.ts$',                            // TypeScript declaration files\n          '(^|/)tsconfig\\\\.json$',                 // TypeScript config\n          '(^|/)(babel|webpack)\\\\.config\\\\.(js|cjs|mjs|ts|json)$' // other configs\n        ]\n      },\n      to: {},\n    },\n    {\n      name: 'no-deprecated-core',\n      comment:\n        'A module depends on a node core module that has been deprecated. Find an alternative - these are ' +\n        \"bound to exist - node doesn't deprecate lightly.\",\n      severity: 'warn',\n      from: {},\n      to: {\n        dependencyTypes: [\n          'core'\n        ],\n        path: [\n          '^(v8\\/tools\\/codemap)$',\n          '^(v8\\/tools\\/consarray)$',\n          '^(v8\\/tools\\/csvparser)$',\n          '^(v8\\/tools\\/logreader)$',\n          '^(v8\\/tools\\/profile_view)$',\n          '^(v8\\/tools\\/profile)$',\n          '^(v8\\/tools\\/SourceMap)$',\n          '^(v8\\/tools\\/splaytree)$',\n          '^(v8\\/tools\\/tickprocessor-driver)$',\n          '^(v8\\/tools\\/tickprocessor)$',\n          '^(node-inspect\\/lib\\/_inspect)$',\n          '^(node-inspect\\/lib\\/internal\\/inspect_client)$',\n          '^(node-inspect\\/lib\\/internal\\/inspect_repl)$',\n          '^(async_hooks)$',\n          '^(punycode)$',\n          '^(domain)$',\n          '^(constants)$',\n          '^(sys)$',\n          '^(_linklist)$',\n          '^(_stream_wrap)$'\n        ],\n      }\n    },\n    {\n      name: 'not-to-deprecated',\n      comment:\n        'This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later ' +\n        'version of that module, or find an alternative. Deprecated modules are a security risk.',\n      severity: 'warn',\n      from: {},\n      to: {\n        dependencyTypes: [\n          'deprecated'\n        ]\n      }\n    },\n    {\n      name: 'no-non-package-json',\n      severity: 'error',\n      comment:\n        \"This module depends on an npm package that isn't in the 'dependencies' section of your package.json. \" +\n        \"That's problematic as the package either (1) won't be available on live (2 - worse) will be \" +\n        \"available on live with an non-guaranteed version. Fix it by adding the package to the dependencies \" +\n        \"in your package.json.\",\n      from: {},\n      to: {\n        dependencyTypes: [\n          'npm-no-pkg',\n          'npm-unknown'\n        ]\n      }\n    },\n    {\n      name: 'not-to-unresolvable',\n      comment:\n        \"This module depends on a module that cannot be found ('resolved to disk'). If it's an npm \" +\n        'module: add it to your package.json. In all other cases you likely already know what to do.',\n      severity: 'error',\n      from: {},\n      to: {\n        couldNotResolve: true\n      }\n    },\n    {\n      name: 'no-duplicate-dep-types',\n      comment:\n        \"Likely this module depends on an external ('npm') package that occurs more than once \" +\n        \"in your package.json i.e. bot as a devDependencies and in dependencies. This will cause \" +\n        \"maintenance problems later on.\",\n      severity: 'warn',\n      from: {},\n      to: {\n        moreThanOneDependencyType: true,\n        // as it's pretty common to have a type import be a type only import \n        // _and_ (e.g.) a devDependency - don't consider type-only dependency\n        // types for this rule\n        dependencyTypesNot: [\"type-only\"]\n      }\n    },\n\n    /* rules you might want to tweak for your specific situation: */\n"},5:function(e,n,t,o,s){var i,r=null!=n?n:e.nullContext||{},a=e.hooks.helperMissing,l="function",c=e.escapeExpression,e=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"    {\n      name: 'not-to-test',\n      comment:\n        \"This module depends on code within a folder that should only contain tests. As tests don't \" +\n        \"implement functionality this is odd. Either you're writing a test outside the test folder \" +\n        \"or there's something in the test folder that isn't a test.\",\n      severity: 'error',\n      from: {\n        pathNot: '"+c(typeof(i=null!=(i=e(t,"testLocationRE")||(null!=n?e(n,"testLocationRE"):n))?i:a)==l?i.call(r,{name:"testLocationRE",hash:{},data:s,loc:{start:{line:166,column:18},end:{line:166,column:36}}}):i)+"'\n      },\n      to: {\n        path: '"+c(typeof(i=null!=(i=e(t,"testLocationRE")||(null!=n?e(n,"testLocationRE"):n))?i:a)==l?i.call(r,{name:"testLocationRE",hash:{},data:s,loc:{start:{line:169,column:15},end:{line:169,column:33}}}):i)+"'\n      }\n    },\n"},7:function(e,n,t,o,s){return"    tsPreCompilationDeps: true,\n"},9:function(e,n,t,o,s){return"    // tsPreCompilationDeps: false,\n"},11:function(e,n,t,o,s){return"    combinedDependencies: true,\n"},13:function(e,n,t,o,s){return"    // combinedDependencies: false,\n"},15:function(e,n,t,o,s){var i=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"    tsConfig: {\n      fileName: '"+e.escapeExpression("function"==typeof(t=null!=(t=i(t,"tsConfig")||(null!=n?i(n,"tsConfig"):n))?t:e.hooks.helperMissing)?t.call(null!=n?n:e.nullContext||{},{name:"tsConfig",hash:{},data:s,loc:{start:{line:316,column:17},end:{line:316,column:29}}}):t)+"'\n    },\n"},17:function(e,n,t,o,s){var i=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return null!=(t=i(t,"if").call(null!=n?n:e.nullContext||{},null!=n?i(n,"useJsConfig"):n,{name:"if",hash:{},fn:e.program(18,s,0),inverse:e.program(20,s,0),data:s,loc:{start:{line:319,column:6},end:{line:327,column:13}}}))?t:""},18:function(e,n,t,o,s){var i=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"    tsConfig: {\n      fileName: '"+e.escapeExpression("function"==typeof(t=null!=(t=i(t,"jsConfig")||(null!=n?i(n,"jsConfig"):n))?t:e.hooks.helperMissing)?t.call(null!=n?n:e.nullContext||{},{name:"jsConfig",hash:{},data:s,loc:{start:{line:321,column:17},end:{line:321,column:29}}}):t)+"'\n    },\n"},20:function(e,n,t,o,s){return"    // tsConfig: {\n    //  fileName: './tsconfig.json'\n    // },\n"},22:function(e,n,t,o,s){var i=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"    webpackConfig: {\n      fileName: '"+e.escapeExpression("function"==typeof(t=null!=(t=i(t,"webpackConfig")||(null!=n?i(n,"webpackConfig"):n))?t:e.hooks.helperMissing)?t.call(null!=n?n:e.nullContext||{},{name:"webpackConfig",hash:{},data:s,loc:{start:{line:342,column:17},end:{line:342,column:34}}}):t)+"',\n      // env: {},\n      // arguments: {},\n    },\n"},24:function(e,n,t,o,s){return"    // webpackConfig: {\n    //  fileName: './webpack.config.js',\n    //  env: {},\n    //  arguments: {},\n    // },\n"},26:function(e,n,t,o,s){var i=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"    babelConfig: {\n      fileName: '"+e.escapeExpression("function"==typeof(t=null!=(t=i(t,"babelConfig")||(null!=n?i(n,"babelConfig"):n))?t:e.hooks.helperMissing)?t.call(null!=n?n:e.nullContext||{},{name:"babelConfig",hash:{},data:s,loc:{start:{line:362,column:17},end:{line:362,column:32}}}):t)+"'\n    },\n"},28:function(e,n,t,o,s){return"    // babelConfig: {\n    //   fileName: './.babelrc'\n    // },\n"},30:function(e,n,t,o,s){var i=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]};return"      extensions: "+(null!=(i="function"==typeof(t=null!=(t=i(t,"resolutionExtensionsAsString")||(null!=n?i(n,"resolutionExtensionsAsString"):n))?t:e.hooks.helperMissing)?t.call(null!=n?n:e.nullContext||{},{name:"resolutionExtensionsAsString",hash:{},data:s,loc:{start:{line:412,column:18},end:{line:412,column:52}}}):t)?i:"")+",\n"},32:function(e,n,t,o,s){return'      // extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],\n'},34:function(e,n,t,o,s){return'      mainFields: ["main", "types"],\n'},36:function(e,n,t,o,s){return'      // mainFields: ["main", "types"],\n'},compiler:[8,">= 4.3.0"],main:function(e,n,t,o,s){var i=null!=n?n:e.nullContext||{},r=e.hooks.helperMissing,a="function",l=e.escapeExpression,c=e.lookupProperty||function(e,n){if(Object.prototype.hasOwnProperty.call(e,n))return e[n]},p="/** @type {import('dependency-cruiser').IConfiguration} */\nmodule.exports = {\n"+(null!=(h=c(t,"if").call(i,null!=n?c(n,"preset"):n,{name:"if",hash:{},fn:e.program(1,s,0),inverse:e.program(3,s,0),data:s,loc:{start:{line:3,column:0},end:{line:156,column:7}}}))?h:""),u=null!=(u=c(t,"hasTestsOutsideSource")||(null!=n?c(n,"hasTestsOutsideSource"):n))?u:r,d={name:"hasTestsOutsideSource",hash:{},fn:e.program(5,s,0),inverse:e.noop,data:s,loc:{start:{line:157,column:4},end:{line:172,column:30}}},h=typeof u==a?u.call(i,d):u;return null!=(h=c(t,"hasTestsOutsideSource")?h:e.hooks.blockHelperMissing.call(n,h,d))&&(p+=h),p+"    {\n      name: 'not-to-spec',\n      comment:\n        'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. ' +\n        \"If there's something in a spec that's of use to other modules, it doesn't have that single \" +\n        'responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.',\n      severity: 'error',\n      from: {},\n      to: {\n        path: '\\\\.(spec|test)\\\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\\\.md)$'\n      }\n    },\n    {\n      name: 'not-to-dev-dep',\n      severity: 'error',\n      comment:\n        \"This module depends on an npm package from the 'devDependencies' section of your \" +\n        'package.json. It looks like something that ships to production, though. To prevent problems ' +\n        \"with npm packages that aren't there on production declare it (only!) in the 'dependencies'\" +\n        'section of your package.json. If this module is development only - add it to the ' +\n        'from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration',\n      from: {\n        path: '"+l(typeof(u=null!=(u=c(t,"sourceLocationRE")||(null!=n?c(n,"sourceLocationRE"):n))?u:r)==a?u.call(i,{name:"sourceLocationRE",hash:{},data:s,loc:{start:{line:195,column:15},end:{line:195,column:35}}}):u)+"',\n        pathNot: '\\\\.(spec|test)\\\\.(js|mjs|cjs|ts|ls|coffee|litcoffee|coffee\\\\.md)$'\n      },\n      to: {\n        dependencyTypes: [\n          'npm-dev'\n        ]\n      }\n    },\n    {\n      name: 'optional-deps-used',\n      severity: 'info',\n      comment:\n        \"This module depends on an npm package that is declared as an optional dependency \" +\n        \"in your package.json. As this makes sense in limited situations only, it's flagged here. \" +\n        \"If you're using an optional dependency here by design - add an exception to your\" +\n        \"dependency-cruiser configuration.\",\n      from: {},\n      to: {\n        dependencyTypes: [\n          'npm-optional'\n        ]\n      }\n    },\n    {\n      name: 'peer-deps-used',\n      comment:\n        \"This module depends on an npm package that is declared as a peer dependency \" +\n        \"in your package.json. This makes sense if your package is e.g. a plugin, but in \" +\n        \"other cases - maybe not so much. If the use of a peer dependency is intentional \" +\n        \"add an exception to your dependency-cruiser configuration.\",\n      severity: 'warn',\n      from: {},\n      to: {\n        dependencyTypes: [\n          'npm-peer'\n        ]\n      }\n    }\n  ],\n  options: {\n\n    /* conditions specifying which files not to follow further when encountered:\n       - path: a regular expression to match\n       - dependencyTypes: see https://github.com/sverweij/dependency-cruiser/blob/master/doc/rules-reference.md#dependencytypes-and-dependencytypesnot\n       for a complete list\n    */\n    doNotFollow: {\n      path: 'node_modules'\n    },\n\n    /* conditions specifying which dependencies to exclude\n       - path: a regular expression to match\n       - dynamic: a boolean indicating whether to ignore dynamic (true) or static (false) dependencies.\n          leave out if you want to exclude neither (recommended!)\n    */\n    // exclude : {\n    //   path: '',\n    //   dynamic: true\n    // },\n\n    /* pattern specifying which files to include (regular expression)\n       dependency-cruiser will skip everything not matching this pattern\n    */\n    // includeOnly : '',\n\n    /* dependency-cruiser will include modules matching against the focus\n       regular expression in its output, as well as their neighbours (direct\n       dependencies and dependents)\n    */\n    // focus : '',\n\n    /* list of module systems to cruise */\n    // moduleSystems: ['amd', 'cjs', 'es6', 'tsd'],\n\n    /* prefix for links in html and svg output (e.g. 'https://github.com/you/yourrepo/blob/develop/'\n       to open it on your online repo or `vscode://file/${process.cwd()}/` to \n       open it in visual studio code),\n     */\n    // prefix: '',\n\n    /* false (the default): ignore dependencies that only exist before typescript-to-javascript compilation\n       true: also detect dependencies that only exist before typescript-to-javascript compilation\n       \"specify\": for each dependency identify whether it only exists before compilation or also after\n     */\n"+(null!=(h=c(t,"if").call(i,null!=n?c(n,"tsPreCompilationDeps"):n,{name:"if",hash:{},fn:e.program(7,s,0),inverse:e.program(9,s,0),data:s,loc:{start:{line:280,column:4},end:{line:284,column:11}}}))?h:"")+'    \n    /* \n       list of extensions to scan that aren\'t javascript or compile-to-javascript. \n       Empty by default. Only put extensions in here that you want to take into\n       account that are _not_ parsable. \n    */\n    // extraExtensionsToScan: [".json", ".jpg", ".png", ".svg", ".webp"],\n\n    /* if true combines the package.jsons found from the module up to the base\n       folder the cruise is initiated from. Useful for how (some) mono-repos\n       manage dependencies & dependency definitions.\n     */\n'+(null!=(h=c(t,"if").call(i,null!=n?c(n,"combinedDependencies"):n,{name:"if",hash:{},fn:e.program(11,s,0),inverse:e.program(13,s,0),data:s,loc:{start:{line:297,column:4},end:{line:301,column:11}}}))?h:"")+"\n    /* if true leave symlinks untouched, otherwise use the realpath */\n    // preserveSymlinks: false,\n\n    /* TypeScript project file ('tsconfig.json') to use for\n       (1) compilation and\n       (2) resolution (e.g. with the paths property)\n\n       The (optional) fileName attribute specifies which file to take (relative to\n       dependency-cruiser's current working directory). When not provided\n       defaults to './tsconfig.json'.\n     */\n"+(null!=(h=c(t,"if").call(i,null!=n?c(n,"useTsConfig"):n,{name:"if",hash:{},fn:e.program(15,s,0),inverse:e.program(17,s,0),data:s,loc:{start:{line:314,column:4},end:{line:328,column:11}}}))?h:"")+"\n    /* Webpack configuration to use to get resolve options from.\n\n       The (optional) fileName attribute specifies which file to take (relative\n       to dependency-cruiser's current working directory. When not provided defaults\n       to './webpack.conf.js'.\n\n       The (optional) `env` and `arguments` attributes contain the parameters to be passed if\n       your webpack config is a function and takes them (see webpack documentation\n       for details)\n     */\n"+(null!=(h=c(t,"if").call(i,null!=n?c(n,"useWebpackConfig"):n,{name:"if",hash:{},fn:e.program(22,s,0),inverse:e.program(24,s,0),data:s,loc:{start:{line:340,column:4},end:{line:352,column:11}}}))?h:"")+"\n    /* Babel config ('.babelrc', '.babelrc.json', '.babelrc.json5', ...) to use\n      for compilation (and whatever other naughty things babel plugins do to\n      source code). This feature is well tested and usable, but might change\n      behavior a bit over time (e.g. more precise results for used module \n      systems) without dependency-cruiser getting a major version bump.\n     */\n"+(null!=(h=c(t,"if").call(i,null!=n?c(n,"useBabelConfig"):n,{name:"if",hash:{},fn:e.program(26,s,0),inverse:e.program(28,s,0),data:s,loc:{start:{line:360,column:4},end:{line:368,column:11}}}))?h:"")+"\n    /* List of strings you have in use in addition to cjs/ es6 requires\n       & imports to declare module dependencies. Use this e.g. if you've\n       re-declared require, use a require-wrapper or use window.require as\n       a hack.\n    */\n    // exoticRequireStrings: [],\n    /* options to pass on to enhanced-resolve, the package dependency-cruiser\n       uses to resolve module references to disk. You can set most of these\n       options in a webpack.conf.js - this section is here for those\n       projects that don't have a separate webpack config file.\n\n       Note: settings in webpack.conf.js override the ones specified here.\n     */\n    enhancedResolveOptions: {\n      /* List of strings to consider as 'exports' fields in package.json. Use\n         ['exports'] when you use packages that use such a field and your environment\n         supports it (e.g. node ^12.19 || >=14.7 or recent versions of webpack).\n\n         If you have an `exportsFields` attribute in your webpack config, that one\n         will have precedence over the one specified here.\n      */ \n      exportsFields: [\"exports\"],\n      /* List of conditions to check for in the exports field. e.g. use ['imports']\n         if you're only interested in exposed es6 modules, ['require'] for commonjs,\n         or all conditions at once `(['import', 'require', 'node', 'default']`)\n         if anything goes for you. Only works when the 'exportsFields' array is\n         non-empty.\n\n        If you have a 'conditionNames' attribute in your webpack config, that one will\n        have precedence over the one specified here.\n      */\n      conditionNames: [\"import\", \"require\", \"node\", \"default\"],\n      /*\n         The extensions, by default are the same as the ones dependency-cruiser\n         can access (run `npx depcruise --info` to see which ones that are in\n         _your_ environment. If that list is larger than what you need (e.g. \n         it contains .js, .jsx, .ts, .tsx, .cts, .mts - but you don't use \n         TypeScript you can pass just the extensions you actually use (e.g. \n         [\".js\", \".jsx\"]). This can speed up the most expensive step in \n         dependency cruising (module resolution) quite a bit.\n       */\n"+(null!=(h=c(t,"if").call(i,null!=n?c(n,"specifyResolutionExtensions"):n,{name:"if",hash:{},fn:e.program(30,s,0),inverse:e.program(32,s,0),data:s,loc:{start:{line:411,column:6},end:{line:415,column:13}}}))?h:"")+'      /* \n         If your TypeScript project makes use of types specified in \'types\'\n         fields in package.jsons of external dependencies, specify "types"\n         in addition to "main" in here, so enhanced-resolve (the resolver\n         dependency-cruiser uses) knows to also look there. You can also do\n         this if you\'re not sure, but still use TypeScript. In a future version\n         of dependency-cruiser this will likely become the default.\n       */\n'+(null!=(h=c(t,"if").call(i,null!=n?c(n,"usesTypeScript"):n,{name:"if",hash:{},fn:e.program(34,s,0),inverse:e.program(36,s,0),data:s,loc:{start:{line:424,column:6},end:{line:428,column:13}}}))?h:"")+'    },\n    reporterOptions: {\n      dot: {\n        /* pattern of modules that can be consolidated in the detailed\n           graphical dependency graph. The default pattern in this configuration\n           collapses everything in node_modules to one folder deep so you see\n           the external modules, but not the innards your app depends upon.\n         */\n        collapsePattern: \'node_modules/(@[^/]+/[^/]+|[^/]+)\',\n\n        /* Options to tweak the appearance of your graph.See\n           https://github.com/sverweij/dependency-cruiser/blob/master/doc/options-reference.md#reporteroptions\n           for details and some examples. If you don\'t specify a theme\n           don\'t worry - dependency-cruiser will fall back to the default one.\n        */\n        // theme: {\n        //   graph: {\n        //     /* use splines: "ortho" for straight lines. Be aware though\n        //       graphviz might take a long time calculating ortho(gonal)\n        //       routings.\n        //    */\n        //     splines: "true"\n        //   },\n        //   modules: [\n        //     {\n        //       criteria: { matchesFocus: true },\n        //       attributes: {\n        //         fillcolor: "lime",\n        //         penwidth: 2,\n        //       },\n        //     },\n        //     {\n        //       criteria: { matchesFocus: false },\n        //       attributes: {\n        //         fillcolor: "lightgrey",\n        //       },\n        //     },\n        //     {\n        //       criteria: { matchesReaches: true },\n        //       attributes: {\n        //         fillcolor: "lime",\n        //         penwidth: 2,\n        //       },\n        //     },\n        //     {\n        //       criteria: { matchesReaches: false },\n        //       attributes: {\n        //         fillcolor: "lightgrey",\n        //       },\n        //     },\n        //     {\n        //       criteria: { source: "^src/model" },\n        //       attributes: { fillcolor: "#ccccff" }\n        //     },\n        //     {\n        //       criteria: { source: "^src/view" },\n        //       attributes: { fillcolor: "#ccffcc" }\n        //     },\n        //   ],\n        //   dependencies: [\n        //     {\n        //       criteria: { "rules[0].severity": "error" },\n        //       attributes: { fontcolor: "red", color: "red" }\n        //     },\n        //     {\n        //       criteria: { "rules[0].severity": "warn" },\n        //       attributes: { fontcolor: "orange", color: "orange" }\n        //     },\n        //     {\n        //       criteria: { "rules[0].severity": "info" },\n        //       attributes: { fontcolor: "blue", color: "blue" }\n        //     },\n        //     {\n        //       criteria: { resolved: "^src/model" },\n        //       attributes: { color: "#0000ff77" }\n        //     },\n        //     {\n        //       criteria: { resolved: "^src/view" },\n        //       attributes: { color: "#00770077" }\n        //     }\n        //   ]\n        // }\n      },\n      archi: {\n        /* pattern of modules that can be consolidated in the high level\n          graphical dependency graph. If you use the high level graphical\n          dependency graph reporter (`archi`) you probably want to tweak\n          this collapsePattern to your situation.\n        */\n        collapsePattern: \'^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+|node_modules/(@[^/]+/[^/]+|[^/]+)\',\n\n        /* Options to tweak the appearance of your graph.See\n           https://github.com/sverweij/dependency-cruiser/blob/master/doc/options-reference.md#reporteroptions\n           for details and some examples. If you don\'t specify a theme\n           for \'archi\' dependency-cruiser will use the one specified in the\n           dot section (see above), if any, and otherwise use the default one.\n         */\n        // theme: {\n        // },\n      },\n      "text": {\n        "highlightFocused": true\n      },\n    }\n  }\n};\n// generated: dependency-cruiser@'+l(typeof(u=null!=(u=c(t,"version")||(null!=n?c(n,"version"):n))?u:r)==a?u.call(i,{name:"version",hash:{},data:s,loc:{start:{line:535,column:33},end:{line:535,column:44}}}):u)+" on "+l(typeof(u=null!=(u=c(t,"date")||(null!=n?c(n,"date"):n))?u:r)==a?u.call(i,{name:"date",hash:{},data:s,loc:{start:{line:535,column:48},end:{line:535,column:56}}}):u)+"\n"},useData:!0});