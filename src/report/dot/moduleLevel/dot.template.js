var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dot.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"graphAttrs") || (depth0 != null ? lookupProperty(depth0,"graphAttrs") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"graphAttrs","hash":{},"data":data,"loc":{"start":{"line":2,"column":22},"end":{"line":2,"column":38}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "node ["
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"nodeAttrs") || (depth0 != null ? lookupProperty(depth0,"nodeAttrs") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"nodeAttrs","hash":{},"data":data,"loc":{"start":{"line":3,"column":27},"end":{"line":3,"column":42}}}) : helper))) != null ? stack1 : "")
    + "]";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "edge ["
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"edgeAttrs") || (depth0 != null ? lookupProperty(depth0,"edgeAttrs") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"edgeAttrs","hash":{},"data":data,"loc":{"start":{"line":4,"column":27},"end":{"line":4,"column":42}}}) : helper))) != null ? stack1 : "")
    + "]";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"folder") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":7,"column":4},"end":{"line":12,"column":11}}})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"path") : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":4},"end":{"line":8,"column":93}}})) != null ? stack1 : "")
    + "\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":21}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":9,"column":31},"end":{"line":9,"column":42}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"rule") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":44},"end":{"line":9,"column":89}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"URL") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":89},"end":{"line":9,"column":123}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"themeAttrs") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":123},"end":{"line":9,"column":164}}})) != null ? stack1 : "")
    + "]"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"path") : depth0),{"name":"each","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":165},"end":{"line":9,"column":190}}})) != null ? stack1 : "")
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "subgraph \"cluster_"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"aggregateSnippet") || (depth0 != null ? lookupProperty(depth0,"aggregateSnippet") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aggregateSnippet","hash":{},"data":data,"loc":{"start":{"line":8,"column":36},"end":{"line":8,"column":58}}}) : helper))) != null ? stack1 : "")
    + "\" {label=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"snippet") || (depth0 != null ? lookupProperty(depth0,"snippet") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"snippet","hash":{},"data":data,"loc":{"start":{"line":8,"column":68},"end":{"line":8,"column":81}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "tooltip=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0)) != null ? stack1 : "")
    + "\" ";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "URL=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"URL") || (depth0 != null ? lookupProperty(depth0,"URL") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"URL","hash":{},"data":data,"loc":{"start":{"line":9,"column":105},"end":{"line":9,"column":114}}}) : helper))) != null ? stack1 : "")
    + "\" ";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"themeAttrs") || (depth0 != null ? lookupProperty(depth0,"themeAttrs") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"themeAttrs","hash":{},"data":data,"loc":{"start":{"line":9,"column":141},"end":{"line":9,"column":157}}}) : helper))) != null ? stack1 : "");
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
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":11,"column":5},"end":{"line":11,"column":17}}}) : helper))) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":11,"column":27},"end":{"line":11,"column":38}}}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"rule") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":40},"end":{"line":11,"column":85}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"URL") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":85},"end":{"line":11,"column":119}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"themeAttrs") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":119},"end":{"line":11,"column":160}}})) != null ? stack1 : "")
    + "]\n";
},"21":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = "";

  stack1 = ((helper = (helper = lookupProperty(helpers,"dependencies") || (depth0 != null ? lookupProperty(depth0,"dependencies") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"dependencies","hash":{},"fn":container.program(22, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":4},"end":{"line":18,"column":21}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"dependencies")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"22":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    \""
    + ((stack1 = container.lambda((depths[1] != null ? lookupProperty(depths[1],"source") : depths[1]), depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"resolved") || (depth0 != null ? lookupProperty(depth0,"resolved") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"resolved","hash":{},"data":data,"loc":{"start":{"line":17,"column":26},"end":{"line":17,"column":40}}}) : helper))) != null ? stack1 : "")
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasExtraAttributes") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":41},"end":{"line":17,"column":193}}})) != null ? stack1 : "")
    + "\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " ["
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":69},"end":{"line":17,"column":144}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"themeAttrs") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":144},"end":{"line":17,"column":185}}})) != null ? stack1 : "")
    + "]";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "xlabel=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0)) != null ? stack1 : "")
    + "\" tooltip=\""
    + ((stack1 = alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0)) != null ? stack1 : "")
    + "\" ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "strict digraph \"dependency-cruiser output\"{\n    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"graphAttrs") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":45}}})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"nodeAttrs") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":50}}})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"edgeAttrs") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":50}}})) != null ? stack1 : "")
    + "\n\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":13,"column":12}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(21, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":19,"column":12}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "}\n";
},"useData":true,"useDepths":true});
