var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<th><div>"
    + container.escapeExpression(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"source","hash":{},"data":data}) : helper)))
    + "</div></th>";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <tr>\n            <td class=\"first-cell\">"
    + alias4(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper)))
    + "</td>\n            "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.incidences : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            <td class=\"first-cell\">"
    + alias4(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper)))
    + "</td>\n        </tr>\n";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<td class=\"cell cell-"
    + container.escapeExpression(((helper = (helper = helpers.incidence || (depth0 != null ? depth0.incidence : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"incidence","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.show : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "></td>";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.escapeExpression;

  return "title=\""
    + alias1(container.lambda((depths[1] != null ? depths[1].source : depths[1]), depth0))
    + " ->\n"
    + alias1(((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"to","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<style media=\"screen\">\n    html {\n        font-family: sans-serif;\n        font-size: 10pt;\n    }\n    table, td.controls {\n        transition-duration: 0.4s;\n    }\n    table, th, td{\n        border: solid black 1px;\n        border-collapse: collapse;\n        font-size: inherit;\n    }\n    th{\n        text-align:start;\n        vertical-align: bottom;\n        max-width: 1em;\n        max-height: 30em;\n        height: 20em;\n        font-weight: normal;\n        white-space: nowrap;\n        overflow: hidden;\n    }\n    th div {\n        transform: rotateZ(-90deg);\n        transform-origin: 0.5em;\n        text-align: start;\n        height: 1em;\n        width: 30em;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n    td {\n        text-align: center;\n        font-style: italic;\n    }\n    td.first-cell {\n        text-align: left;\n        font-style: normal;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n    td.top-left {\n        border-top: solid 1px transparent;\n        border-left: solid 1px transparent;\n    }\n    td.top-right {\n        border-top: solid 1px transparent;\n        border-right: solid 1px transparent;\n    }\n    td.bottom-left {\n        border-bottom: solid 1px transparent;\n        border-left: solid 1px transparent;\n    }\n    td.bottom-right {\n        border-bottom: solid 1px transparent;\n        border-right: solid 1px transparent;\n    }\n    tbody tr:hover {\n        background-color: lightgrey;\n    }\n    #table-rotated:target {\n        transform: rotateZ(45deg);\n        transform-origin: bottom left;\n    }\n    #table-rotated:target #unrotate {\n        opacity: 1;\n    }\n    #table-rotated:target #rotate {\n        opacity: 0;\n    }\n    #unrotate {\n        opacity: 0;\n    }\n    #rotate {\n        opacity: 1;\n    }\n    .controls {\n        opacity: 0.2;\n        vertical-align: bottom;\n        padding: 0.5em;\n    }\n    .controls:hover {\n        opacity: 1;\n    }\n    .controls a {\n        font-style: normal;\n        text-decoration: none;\n        background-color: #eee;\n        padding: 0.2em 0.5em 0.2em 0.5em;\n    }\n    .cell-true {\n        background-color: black;\n        opacity: 0.5;\n    }\n    .cell-false {\n        background-color: white;\n        opacity: 0.5;\n    }\n    .cell-violation {\n        background-color: red;\n        opacity: 0.5;\n    }\n</style>\n<table id=\"table-rotated\">\n    <thead>\n        <tr>\n            <td class=\"controls top-left\">\n                <a id=\"rotate\" href=\"#table-rotated\">rotate</a>\n                <a id=\"unrotate\" href=\"#\">rotate back</a>\n            </td>\n            "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            <td class=\"top-right\"></td>\n        </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n    <tfoot>\n        <tr>\n            <td class=\"bottom-left\"></td>\n            "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            <td class=\"bottom-right\"></td>\n        </tr>\n    </tfoot>\n</table>\n";
},"useData":true,"useDepths":true});
