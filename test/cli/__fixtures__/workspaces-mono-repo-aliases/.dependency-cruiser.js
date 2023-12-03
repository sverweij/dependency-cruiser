/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    moduleSystems: ["es6", "cjs"],
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    // preserveSymlinks: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    // enhancedResolveOptions: {
    //   /* List of strings to consider as 'exports' fields in package.json. Use
    //      ['exports'] when you use packages that use such a field and your environment
    //      supports it (e.g. node ^12.19 || >=14.7 or recent versions of webpack).

    //      If you have an `exportsFields` attribute in your webpack config, that one
    //      will have precedence over the one specified here.
    //   */
    //   exportsFields: ["exports"],
    //   /* List of conditions to check for in the exports field. e.g. use ['imports']
    //      if you're only interested in exposed es6 modules, ['require'] for commonjs,
    //      or all conditions at once `(['import', 'require', 'node', 'default']`)
    //      if anything goes for you. Only works when the 'exportsFields' array is
    //      non-empty.

    //     If you have a 'conditionNames' attribute in your webpack config, that one will
    //     have precedence over the one specified here.
    //   */
    //   conditionNames: ["import", "require", "node", "default"],
    //   /*
    //      The extensions, by default are the same as the ones dependency-cruiser
    //      can access (run `npx depcruise --info` to see which ones that are in
    //      _your_ environment. If that list is larger than what you need (e.g.
    //      it contains .js, .jsx, .ts, .tsx, .cts, .mts - but you don't use
    //      TypeScript you can pass just the extensions you actually use (e.g.
    //      [".js", ".jsx"]). This can speed up the most expensive step in
    //      dependency cruising (module resolution) quite a bit.
    //    */
    //   // extensions: [".js", ".mjs", ".cjs"],
    //   /*
    //      If your TypeScript project makes use of types specified in 'types'
    //      fields in package.jsons of external dependencies, specify "types"
    //      in addition to "main" in here, so enhanced-resolve (the resolver
    //      dependency-cruiser uses) knows to also look there. You can also do
    //      this if you're not sure, but still use TypeScript. In a future version
    //      of dependency-cruiser this will likely become the default.
    //    */
    //   mainFields: ["main", "types", "typings"],
    // },
    cache: false,
  },
};
// generated: dependency-cruiser@15.2.0 on 2023-11-10T19:23:15.613Z
