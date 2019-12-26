var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['csv.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "\""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"source","hash":{},"data":data,"loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":33}}}) : helper))) != null ? stack1 : "")
    + "\",";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"source","hash":{},"data":data,"loc":{"start":{"line":2,"column":18},"end":{"line":2,"column":30}}}) : helper))) != null ? stack1 : "")
    + "\","
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.incidences : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":32},"end":{"line":2,"column":79}}})) != null ? stack1 : "")
    + "\"\"\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "\""
    + ((stack1 = ((helper = (helper = helpers.incidence || (depth0 != null ? depth0.incidence : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"incidence","hash":{},"data":data,"loc":{"start":{"line":2,"column":53},"end":{"line":2,"column":68}}}) : helper))) != null ? stack1 : "")
    + "\",";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\"\","
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.modules : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":3},"end":{"line":1,"column":44}}})) != null ? stack1 : "")
    + "\"\"\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.modules : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":3,"column":9}}})) != null ? stack1 : "");
},"useData":true});
