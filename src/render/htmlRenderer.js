const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./html.template");

Handlebars.registerPartial(
    'html.template.hbs',
    Handlebars.templates['html.template.hbs']
);

function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function addIncidences(pDependencyList) {
    return function wak (pDependency){
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

function doMagic(pDependencyList) {
    return pDependencyList.sort(compareOnSource).map(addIncidences(pDependencyList));
}

function render(pInput) {
    return Handlebars.templates['html.template.hbs']({"things" : doMagic(pInput)});
}

exports.render = render;

/* eslint arrow-body-style: 0 */
