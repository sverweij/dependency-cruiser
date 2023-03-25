module.exports = {
    forbidden: [
        {
            name: 'no-unreachable-from-root',
            severity: 'error',
            from: {
                path: 'src/index\\.js$'
            },
            to: {
                path: 'src',
                reachable: false
            }
        }
    ],
    options: {

        /* conditions specifying which files not to follow further when encountered:
           - path: a regular expression to match
           - dependencyTypes: see https://github.com/sverweij/dependency-cruiser/blob/develop/doc/rules-reference.md#dependencytypes
             for a complete list
        */
        doNotFollow: {
            // path: 'node_modules',
            dependencyTypes: [
                'npm',
                'npm-dev',
                'npm-optional',
                'npm-peer',
                'npm-bundled',
                'npm-no-pkg'
            ]
        }

        /* pattern specifying which files to exclude (regular expression) */
        // , exclude : ''

        /* pattern specifying which files to include (regular expression)
           dependency-cruiser will skip everything not matching this pattern
        */
        // , includeOnly : ''

        /* list of module systems to cruise */
        // , moduleSystems: ['amd', 'cjs', 'es6', 'tsd']

        /* prefix for links in html and svg output (e.g. https://github.com/you/yourrepo/blob/develop/) */
        // , prefix: ''

        /* if true detect dependencies that only exist before typescript-to-javascript compilation */
        // , tsPreCompilationDeps: false

        /* if true combines the package.jsons found from the module up to the base
           folder the cruise is initiated from. Useful for how (some) mono-repos
           manage dependencies & dependency definitions.
         */
        // , combinedDependencies: false

        /* if true leave symlinks untouched, otherwise use the realpath */
        // , preserveSymlinks: false

        /* TypeScript project file ('tsconfig.json') to use for
           (1) compilation and
           (2) resolution (e.g. with the paths property)

           The (optional) fileName attribute specifies which file to take (relative to
           dependency-cruiser's current working directory). When not provided
           defaults to './tsconfig.json'.
         */
        // , tsConfig: {
        //    fileName: './tsconfig.json'
        // }

        /* Webpack configuration to use to get resolve options from.

          The (optional) fileName attribute specifies which file to take (relative to dependency-cruiser's
          current working directory. When not provided defaults to './webpack.conf.js'.

          The (optional) `env` and `arguments` attributes contain the parameters to be passed if
          your webpack config is a function and takes them (see webpack documentation
          for details)
         */
        // , webpackConfig: {
        // fileName: './webpack.config.js'
        //, env: {}
        //, arguments: {}
        // }
    }
};
// generated: dependency-cruiser@4.21.0 on 2019-06-09T09:28:37.777Z
