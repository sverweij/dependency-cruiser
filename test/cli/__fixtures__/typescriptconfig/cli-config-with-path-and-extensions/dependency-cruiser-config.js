/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      path: ['node_modules']
    },

    tsConfig: {
      fileName: './tsconfig.json'
    },

    
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".gen.js", ".js"],
      /* What to consider a 'main' field in package.json */
      
      // if you migrate to ESM (or are in an ESM environment already) you will want to
      // have "module" in the list of mainFields, like so:
      // mainFields: ["module", "main", "types", "typings"],
      mainFields: ["main", "types", "typings"],
    },

    skipAnalysisNotInRules: true,
    
  }
};
// generated: dependency-cruiser@16.10.4 on 2025-07-22T16:20:51.536Z
