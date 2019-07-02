var Handlebars = require("handlebars/runtime");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['err-html.template.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "        <table>\n            <tbody>\n                <thead>\n                    <tr>\n                        <th>severity</th>\n                        <th>rule</th>\n                        <th>#&nbsp;violations</th>\n                        <th>explanation</th>\n                    </tr>\n                </thead>\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.agggregateViolations : stack1),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n        </table>\n        <h2><svg class=\"p__svg--inline\" viewBox=\"0 0 12 16\" version=\"1.1\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z\"></path></svg> All violations</h2>\n        <table>\n            <thead>\n                <tr>\n                    <th>severity</th>\n                    <th>rule</th>\n                    <th>from</th>\n                    <th>to</th>\n                </tr>\n            </thead>\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.violations : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n        </table>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <tr>\n                    <td class=\""
    + alias4(((helper = (helper = helpers.severity || (depth0 != null ? depth0.severity : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"severity","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.severity || (depth0 != null ? depth0.severity : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"severity","hash":{},"data":data}) : helper)))
    + "</td>\n                    <td class=\"nowrap\"><a id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"noiseless\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a></td>\n                    <td><strong>"
    + alias4(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"count","hash":{},"data":data}) : helper)))
    + "</strong></td>\n                    <td>"
    + alias4(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"comment","hash":{},"data":data}) : helper)))
    + "</td>\n                </tr>\n";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

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
    + alias2(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"from","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"from","hash":{},"data":data}) : helper)))
    + "</a></td>\n                    <td>"
    + alias2(((helper = (helper = helpers.to || (depth0 != null ? depth0.to : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"to","hash":{},"data":data}) : helper)))
    + "</td>\n                </tr>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "        <p>No violations found. Get gummy bears to celebrate.</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset=\"utf-8\">\n        <title>dependency-cruiser - results</title>\n        <style type=\"text/css\" media=\"screen\">\n            body{\n                font-family:sans-serif;\n                margin:0 auto;\n                max-width:90%;\n                line-height:1.6;\n                font-size:14px;\n                color:#444;\n                padding:0 10px;\n                background-color:#fff;\n            }\n            footer{\n                color: gray;\n                margin-top: 1.4em;\n                border-top: solid 1px currentColor\n            }\n            a {\n                text-decoration: none\n            }\n            a.noiseless {\n                color: currentColor\n            }\n            h1,h2,h3{\n                line-height:1.2\n            }\n            table {\n                border-collapse: collapse;\n            }\n            th, td {\n                text-align: left;\n                border: 4px solid transparent;\n            }\n            tbody tr:nth-child(odd){\n                background-color: rgba(128,128,128,0.2);\n            }\n            td.error {\n                color: red;\n            }\n            td.warn {\n                color: orange;\n            }\n            td.info {\n                color: blue;\n            }\n            td.nowrap {\n                white-space: nowrap\n            }\n            svg{\n                fill:currentColor\n            }\n            .p__svg--inline{\n                vertical-align: top;\n                width: 1.2em;\n                height: 1.2em\n            }\n        </style>\n    </head>\n    <body>\n        <h1>Forbidden dependency check - results</h1>\n        <h2><svg class=\"p__svg--inline\" viewBox=\"0 0 14 16\" version=\"1.1\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0v2h3.6l.9-1.8.9 5.4L9 8.5l1.6 1.5H14V8h-2.5z\"></path></svg> Summary</h2>\n        <p>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.totalCruised : stack1), depth0))
    + "</strong> modules\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.totalDependenciesCruised : stack1), depth0))
    + "</strong> dependencies\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.error : stack1), depth0))
    + "</strong> errors\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.warn : stack1), depth0))
    + "</strong> warnings\n            </div>\n            <div style=\"float:left;padding-right:20px\">\n                <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.info : stack1), depth0))
    + "</strong> informational\n            </div>\n            &nbsp;\n        </p>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.violations : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "        <footer>\n            <p><a href=\"https://github.com/sverweij/dependency-cruiser\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.depcruiseVersion : stack1), depth0))
    + "</a> / "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.summary : depth0)) != null ? stack1.runDate : stack1), depth0))
    + "</p>\n        </footer>\n    </body>\n</html>\n";
},"useData":true,"useDepths":true});
