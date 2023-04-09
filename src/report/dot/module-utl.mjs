import { basename, sep, dirname, join } from "node:path/posix";
import has from "lodash/has.js";
import { formatPercentage } from "../utl/index.mjs";
import theming from "./theming.mjs";

const PROTOCOL_PREFIX_RE = /^[a-z]+:\/\//;

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
    ...(has(pModule, "rules[0]")
      ? { ...pModule, tooltip: pModule.rules[0].name }
      : pModule),
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
  return `${pAll}${pCurrent}${sep}`;
}

function aggregate(pPathSnippet, pCounter, pPathArray) {
  return {
    snippet: pPathSnippet,
    aggregateSnippet: `${pPathArray
      .slice(0, pCounter)
      .reduce(toFullPath, "")}${pPathSnippet}`,
  };
}

function makeInstabilityString(pModule, pShowMetrics = false) {
  let lInstabilityString = "";

  if (pShowMetrics && has(pModule, "instability") && !pModule.consolidated) {
    lInstabilityString = ` <FONT color="#808080" point-size="8">${formatPercentage(
      pModule.instability
    )}</FONT>`;
  }
  return lInstabilityString;
}

function folderify(pShowMetrics) {
  return (pModule) => {
    let lAdditions = {};
    let lDirectoryName = dirname(pModule.source);

    if (lDirectoryName !== ".") {
      lAdditions.folder = lDirectoryName;
      lAdditions.path = lDirectoryName.split(sep).map(aggregate);
    }

    lAdditions.label = `<${basename(pModule.source)}${makeInstabilityString(
      pModule,
      pShowMetrics
    )}>`;
    lAdditions.tooltip = basename(pModule.source);

    return {
      ...pModule,
      ...lAdditions,
    };
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
  if (pPrefix.match(PROTOCOL_PREFIX_RE)) {
    return `${pPrefix}${pSource}`;
  } else {
    return join(pPrefix, pSource);
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

function makeLabel(pModule, pShowMetrics) {
  return `<${dirname(pModule.source)}/<BR/><B>${basename(
    pModule.source
  )}</B>${makeInstabilityString(pModule, pShowMetrics)}>`;
}

function flatLabel(pShowMetrics) {
  return (pModule) => ({
    ...pModule,
    label: makeLabel(pModule, pShowMetrics),
    tooltip: basename(pModule.source),
  });
}

export default {
  folderify,
  applyTheme,
  extractFirstTransgression,
  attributizeObject,
  addURL,
  flatLabel,
};
