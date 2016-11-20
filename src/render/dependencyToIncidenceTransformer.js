function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function determineIncidenceType(pDependencyListEntry) {
    return pDependency => {
        let lDep = pDependency.dependencies.find(
            pDep => pDep.resolved === pDependencyListEntry.source
        );

        if (lDep) {
            return lDep.valid ? "true" : "violation";
        }

        return "false";
    };
}

function addIncidences(pDependencyList) {
    return (pDependency) => {
        return {
            source: pDependency.source,
            incidences: pDependencyList.map(pDependencyListEntry => {
                return {
                    incidence:determineIncidenceType(pDependencyListEntry)(pDependency),
                    to: pDependencyListEntry.source
                };
            })
        };
    };
}

function transform(pDependencyList) {
    return pDependencyList.sort(compareOnSource).map(addIncidences(pDependencyList));
}

exports.transform = transform;

/* eslint arrow-body-style: 0 */
