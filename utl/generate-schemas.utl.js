const fs = require("fs");
const path = require("path");
const configurationSchema = require("./schema/configuration.schema.js");
const cruiseResultSchema = require("./schema/cruise-result.schema.js");

function jsonTheSchema(pJSONSchemaObject, pOutputFileName) {
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "schema", pOutputFileName),
    JSON.stringify(pJSONSchemaObject, null, "  "),
    "utf8"
  );
}

jsonTheSchema(configurationSchema, "configuration.schema.json");
jsonTheSchema(cruiseResultSchema, "cruise-result.schema.json");
