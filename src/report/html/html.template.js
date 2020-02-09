var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<th>\n          <div"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"coreModule") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":192,"column":14},"end":{"line":193,"column":59}}})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":193,"column":60},"end":{"line":193,"column":70}}}) : helper)))
    + "</div>\n        </th>";
},"2":function(container,depth0,helpers,partials,data) {
    return " class=\"cell-core-module\" ";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"couldNotResolve") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":192,"column":66},"end":{"line":193,"column":52}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "\n            class=\"cell-unresolvable-module\" ";
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "      <tr>\n        <td\n          class=\"first-cell"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"coreModule") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":202,"column":27},"end":{"line":202,"column":132}}})) != null ? stack1 : "")
    + "\">\n          "
    + alias4(((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":203,"column":10},"end":{"line":203,"column":20}}}) : helper)))
    + "</td>\n        ";
  stack1 = ((helper = (helper = lookupProperty(helpers,"incidences") || (depth0 != null ? lookupProperty(depth0,"incidences") : depth0)) != null ? helper : alias2),(options={"name":"incidences","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":204,"column":8},"end":{"line":206,"column":40}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"incidences")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n        <td\n          class=\"first-cell"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"coreModule") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":208,"column":27},"end":{"line":208,"column":132}}})) != null ? stack1 : "")
    + "\">\n          "
    + alias4(((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":209,"column":10},"end":{"line":209,"column":20}}}) : helper)))
    + "</td>\n      </tr>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return " cell-core-module";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"couldNotResolve") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":202,"column":70},"end":{"line":202,"column":125}}})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    return " cell-unresolvable-module";
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<td class=\"cell cell-"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"incidence") || (depth0 != null ? lookupProperty(depth0,"incidence") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"incidence","hash":{},"data":data,"loc":{"start":{"line":204,"column":44},"end":{"line":204,"column":57}}}) : helper)))
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasRelation") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":204,"column":59},"end":{"line":206,"column":19}}})) != null ? stack1 : "")
    + "></td>";
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " title=\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"rule") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":204,"column":86},"end":{"line":205,"column":11}}})) != null ? stack1 : "")
    + alias2(container.lambda((depths[1] != null ? lookupProperty(depths[1],"source") : depths[1]), depth0))
    + " ->\n    "
    + alias2(((helper = (helper = lookupProperty(helpers,"to") || (depth0 != null ? lookupProperty(depth0,"to") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"to","hash":{},"data":data,"loc":{"start":{"line":206,"column":4},"end":{"line":206,"column":10}}}) : helper)))
    + "\" ";
},"15":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"rule") || (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"rule","hash":{},"data":data,"loc":{"start":{"line":204,"column":99},"end":{"line":204,"column":107}}}) : helper)))
    + ":\n    ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "<!DOCTYPE html>\n<html>\n\n<head>\n  <meta charset=\"utf-8\">\n  <title>dependency-cruiser output</title>\n  <style media=\"screen\">\n    html {\n      font-family: sans-serif;\n      font-size: 10pt;\n    }\n\n    table {\n      overflow: hidden;\n    }\n\n    table,\n    td.controls {\n      transition-duration: 0.3s;\n    }\n\n    table,\n    th,\n    td {\n      border: solid black 1px;\n      border-collapse: collapse;\n      font-size: inherit;\n    }\n\n    td,\n    th {\n      position: relative;\n    }\n\n    th {\n      text-align: start;\n      vertical-align: bottom;\n      max-width: 1em;\n      max-height: 30em;\n      height: 20em;\n      font-weight: normal;\n      white-space: nowrap;\n      overflow: hidden;\n    }\n\n    th div {\n      transform: rotateZ(-90deg);\n      transform-origin: 0.5em;\n      text-align: start;\n      height: 1em;\n      width: 30em;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    td {\n      text-align: center;\n    }\n\n    td.first-cell {\n      text-align: left;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    td.top-left {\n      border-top: solid 1px transparent;\n      border-left: solid 1px transparent;\n    }\n\n    td.top-right {\n      border-top: solid 1px transparent;\n      border-right: solid 1px transparent;\n    }\n\n    td.bottom-left {\n      border-bottom: solid 1px transparent;\n      border-left: solid 1px transparent;\n    }\n\n    td.bottom-right {\n      border-bottom: solid 1px transparent;\n      border-right: solid 1px transparent;\n    }\n\n    tbody tr:hover {\n      background-color: lightgrey;\n    }\n\n    td:hover::after,\n    td:focus::after,\n    th:hover::after,\n    th:focus::after {\n      background-color: #00000077;\n      content: \"\";\n      height: 5000px;\n      left: 0;\n      position: absolute;\n      top: -2500px;\n      width: 100%;\n      z-index: -1;\n    }\n\n    #table-rotated:target {\n      transform: rotateZ(45deg);\n      transform-origin: bottom left;\n    }\n\n    #table-rotated:target #unrotate {\n      opacity: 1;\n    }\n\n    #table-rotated:target #rotate {\n      opacity: 0;\n    }\n\n    #unrotate {\n      opacity: 0;\n    }\n\n    #rotate {\n      opacity: 1;\n    }\n\n    .controls {\n      opacity: 0.2;\n      vertical-align: bottom;\n      padding: 0.5em;\n    }\n\n    .controls:hover {\n      opacity: 1;\n    }\n\n    .controls a {\n      font-style: normal;\n      text-decoration: none;\n      background-color: #eee;\n      padding: 0.2em 0.5em 0.2em 0.5em;\n    }\n\n    .cell-core-module {\n      color: grey;\n      font-style: italic;\n    }\n\n    .cell-unresolvable-module {\n      color: red;\n      font-style: italic;\n    }\n\n    .cell-true {\n      background-color: black;\n      opacity: 0.5;\n    }\n\n    .cell-false {\n      background-color: white;\n      opacity: 0.5;\n    }\n\n    .cell-error {\n      background-color: red;\n      opacity: 0.5;\n    }\n\n    .cell-warn {\n      background-color: orange;\n      opacity: 0.5;\n    }\n\n    .cell-info {\n      background-color: blue;\n      opacity: 0.5;\n    }\n  </style>\n</head>\n\n<body>\n  <table id=\"table-rotated\">\n    <thead>\n      <tr>\n        <td class=\"controls top-left\">\n          <a id=\"rotate\" href=\"#table-rotated\">rotate</a>\n          <a id=\"unrotate\" href=\"#\">rotate back</a>\n        </td>\n        ";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":191,"column":8},"end":{"line":194,"column":25}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n        <td class=\"top-right\"></td>\n      </tr>\n    </thead>\n    <tbody>\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":199,"column":6},"end":{"line":211,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "    </tbody>\n    <tfoot>\n      <tr>\n        <td class=\"bottom-left\"></td>\n        ";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":216,"column":8},"end":{"line":219,"column":25}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n        <td class=\"bottom-right\"></td>\n      </tr>\n    </tfoot>\n  </table>\n</body>\n</html>";
},"useData":true,"useDepths":true});
