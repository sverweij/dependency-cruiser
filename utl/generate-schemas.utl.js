const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const configurationSchema = require("./schema/configuration.schema.js");
const cruiseResultSchema = require("./schema/cruise-result.schema.js");

function jsonTheSchema(pJSONSchemaObject, pOutputFileName) {
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "schema", pOutputFileName),
    prettier.format(JSON.stringify(pJSONSchemaObject), { parser: "json" }),
    "utf8"
  );
}

jsonTheSchema(configurationSchema, "configuration.schema.json");
jsonTheSchema(cruiseResultSchema, "cruise-result.schema.json");
