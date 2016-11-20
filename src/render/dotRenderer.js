const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./dot.template");

Handlebars.registerPartial(
    'dot.template.hbs',
    Handlebars.templates['dot.template.hbs']
);

function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function render(pInput) {
    return Handlebars.templates['dot.template.hbs']({"things" : pInput.sort(compareOnSource)});
}

exports.render = render;
