"use strict";

function compareOnSource(pOne, pTwo) {

    return `${pOne.coreModule ? "1" : "0"}-${pOne.source}` >
        `${pTwo.coreModule ? "1" : "0"}-${pTwo.source}`
        ? 1
        : -1;
}

function determineIncidenceType(pFromListEntry) {
    return pDependency => {
        let lDep = pDependency.dependencies.find(
            pDep => pDep.resolved === pFromListEntry.source
        );

        if (lDep) {
            return lDep.valid
                ? {
                    incidence: "true"
                }
                : {
                    incidence: lDep.rule.severity,
                    rule: lDep.rule.name
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

module.exports.transform =
    pFromList => pFromList.sort(compareOnSource).map(addIncidences(pFromList));
