function deriveSortKey(pModule) {
  return `${pModule.coreModule ? "1" : "0"}-${pModule.source}`;
}

function compareOnSource(pOne, pTwo) {
  return deriveSortKey(pOne) > deriveSortKey(pTwo) ? 1 : -1;
}

function determineIncidenceType(pFromListEntry) {
  return (pModule) => {
    let lDependency = pModule.dependencies.find(
      (pDependency) => pDependency.resolved === pFromListEntry.source
    );

    if (lDependency) {
      return lDependency.valid
        ? {
            incidence: "true",
          }
        : {
            incidence: lDependency.rules[0].severity,
            rule: `${lDependency.rules[0].name}${
              lDependency.rules.length > 1
                ? ` (+${lDependency.rules.length - 1} others)`
                : ""
            }`,
          };
    }

    return {
      incidence: "false",
    };
  };
}

function addIncidences(pFromList) {
  return (pDependency) => ({
    ...pDependency,
    incidences: pFromList.map((pFromListEntry) => ({
      to: pFromListEntry.source,
      ...determineIncidenceType(pFromListEntry)(pDependency),
    })),
  });
}
/*

*/
module.exports = (pFromList) =>
  pFromList.sort(compareOnSource).map(addIncidences(pFromList));
