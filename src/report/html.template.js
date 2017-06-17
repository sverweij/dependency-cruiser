var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<th><div"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.coreModule : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper)))
    + "</div></th>";
},"2":function(container,depth0,helpers,partials,data) {
    return " class=\"cell-core-module\"";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.couldNotResolve : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return " class=\"cell-unresolvable-module\"";
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <tr>\n                    <td class=\"first-cell"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.coreModule : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias4(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper)))
    + "</td>\n                    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.incidences : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    <td class=\"first-cell"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.coreModule : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias4(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper)))
    + "</td>\n                </tr>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return " cell-core-module";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.couldNotResolve : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    return " cell-unresolvable-module";
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<td class=\"cell cell-"
    + container.escapeExpression(((helper = (helper = helpers.incidence || (depth0 != null ? depth0.incidence : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"incidence","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasRelation : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "></td>";
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression;

  return " title=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.rule : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + alias2(container.lambda((depths[1] != null ? depths[1].source : depths[1]), depth0))
    + " ->\n        "
    + alias2(((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"to","hash":{},"data":data}) : helper)))
    + "\"";
},"15":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.rule || (depth0 != null ? depth0.rule : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"rule","hash":{},"data":data}) : helper)))
    + ":\n        ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset=\"utf-8\">\n        <title>dependency-cruiser output</title>\n        <style media=\"screen\">\n            html {\n                font-family: sans-serif;\n                font-size: 10pt;\n            }\n            table, td.controls {\n                transition-duration: 0.4s;\n            }\n            table, th, td{\n                border: solid black 1px;\n                border-collapse: collapse;\n                font-size: inherit;\n            }\n            th{\n                text-align:start;\n                vertical-align: bottom;\n                max-width: 1em;\n                max-height: 30em;\n                height: 20em;\n                font-weight: normal;\n                white-space: nowrap;\n                overflow: hidden;\n            }\n            th div {\n                transform: rotateZ(-90deg);\n                transform-origin: 0.5em;\n                text-align: start;\n                height: 1em;\n                width: 30em;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n            }\n            td {\n                text-align: center;\n            }\n            td.first-cell {\n                text-align: left;\n                white-space: nowrap;\n                overflow: hidden;\n                text-overflow: ellipsis;\n            }\n            td.top-left {\n                border-top: solid 1px transparent;\n                border-left: solid 1px transparent;\n            }\n            td.top-right {\n                border-top: solid 1px transparent;\n                border-right: solid 1px transparent;\n            }\n            td.bottom-left {\n                border-bottom: solid 1px transparent;\n                border-left: solid 1px transparent;\n            }\n            td.bottom-right {\n                border-bottom: solid 1px transparent;\n                border-right: solid 1px transparent;\n            }\n            tbody tr:hover {\n                background-color: lightgrey;\n            }\n            #table-rotated:target {\n                transform: rotateZ(45deg);\n                transform-origin: bottom left;\n            }\n            #table-rotated:target #unrotate {\n                opacity: 1;\n            }\n            #table-rotated:target #rotate {\n                opacity: 0;\n            }\n            #unrotate {\n                opacity: 0;\n            }\n            #rotate {\n                opacity: 1;\n            }\n            .controls {\n                opacity: 0.2;\n                vertical-align: bottom;\n                padding: 0.5em;\n            }\n            .controls:hover {\n                opacity: 1;\n            }\n            .controls a {\n                font-style: normal;\n                text-decoration: none;\n                background-color: #eee;\n                padding: 0.2em 0.5em 0.2em 0.5em;\n            }\n            .cell-core-module {\n                color: grey;\n                font-style: italic;\n            }\n            .cell-unresolvable-module {\n                color: red;\n                font-style: italic;\n            }\n            .cell-true {\n                background-color: black;\n                opacity: 0.5;\n            }\n            .cell-false {\n                background-color: white;\n                opacity: 0.5;\n            }\n            .cell-error {\n                background-color: red;\n                opacity: 0.5;\n            }\n            .cell-warn {\n                background-color: orange;\n                opacity: 0.5;\n            }\n            .cell-info {\n                background-color: blue;\n                opacity: 0.5;\n            }\n        </style>\n    </head>\n    <body>\n        <table id=\"table-rotated\">\n            <thead>\n                <tr>\n                    <td class=\"controls top-left\">\n                        <a id=\"rotate\" href=\"#table-rotated\">rotate</a>\n                        <a id=\"unrotate\" href=\"#\">rotate back</a>\n                    </td>\n                    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    <td class=\"top-right\"></td>\n                </tr>\n            </thead>\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n            <tfoot>\n                <tr>\n                    <td class=\"bottom-left\"></td>\n                    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                    <td class=\"bottom-right\"></td>\n                </tr>\n            </tfoot>\n        </table>\n    </body>\n</html>\n";
},"useData":true,"useDepths":true});
