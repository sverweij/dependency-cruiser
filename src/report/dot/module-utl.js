const path = require("path").posix;
const theming = require("./theming");

function attributizeObject(pObject) {
  return (
    Object.keys(pObject)
      // eslint-disable-next-line security/detect-object-injection
      .map(pKey => `${pKey}="${pObject[pKey]}"`)
      .join(" ")
  );
}

function extractFirstTransgression(pModule) {
  return {
    ...(pModule.rules ? { ...pModule, rule: pModule.rules[0] } : pModule),
    dependencies: pModule.dependencies.map(pDependency =>
      pDependency.rules
        ? {
            ...pDependency,
            rule: pDependency.rules[0]
          }
        : pDependency
    )
  };
}

function extractRelevantTransgressions(pModule) {
  return {
    ...(pModule.rules ? { ...pModule, rule: pModule.rules[0] } : pModule),
    dependencies: pModule.dependencies.map(pDependency => ({
      ...pDependency,
      rule: pDependency.rules[0]
    }))
  };
}

function applyTheme(pTheme) {
  return pModule => ({
    ...pModule,
    dependencies: pModule.dependencies
      .map(pDependency => ({
        ...pDependency,
        themeAttrs: attributizeObject(
          theming.determineAttributes(pDependency, pTheme.dependencies)
        )
      }))
      .map(pDependency => ({
        ...pDependency,
        hasExtraAttributes: Boolean(pDependency.rule || pDependency.themeAttrs)
      })),
    themeAttrs: attributizeObject(
      theming.determineAttributes(pModule, pTheme.modules)
    )
  });
}

function toFullPath(pAll, pCurrent) {
  return `${pAll}${pCurrent}${path.sep}`;
}

function aggregate(pPathSnippet, pCounter, pPathArray) {
  return {
    snippet: pPathSnippet,
    aggregateSnippet: `${pPathArray
      .slice(0, pCounter)
      .reduce(toFullPath, "")}${pPathSnippet}`
  };
}

function folderify(pModule) {
  let lAdditions = {};
  let lDirName = path.dirname(pModule.source);

  if (lDirName !== ".") {
    lAdditions.folder = lDirName;
    lAdditions.path = lDirName.split(path.sep).map(aggregate);
  }

  lAdditions.label = path.basename(pModule.source);

  return {
    ...pModule,
    ...lAdditions
  };
}

function compareOnSource(pModuleOne, pModuleTwo) {
  return pModuleOne.source > pModuleTwo.source ? 1 : -1;
}

module.exports = {
  compareOnSource,
  folderify,
  applyTheme,
  extractFirstTransgression,
  extractRelevantTransgressions,
  attributizeObject
};
