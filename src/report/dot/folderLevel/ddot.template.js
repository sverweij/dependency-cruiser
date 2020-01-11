var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ddot.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"folder") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(19, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":17,"column":4},"end":{"line":22,"column":11}}})) != null ? stack1 : "");
  stack1 = ((helper = (helper = lookupProperty(helpers,"dependencies") || (depth0 != null ? lookupProperty(depth0,"dependencies") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"dependencies","hash":{},"fn":container.program(21, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":4},"end":{"line":28,"column":21}}}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"dependencies")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"path") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":4},"end":{"line":18,"column":184}}})) != null ? stack1 : "")
    + "\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":19,"column":9},"end":{"line":19,"column":21}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":19,"column":31},"end":{"line":19,"column":42}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"color") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":44},"end":{"line":19,"column":84}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"fontcolor") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":84},"end":{"line":19,"column":136}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"fillcolor") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":136},"end":{"line":19,"column":188}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"matchesDoNotFollow") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":188},"end":{"line":19,"column":236}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"rule") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":236},"end":{"line":19,"column":281}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"url") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":281},"end":{"line":19,"column":316}}})) != null ? stack1 : "")
    + "]"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"path") : depth0),{"name":"each","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":317},"end":{"line":19,"column":342}}})) != null ? stack1 : "")
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "subgraph \"cluster_"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"aggregateSnippet") || (depth0 != null ? lookupProperty(depth0,"aggregateSnippet") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aggregateSnippet","hash":{},"data":data,"loc":{"start":{"line":18,"column":36},"end":{"line":18,"column":58}}}) : helper))) != null ? stack1 : "")
    + "\" {label=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"snippet") || (depth0 != null ? lookupProperty(depth0,"snippet") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"snippet","hash":{},"data":data,"loc":{"start":{"line":18,"column":68},"end":{"line":18,"column":81}}}) : helper))) != null ? stack1 : "")
    + "\" \""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"aggregateSnippet") || (depth0 != null ? lookupProperty(depth0,"aggregateSnippet") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aggregateSnippet","hash":{},"data":data,"loc":{"start":{"line":18,"column":84},"end":{"line":18,"column":106}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\".\" width=\"0.5\"] ";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "color=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"color") || (depth0 != null ? lookupProperty(depth0,"color") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"color","hash":{},"data":data,"loc":{"start":{"line":19,"column":64},"end":{"line":19,"column":75}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "fontcolor=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"fontcolor") || (depth0 != null ? lookupProperty(depth0,"fontcolor") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"fontcolor","hash":{},"data":data,"loc":{"start":{"line":19,"column":112},"end":{"line":19,"column":127}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "fillcolor=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"fillcolor") || (depth0 != null ? lookupProperty(depth0,"fillcolor") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"fillcolor","hash":{},"data":data,"loc":{"start":{"line":19,"column":164},"end":{"line":19,"column":179}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"11":function(container,depth0,helpers,partials,data) {
    return "shape=\"folder\" ";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "tooltip=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0)) != null ? stack1 : "")
    + "\" ";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "URL=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"url") || (depth0 != null ? lookupProperty(depth0,"url") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"url","hash":{},"data":data,"loc":{"start":{"line":19,"column":298},"end":{"line":19,"column":307}}}) : helper))) != null ? stack1 : "")
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    return " }";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    \""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":21,"column":5},"end":{"line":21,"column":17}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":21,"column":27},"end":{"line":21,"column":38}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"color") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":40},"end":{"line":21,"column":80}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"fontcolor") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":80},"end":{"line":21,"column":132}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"fillcolor") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":132},"end":{"line":21,"column":184}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"matchesDoNotFollow") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":184},"end":{"line":21,"column":232}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"rule") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":232},"end":{"line":21,"column":277}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"url") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":277},"end":{"line":21,"column":312}}})) != null ? stack1 : "")
    + "]\n";
},"21":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    \""
    + ((stack1 = container.lambda((depths[1] != null ? lookupProperty(depths[1],"source") : depths[1]), depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"resolved") || (depth0 != null ? lookupProperty(depth0,"resolved") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"resolved","hash":{},"data":data,"loc":{"start":{"line":24,"column":26},"end":{"line":24,"column":40}}}) : helper))) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"valid") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0, blockParams, depths),"inverse":container.program(25, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":25,"column":4},"end":{"line":27,"column":133}}})) != null ? stack1 : "")
    + "\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"coreModule") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":8},"end":{"line":26,"column":62}}})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    return " [color=\"grey\" penwidth=1.0]";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " [color=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"color") || (depth0 != null ? lookupProperty(depth0,"color") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data,"loc":{"start":{"line":27,"column":22},"end":{"line":27,"column":33}}}) : helper))) != null ? stack1 : "")
    + "\" penwidth=\"2.0\" tooltip=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0)) != null ? stack1 : "")
    + "\" fontcolor=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"color") || (depth0 != null ? lookupProperty(depth0,"color") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data,"loc":{"start":{"line":27,"column":87},"end":{"line":27,"column":98}}}) : helper))) != null ? stack1 : "")
    + "\" xlabel=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0)) != null ? stack1 : "")
    + "\"]";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "strict digraph \"dependency-cruiser output\"{\n    ordering=out\n    rankdir=LR\n    splines=true\n    overlap=true\n    nodesep=0.16\n    ranksep=0.18\n    fontname=\"Helvetica-bold\"\n    fontsize=9\n    style=\"rounded,bold,filled\"\n    fillcolor=\"#ffffff\"\n    compound=true\n    node [shape=folder style=\"rounded, filled\" fillcolor=\"#ffffcc\" height=0.2 fontname=Helvetica fontsize=9]\n    edge [color=\"#00000033\" penwidth=2.0 arrowsize=0.6 arrowhead=normal fontname=Helvetica fontsize=9]\n\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"modules","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":0},"end":{"line":29,"column":12}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "}\n";
},"useData":true,"useDepths":true});
