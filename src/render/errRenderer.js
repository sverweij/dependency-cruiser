const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./err.template");

function cutNonTransgressions(pSourceEntry) {
    return {
        source: pSourceEntry.source,
        dependencies: pSourceEntry.dependencies.filter(pDep => pDep.valid === false)
    };
}

function render(pInput) {
    return Handlebars.templates['err.template.hbs'](
        {
            "things" :
                pInput
                    .map(cutNonTransgressions)
                    .filter(pDep => pDep.dependencies.length > 0)
                    .sort((pOne, pTwo) => pOne.source > pTwo.source ? 1 : -1)
        }
    );
}

exports.render = render;
