var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['vis.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                    {id: \""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\", label: \""
    + ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\", group: \""
    + ((stack1 = ((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"path","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"},\n";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper;

  return "                    {from: \""
    + ((stack1 = container.lambda((depths[1] != null ? depths[1].source : depths[1]), depth0)) != null ? stack1 : "")
    + "\", to: \""
    + ((stack1 = ((helper = (helper = helpers.resolved || (depth0 != null ? depth0.resolved : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"resolved","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\", arrows: \"to\"},\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset=\"utf-8\">\n        <title>dependency-cruiser vis.js output</title>\n\n        <style>\n            body {\n                color: black;\n                font: 12pt sans-serif;\n                background-color: white;\n            }\n\n            #mynetwork {\n                position: fixed;\n                z-index: 1;\n                background-color: transparent;\n                color: transparent;\n                width: 100%;\n                height: 100%;\n                resize: none;\n                cursor: default;\n            }\n        </style>\n\n        <script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.js\"></script>\n        <link href=\"https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1//vis.css\" rel=\"stylesheet\" type=\"text/css\">\n    </head>\n\n    <body>\n\n    <div id=\"mynetwork\"></div>\n        <script type=\"text/javascript\">\n            var color = 'gray';\n            var len = undefined;\n\n            var nodes = [\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            ];\n            var edges = [\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.things : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            ]\n\n            // create a network\n            var container = document.getElementById('mynetwork');\n            var data = {\n                nodes: nodes,\n                edges: edges\n            };\n            var options = {\n                // layout: {\n                //     hierarchical: {\n                //         direction: \"UD\"\n                //     }\n                // },\n                physics: {\n                    enabled: true,\n                    // barnesHut: {\n                    //     avoidOverlap: 0.8\n                    // }\n                },\n                nodes: {\n                    shape: 'box',\n                    size: 10,\n                    font: {\n                        size: 18,\n                        color: 'black'\n                    },\n                    borderWidth: 2,\n                    shadow: true\n                },\n                edges: {\n                    width: 2,\n                    shadow: true\n                }\n            };\n            network = new vis.Network(container, data, options);\n        </script>\n    </body>\n</html>\n";
},"useData":true,"useDepths":true});
