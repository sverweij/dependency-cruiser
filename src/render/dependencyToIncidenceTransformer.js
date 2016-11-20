function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function addIncidences(pDependencyList) {
    return (pDependency) => {
        return {
            source: pDependency.source,
            incidences: pDependencyList.map(pDependencyListEntry => {
                return {
                    incidence:
                        pDependency.dependencies.some(
                            pDep => pDep.resolved === pDependencyListEntry.source
                        ),
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
