var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['csv.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "\""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\",";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "\""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\","
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.incidences : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\"\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.incidence : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\",";
},"5":function(container,depth0,helpers,partials,data) {
    return "1";
},"7":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\"\","
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\"\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
