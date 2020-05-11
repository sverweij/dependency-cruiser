/* eslint-disable sort-imports */
import fs from "fs";
import path from "path";
import prettier from "prettier";
import configurationSchema from "./schema/configuration.schema.mjs";
import cruiseResultSchema from "./schema/cruise-result.schema.mjs";

const DIRNAME = path.dirname(new URL(import.meta.url).pathname);

function jsonTheSchema(pJSONSchemaObject, pOutputFileName) {
  fs.writeFileSync(
    path.normalize(path.join(DIRNAME, "..", "src", "schema", pOutputFileName)),
    prettier.format(JSON.stringify(pJSONSchemaObject), { parser: "json" }),
    "utf8"
  );
}

jsonTheSchema(configurationSchema, "configuration.schema.json");
jsonTheSchema(cruiseResultSchema, "cruise-result.schema.json");
