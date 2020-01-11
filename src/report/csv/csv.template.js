var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['csv.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"source","hash":{},"data":data,"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":28}}}) : helper))) != null ? stack1 : "")
    + "\",";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"source") || (depth0 != null ? lookupProperty(depth0,"source") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":25}}}) : helper))) != null ? stack1 : "")
    + "\",";
  stack1 = ((helper = (helper = lookupProperty(helpers,"incidences") || (depth0 != null ? lookupProperty(depth0,"incidences") : depth0)) != null ? helper : alias2),(options={"name":"incidences","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":27},"end":{"line":2,"column":75}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"incidences")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\"\"\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"incidence") || (depth0 != null ? lookupProperty(depth0,"incidence") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"incidence","hash":{},"data":data,"loc":{"start":{"line":2,"column":43},"end":{"line":2,"column":58}}}) : helper))) != null ? stack1 : "")
    + "\",";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.hooks.blockHelperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "\"\",";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":3},"end":{"line":1,"column":42}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\"\"\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"modules") || (depth0 != null ? lookupProperty(depth0,"modules") : depth0)) != null ? helper : alias2),(options={"name":"modules","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":3,"column":12}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"modules")) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
