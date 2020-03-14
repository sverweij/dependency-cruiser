var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['error-html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <tr "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"unviolated") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":183,"column":16},"end":{"line":183,"column":60}}})) != null ? stack1 : "")
    + ">\n                <td>"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"unviolated") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":184,"column":20},"end":{"line":185,"column":66}}})) != null ? stack1 : "")
    + "</td>\n                <td class="
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"unviolated") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data,"loc":{"start":{"line":186,"column":26},"end":{"line":186,"column":81}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"severity") || (depth0 != null ? lookupProperty(depth0,"severity") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"severity","hash":{},"data":data,"loc":{"start":{"line":186,"column":82},"end":{"line":186,"column":94}}}) : helper)))
    + "</td>\n                <td class=\"nowrap\"><a href=\"#"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":187,"column":45},"end":{"line":187,"column":53}}}) : helper)))
    + "-instance\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":187,"column":68},"end":{"line":187,"column":76}}}) : helper)))
    + "-definition\" class=\"noiseless\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":187,"column":107},"end":{"line":187,"column":115}}}) : helper)))
    + "</a>\n                </td>\n                <td><strong>"
    + alias4(((helper = (helper = lookupProperty(helpers,"count") || (depth0 != null ? lookupProperty(depth0,"count") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"count","hash":{},"data":data,"loc":{"start":{"line":189,"column":28},"end":{"line":189,"column":37}}}) : helper)))
    + "</strong></td>\n                <td>"
    + alias4(((helper = (helper = lookupProperty(helpers,"comment") || (depth0 != null ? lookupProperty(depth0,"comment") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"comment","hash":{},"data":data,"loc":{"start":{"line":190,"column":20},"end":{"line":190,"column":31}}}) : helper)))
    + "</td>\n            </tr>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "class=\"unviolated\" ";
},"4":function(container,depth0,helpers,partials,data) {
    return "<span class=\"ok\">&check;</span>";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span\n                        class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"severity") || (depth0 != null ? lookupProperty(depth0,"severity") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"severity","hash":{},"data":data,"loc":{"start":{"line":185,"column":31},"end":{"line":185,"column":43}}}) : helper)))
    + "\">&cross;</span>";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ok") || (depth0 != null ? lookupProperty(depth0,"ok") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ok","hash":{},"data":data,"loc":{"start":{"line":186,"column":45},"end":{"line":186,"column":51}}}) : helper)))
    + "\"";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"severity") || (depth0 != null ? lookupProperty(depth0,"severity") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"severity","hash":{},"data":data,"loc":{"start":{"line":186,"column":61},"end":{"line":186,"column":73}}}) : helper)))
    + "\"";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <h2><svg class=\"p__svg--inline\" viewBox=\"0 0 12 16\" version=\"1.1\" aria-hidden=\"true\">\n            <path fill-rule=\"evenodd\"\n                d=\"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z\">\n            </path>\n        </svg> All violations</h2>\n    <table>\n        <thead>\n            <tr>\n                <th>severity</th>\n                <th>rule</th>\n                <th>from</th>\n                <th>to</th>\n            </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = container.hooks.blockHelperMissing.call(depth0,container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"violations") : stack1), depth0),{"name":"summary.violations","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":222,"column":12},"end":{"line":231,"column":35}}})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n";
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <tr>\n                <td class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"severity") : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"severity") : stack1), depth0))
    + "</td>\n                <td class=\"nowrap\"><a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "-definition\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "-instance\"\n                        class=\"noiseless\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"rule") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "</a></td>\n                <td><a href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depths[1] != null ? lookupProperty(depths[1],"summary") : depths[1])) != null ? lookupProperty(stack1,"optionsUsed") : stack1)) != null ? lookupProperty(stack1,"prefix") : stack1), depth0))
    + alias2(((helper = (helper = lookupProperty(helpers,"from") || (depth0 != null ? lookupProperty(depth0,"from") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":227,"column":62},"end":{"line":227,"column":70}}}) : helper)))
    + "\">"
    + alias2(((helper = (helper = lookupProperty(helpers,"from") || (depth0 != null ? lookupProperty(depth0,"from") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":227,"column":72},"end":{"line":227,"column":80}}}) : helper)))
    + "</a></td>\n                <td>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"to") || (depth0 != null ? lookupProperty(depth0,"to") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"to","hash":{},"data":data,"loc":{"start":{"line":228,"column":20},"end":{"line":228,"column":28}}}) : helper))) != null ? stack1 : "")
    + "</td>\n\n            </tr>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "    <h2><span aria-hidden=\"true\">&hearts;</span> No violations found</h2>\n    <p>Get gummy bears to celebrate.</p>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <title>dependency-cruiser - results</title>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n    <style type=\"text/css\">\n        body {\n            font-family: sans-serif;\n            margin: 0 auto;\n            max-width: 90%;\n            line-height: 1.6;\n            font-size: 14px;\n            color: #444;\n            padding: 0 10px;\n            background-color: #fff;\n        }\n\n        footer {\n            color: gray;\n            margin-top: 1.4em;\n            border-top: solid 1px currentColor\n        }\n\n        a {\n            text-decoration: none\n        }\n\n        a.noiseless {\n            color: currentColor\n        }\n\n        h1,\n        h2,\n        h3 {\n            line-height: 1.2\n        }\n\n        table {\n            border-collapse: collapse;\n            width: 100%;\n        }\n\n        th,\n        td {\n            text-align: left;\n            padding: 4px;\n        }\n\n        tbody tr:nth-child(odd) {\n            background-color: rgba(128, 128, 128, 0.2);\n        }\n\n        .error {\n            color: red;\n        }\n\n        .warn {\n            color: orange;\n        }\n\n        .info {\n            color: blue;\n        }\n\n        .ok {\n            color: limegreen;\n        }\n\n        td.nowrap {\n            white-space: nowrap\n        }\n\n        svg {\n            fill: currentColor\n        }\n\n        #show-unviolated {\n            display: block\n        }\n\n        #hide-unviolated {\n            display: none\n        }\n\n        #show-all-the-rules:target #show-unviolated {\n            display: none\n        }\n\n        #show-all-the-rules:target #hide-unviolated {\n            display: block\n        }\n\n        tr.unviolated {\n            display: none\n        }\n\n        #show-all-the-rules:target tr.unviolated {\n            display: table-row;\n            color: gray;\n        }\n\n        .p__svg--inline {\n            vertical-align: top;\n            width: 1.2em;\n            height: 1.2em\n        }\n\n        .controls {\n            background-color: #fff;\n            vertical-align: bottom;\n            text-align: center\n        }\n\n        .controls:hover {\n            opacity: 1;\n        }\n\n        .controls a {\n            text-decoration: none;\n            color: gray;\n        }\n\n        .controls a:hover {\n            text-decoration: underline;\n            color: blue;\n        }\n\n        .extra {\n            color: gray;\n        }\n    </style>\n    <style type=\"text/css\" media=\"print\">\n        th,\n        td {\n            border: 1px solid #444;\n        }\n\n        .controls {\n            display: none\n        }\n    </style>\n</head>\n\n<body id=\"show-all-the-rules\">\n    <h1>Forbidden dependency check - results</h1>\n    <h2><svg class=\"p__svg--inline\" viewBox=\"0 0 14 16\" version=\"1.1\" aria-hidden=\"true\">\n            <path fill-rule=\"evenodd\"\n                d=\"M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0v2h3.6l.9-1.8.9 5.4L9 8.5l1.6 1.5H14V8h-2.5z\"></path>\n        </svg> Summary</h2>\n    <p>\n        <div style=\"float:left;padding-right:20px\">\n            <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"totalCruised") : stack1), depth0))
    + "</strong> modules\n        </div>\n        <div style=\"float:left;padding-right:20px\">\n            <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"totalDependenciesCruised") : stack1), depth0))
    + "</strong> dependencies\n        </div>\n        <div style=\"float:left;padding-right:20px\">\n            <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"error") : stack1), depth0))
    + "</strong> errors\n        </div>\n        <div style=\"float:left;padding-right:20px\">\n            <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"warn") : stack1), depth0))
    + "</strong> warnings\n        </div>\n        <div style=\"float:left;padding-right:20px\">\n            <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"info") : stack1), depth0))
    + "</strong> informational\n        </div>\n        &nbsp;\n    </p>\n    <table>\n        <tbody>\n            <thead>\n                <tr>\n                    <th></th>\n                    <th>severity</th>\n                    <th>rule</th>\n                    <th>#&nbsp;violations</th>\n                    <th>explanation</th>\n                </tr>\n            </thead>\n"
    + ((stack1 = container.hooks.blockHelperMissing.call(depth0,alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"agggregateViolations") : stack1), depth0),{"name":"summary.agggregateViolations","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":182,"column":12},"end":{"line":192,"column":45}}})) != null ? stack1 : "")
    + "            <tr>\n                <td colspan=\"5\" class=\"controls\">\n                    <div id=\"show-unviolated\">\n                        &downarrow; <a href=\"#show-all-the-rules\">also show unviolated rules</a>\n                    </div>\n                    <div id=\"hide-unviolated\">\n                        &uparrow; <a href=\"\">hide unviolated rules</a>\n                    </div>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"violations") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.program(15, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":206,"column":4},"end":{"line":237,"column":11}}})) != null ? stack1 : "")
    + "    <footer>\n        <p><a href=\"https://github.com/sverweij/dependency-cruiser\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"depcruiseVersion") : stack1), depth0))
    + "</a> /\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"summary") : depth0)) != null ? lookupProperty(stack1,"runDate") : stack1), depth0))
    + "</p>\n    </footer>\n</body>\n\n</html>";
},"useData":true,"useDepths":true});
