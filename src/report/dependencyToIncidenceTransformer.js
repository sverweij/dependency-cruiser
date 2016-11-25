"use strict";

function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function determineIncidenceType(pDependencyListEntry) {
    return pDependency => {
        let lDep = pDependency.dependencies.find(
            pDep => pDep.resolved === pDependencyListEntry.source
        );

        if (lDep) {
            return lDep.valid
                ? {
                    incidence: "true"
                }
                : {
                    incidence: lDep.rule.level,
                    rule: lDep.rule.name
                };
        }

        return {
            incidence: "false"
        };
    };
}

function addIncidences(pDependencyList) {
    return (pDependency) => {
        return {
            source: pDependency.source,
            incidences: pDependencyList.map(pDependencyListEntry => {
                return Object.assign(
                    {
                        to: pDependencyListEntry.source
                    },
                    determineIncidenceType(pDependencyListEntry)(pDependency)
                );
            })
        };
    };
}

function transform(pDependencyList) {
    return pDependencyList.sort(compareOnSource).map(addIncidences(pDependencyList));
}

exports.transform = transform;

/* eslint arrow-body-style: 0 */
