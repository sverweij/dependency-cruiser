var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['dot.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.folder : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.path : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fontcolor : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fillcolor : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.matchesDoNotFollow : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.rule : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "]"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.path : depth0),{"name":"each","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "subgraph \"cluster_"
    + ((stack1 = ((helper = (helper = helpers.aggregateSnippet || (depth0 != null ? depth0.aggregateSnippet : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"aggregateSnippet","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" {label=\""
    + ((stack1 = ((helper = (helper = helpers.snippet || (depth0 != null ? depth0.snippet : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"snippet","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "color=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"color","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "fontcolor=\""
    + ((stack1 = ((helper = (helper = helpers.fontcolor || (depth0 != null ? depth0.fontcolor : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"fontcolor","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "fillcolor=\""
    + ((stack1 = ((helper = (helper = helpers.fillcolor || (depth0 != null ? depth0.fillcolor : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"fillcolor","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" ";
},"11":function(container,depth0,helpers,partials,data) {
    return "shape=\"folder\" ";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "tooltip=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.name : stack1), depth0)) != null ? stack1 : "")
    + "\" ";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "URL=\""
    + ((stack1 = ((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"url","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    return " }";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "    \""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" [label=\""
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.color : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fontcolor : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.fillcolor : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.matchesDoNotFollow : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.rule : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.url : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "]\n";
},"21":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(22, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"22":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    \""
    + ((stack1 = container.lambda((depths[1] != null ? depths[1].source : depths[1]), depth0)) != null ? stack1 : "")
    + "\" -> \""
    + ((stack1 = ((helper = (helper = helpers.resolved || (depth0 != null ? depth0.resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"resolved","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.valid : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0, blockParams, depths),"inverse":container.program(26, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.coreModule : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"24":function(container,depth0,helpers,partials,data) {
    return " [color=\"grey\" penwidth=1.0]";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.lambda;

  return " [color=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" penwidth=2.0 tooltip=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.name : stack1), depth0)) != null ? stack1 : "")
    + "\" fontcolor=\""
    + ((stack1 = ((helper = (helper = helpers.color || (depth0 != null ? depth0.color : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"color","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" xlabel=\""
    + ((stack1 = alias4(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.name : stack1), depth0)) != null ? stack1 : "")
    + "\"]";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "strict digraph \"dependency-cruiser output\"{\n    ordering=out\n    rankdir=LR\n    splines=true\n    overlap=false\n    nodesep=0.16\n    ranksep=0.18\n    fontname=\"Helvetica-bold\"\n    fontsize=9\n    style=\"rounded,bold,filled\"\n    fillcolor=\"#ffffff\"\n    compound=true\n    node [shape=box style=\"rounded, filled\" fillcolor=\"#ffffcc\" height=0.2 fontname=Helvetica fontsize=9]\n    edge [color=\"#00000077\" penwidth=2.0 arrowhead=normal fontname=Helvetica fontsize=9]\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(21, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "}\n";
},"useData":true,"useDepths":true});
