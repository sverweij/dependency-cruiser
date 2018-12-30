function compareOnSource(pOne, pTwo) {
    const deriveSortKey = (pModule) => `${pModule.coreModule ? "1" : "0"}-${pModule.source}`;

    return deriveSortKey(pOne) > deriveSortKey(pTwo)
        ? 1
        : -1;
}

function determineIncidenceType(pFromListEntry) {
    return pModule => {
        let lDep = pModule.dependencies.find(
            pDep => pDep.resolved === pFromListEntry.source
        );

        if (lDep) {
            return lDep.valid
                ? {
                    incidence: "true"
                }
                : {
                    incidence: lDep.rules[0].severity,
                    rule: `${lDep.rules[0].name}${lDep.rules.length > 1 ? ` (+${lDep.rules.length - 1} others)` : ""}`
                };
        }

        return {
            incidence: "false"
        };
    };
}

function addIncidences(pFromList) {
    return (pDependency) =>
        Object.assign(
            pDependency,
            {
                incidences: pFromList.map(pFromListEntry =>
                    Object.assign(
                        {
                            to: pFromListEntry.source
                        },
                        determineIncidenceType(pFromListEntry)(pDependency)
                    )
                )
            }
        );
}

module.exports =
    pFromList => pFromList.sort(compareOnSource).map(addIncidences(pFromList));
