const path = require("path").posix;
const theming = require("./theming");

function attributizeObject(pObject) {
  return (
    Object.keys(pObject)
      // eslint-disable-next-line security/detect-object-injection
      .map((pKey) => `${pKey}="${pObject[pKey]}"`)
      .join(" ")
  );
}

function extractFirstTransgression(pModule) {
  return {
    ...(pModule.rules ? { ...pModule, rule: pModule.rules[0] } : pModule),
    dependencies: pModule.dependencies.map((pDependency) =>
      pDependency.rules
        ? {
            ...pDependency,
            rule: pDependency.rules[0],
          }
        : pDependency
    ),
  };
}

function applyTheme(pTheme) {
  return (pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies
      .map((pDependency) => ({
        ...pDependency,
        themeAttrs: attributizeObject(
          theming.determineAttributes(pDependency, pTheme.dependencies)
        ),
      }))
      .map((pDependency) => ({
        ...pDependency,
        hasExtraAttributes: Boolean(pDependency.rule || pDependency.themeAttrs),
      })),
    themeAttrs: attributizeObject(
      theming.determineAttributes(pModule, pTheme.modules)
    ),
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
      .reduce(toFullPath, "")}${pPathSnippet}`,
  };
}

function folderify(pModule) {
  let lAdditions = {};
  let lDirectoryName = path.dirname(pModule.source);

  if (lDirectoryName !== ".") {
    lAdditions.folder = lDirectoryName;
    lAdditions.path = lDirectoryName.split(path.sep).map(aggregate);
  }

  lAdditions.label = `"${path.basename(pModule.source)}"`;

  return {
    ...pModule,
    ...lAdditions,
  };
}

/**
 * Sort of smartly concatenate the given prefix and source:
 *
 * if it's an uri pattern (e.g. https://yadda, file://snorkel/bla)
 * simply concat.
 *
 * in all other cases path.posix.join the two
 *
 * @param {string} pPrefix - prefix
 * @param {string} pSource - filename
 * @return {string} prefix and filename concatenated
 */
function smartURIConcat(pPrefix, pSource) {
  if (pPrefix.match(/^[a-z]+:\/\//)) {
    return `${pPrefix}${pSource}`;
  } else {
    return path.join(pPrefix, pSource);
  }
}

function addURL(pPrefix) {
  return (pModule) => ({
    ...pModule,
    ...(pModule.coreModule || pModule.couldNotResolve
      ? {}
      : { URL: smartURIConcat(pPrefix, pModule.source) }),
  });
}

function flatLabel(pModule) {
  return {
    ...pModule,
    label: `<${path.dirname(pModule.source)}/<BR/><B>${path.basename(
      pModule.source
    )}</B>>`,
  };
}

module.exports = {
  folderify,
  applyTheme,
  extractFirstTransgression,
  attributizeObject,
  addURL,
  flatLabel,
};
