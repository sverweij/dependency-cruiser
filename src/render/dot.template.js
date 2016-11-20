var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dot.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "    \""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "    \""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" -> {\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    }\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "        \""
    + ((stack1 = ((helper = (helper = helpers.resolved || (depth0 != null ? depth0.resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"resolved","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "digraph \"dependency-cruiser output\"{\n    ordering=out\n    rankdir=LR\n    splines=true\n    overlap=false\n    nodesep=0.16\n    node [shape=box style=\"rounded, filled\" fillcolor=\"#ffffcc\" height=0.2 fontname=Helvetica fontsize=9]\n    edge [color=black arrowhead=normal fontname=\"Helvetica\" fontsize=\"9\"]\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "}\n";
},"useData":true});
