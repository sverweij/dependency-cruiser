var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['err-html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <tr "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.unviolated : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":149,"column":20},"end":{"line":149,"column":63}}})) != null ? stack1 : "")
    + ">\n                    <td>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.unviolated : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":150,"column":24},"end":{"line":150,"column":129}}})) != null ? stack1 : "")
    + "</td>\n                    <td class="
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.unviolated : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data,"loc":{"start":{"line":151,"column":30},"end":{"line":151,"column":85}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = helpers.severity || (depth0 != null ? depth0.severity : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"severity","hash":{},"data":data,"loc":{"start":{"line":151,"column":86},"end":{"line":151,"column":98}}}) : helper)))
    + "</td>\n                    <td class=\"nowrap\"><a id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":152,"column":46},"end":{"line":152,"column":54}}}) : helper)))
    + "\" class=\"noiseless\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":152,"column":74},"end":{"line":152,"column":82}}}) : helper)))
    + "</a></td>\n                    <td><strong>"
    + alias4(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"count","hash":{},"data":data,"loc":{"start":{"line":153,"column":32},"end":{"line":153,"column":41}}}) : helper)))
    + "</strong></td>\n                    <td>"
    + alias4(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"comment","hash":{},"data":data,"loc":{"start":{"line":154,"column":24},"end":{"line":154,"column":35}}}) : helper)))
    + "</td>\n                </tr>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "class=\"unviolated\"";
},"4":function(container,depth0,helpers,partials,data) {
    return "<span class=\"ok\">&check;</span>";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\""
    + container.escapeExpression(((helper = (helper = helpers.severity || (depth0 != null ? depth0.severity : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"severity","hash":{},"data":data,"loc":{"start":{"line":150,"column":94},"end":{"line":150,"column":106}}}) : helper)))
    + "\">&cross;</span>";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\""
    + container.escapeExpression(((helper = (helper = helpers.ok || (depth0 != null ? depth0.ok : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ok","hash":{},"data":data,"loc":{"start":{"line":151,"column":49},"end":{"line":151,"column":55}}}) : helper)))
    + "\"";
},"10":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\""
    + container.escapeExpression(((helper = (helper = helpers.severity || (depth0 != null ? depth0.severity : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"severity","hash":{},"data":data,"loc":{"start":{"line":151,"column":65},"end":{"line":151,"column":77}}}) : helper)))
    + "\"";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "        <h2><svg class=\"p__svg--inline\" viewBox=\"0 0 12 16\" version=\"1.1\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z\"></path></svg> All violations</h2>\n        <table>\n            <thead>\n                <tr>\n                    <th>severity</th>\n                    <th>rule</th>\n                    <th>from</th>\n                    <th>to</th>\n                </tr>\n            </thead>\n            <tbody>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.violations : stack1),{"name":"each","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":182,"column":16},"end":{"line":190,"column":25}}})) != null ? stack1 : "")
    + "            </tbody>\n        </table>\n";
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function";

  return "                <tr>\n                    <td class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.severity : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.severity : stack1), depth0))
    + "</td>\n                    <td class=\"nowrap\"><a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" class=\"noiseless\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.rule : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></td>\n                    <td><a href=\""
    + alias2(alias1(((stack1 = ((stack1 = (depths[1] != null ? depths[1].summary : depths[1])) != null ? stack1.optionsUsed : stack1)) != null ? stack1.prefix : stack1), depth0))
    + alias2(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":186,"column":66},"end":{"line":186,"column":74}}}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"from","hash":{},"data":data,"loc":{"start":{"line":186,"column":76},"end":{"line":186,"column":84}}}) : helper)))
    + "</a></td>\n                    <td>"
    + ((stack1 = ((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"to","hash":{},"data":data,"loc":{"start":{"line":187,"column":24},"end":{"line":187,"column":32}}}) : helper))) != null ? stack1 : "")
    + "</td>\n                    \n                </tr>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "        <h2><span aria-hidden=\"true\">&hearts;</span> No violations found</h2>\n        <p>Get gummy bears to celebrate.</p>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <title>dependency-cruiser - results</title>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n        \n        <style type=\"text/css\">\n            body{\n                font-family:sans-serif;\n                margin:0 auto;\n                max-width:90%;\n                line-height:1.6;\n                font-size:14px;\n                color:#444;\n                padding:0 10px;\n                background-color:#fff;\n            }\n            footer{\n                color: gray;\n                margin-top: 1.4em;\n                border-top: solid 1px currentColor\n            }\n            a {\n                text-decoration: none\n            }\n            a.noiseless {\n                color: currentColor\n            }\n            h1,h2,h3{\n                line-height:1.2\n            }\n            table {\n                border-collapse: collapse;\n                width: 100%;\n            }\n            th, td {\n                text-align: left;\n                padding: 4px;\n            }\n            tbody tr:nth-child(odd){\n                background-color: rgba(128,128,128,0.2);\n            }\n            .error {\n                color: red;\n            }\n            .warn {\n                color: orange;\n            }\n            .info {\n                color: blue;\n            }\n            .ok {\n                color: limegreen;\n            }\n            td.nowrap {\n                white-space: nowrap\n            }\n            svg{\n                fill:currentColor\n            }\n            #show-unviolated {\n                display: block\n                \n            }\n            #hide-unviolated {\n                display: none\n            }\n            #show-all-the-rules:target #show-unviolated{\n                display: none\n            }\n            #show-all-the-rules:target #hide-unviolated{\n                display: block\n            }\n            tr.unviolated {\n                display: none\n            }\n            #show-all-the-rules:target tr.unviolated {\n                display: table-row;\n                color: gray;\n            }\n            .p__svg--inline{\n                vertical-align: top;\n                width: 1.2em;\n                height: 1.2em\n            }\n            .controls {\n                background-color: #fff;\n                vertical-align: bottom;\n                text-align: center\n            }\n            .controls:hover {\n                opacity: 1;\n            }\n            .controls a {\n                text-decoration: none;\n                color: gray;\n            }\n            .controls a:hover {\n                text-decoration: underline;\n                color: blue;\n            }\n            .extra {\n                color: gray;\n            }\n        </style>\n        <style type=\"text/css\" media=\"print\">\n            th, td {\n                border: 1px solid #444;\n            }\n            .controls {\n                display: none\n            }\n        </style>\n    </head>\n    <body id=\"show-all-the-rules\">\n        <h1>Forbidden dependency check - results</h1>\n        <h2><svg class=\"p__svg--inline\" viewBox=\"0 0 14 16\" version=\"1.1\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0v2h3.6l.9-1.8.9 5.4L9 8.5l1.6 1.5H14V8h-2.5z\"></path></svg> Summary</h2>\n        <p>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.totalCruised : stack1), depth0))
    + "</strong> modules\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.totalDependenciesCruised : stack1), depth0))
    + "</strong> dependencies\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.error : stack1), depth0))
    + "</strong> errors\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.warn : stack1), depth0))
    + "</strong> warnings\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.info : stack1), depth0))
    + "</strong> informational\n            </div>\n            &nbsp;\n        </p>\n        <table>\n            <tbody>\n                <thead>\n                    <tr>\n                        <th></th>\n                        <th>severity</th>\n                        <th>rule</th>\n                        <th>#&nbsp;violations</th>\n                        <th>explanation</th>\n                    </tr>\n                </thead>\n"
    + ((stack1 = helpers.each.call(alias3,((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.agggregateViolations : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":148,"column":16},"end":{"line":156,"column":25}}})) != null ? stack1 : "")
    + "                <tr>\n                    <td colspan=\"5\" class=\"controls\">\n                        <div id=\"show-unviolated\">\n                            &downarrow; <a href=\"#show-all-the-rules\">also show unviolated rules</a>\n                        </div>\n                        <div id=\"hide-unviolated\">\n                            &uparrow; <a href=\"\">hide unviolated rules</a>\n                        </div>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.violations : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.program(15, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":170,"column":8},"end":{"line":196,"column":15}}})) != null ? stack1 : "")
    + "        <footer>\n            <p><a href=\"https://github.com/sverweij/dependency-cruiser\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.depcruiseVersion : stack1), depth0))
    + "</a> / "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.runDate : stack1), depth0))
    + "</p>\n        </footer>\n    </body>\n</html>\n";
},"useData":true,"useDepths":true});
