import { basename, sep, dirname } from "node:path/posix";
import { formatPercentage, getURLForModule } from "../utl/index.mjs";
import theming from "./theming.mjs";

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
    ...(pModule?.rules?.[0]
      ? { ...pModule, tooltip: pModule.rules[0].name }
      : pModule),
    dependencies: pModule.dependencies.map((pDependency) =>
      pDependency.rules
        ? {
            ...pDependency,
            rule: pDependency.rules[0],
          }
        : pDependency,
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
          theming.determineAttributes(pDependency, pTheme.dependencies),
        ),
      }))
      .map((pDependency) => ({
        ...pDependency,
        hasExtraAttributes: Boolean(pDependency.rule || pDependency.themeAttrs),
      })),
    themeAttrs: attributizeObject(
      theming.determineAttributes(pModule, pTheme.modules),
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

  if (
    pShowMetrics &&
    Object.hasOwn(pModule, "instability") &&
    !pModule.consolidated
  ) {
    lInstabilityString = ` <FONT color="#808080" point-size="8">${formatPercentage(
      pModule.instability,
    )}</FONT>`;
  }
  return lInstabilityString;
}

function folderify(pShowMetrics) {
  /** @param {import("../../../types/cruise-result").IModule} pModule*/
  return (pModule) => {
    let lAdditions = {};
    let lDirectoryName = dirname(pModule.source);

    if (lDirectoryName !== ".") {
      lAdditions.folder = lDirectoryName;
      lAdditions.path = lDirectoryName.split(sep).map(aggregate);
    }

    lAdditions.label = `<${basename(pModule.source)}${makeInstabilityString(
      pModule,
      pShowMetrics,
    )}>`;
    lAdditions.tooltip = basename(pModule.source);

    return {
      ...pModule,
      ...lAdditions,
    };
  };
}

/**
 * @param {string} pPrefix
 * @returns {URL?: string}
 */
function addURL(pPrefix) {
  return (pModule) => {
    if (pModule.couldNotResolve) {
      return pModule;
    }

    return {
      ...pModule,
      URL: getURLForModule(pModule, pPrefix),
    };
  };
}

function makeLabel(pModule, pShowMetrics) {
  return `<${dirname(pModule.source)}/<BR/><B>${basename(
    pModule.source,
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
