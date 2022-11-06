/* eslint-disable security/detect-object-injection */
import fs from "fs";
import path from "path";
import prettier from "prettier";
import clone from "lodash/clone.js";

function stripAttribute(pObject, pAttribute) {
  const lObject = clone(pObject);
  delete lObject[pAttribute];

  Object.keys(pObject).forEach((pKey) => {
    if (typeof pObject[pKey] === "object") {
      lObject[pKey] = stripAttribute(pObject[pKey], pAttribute);
    }
  });

  return lObject;
}

function emitConsolidatedSchema(pOutputFileName) {
  if (path.extname(pOutputFileName) === ".json") {
    return (pJSONSchemaObject) => {
      fs.writeFileSync(
        pOutputFileName,
        prettier.format(JSON.stringify(pJSONSchemaObject.default), {
          parser: "json",
        }),
        "utf8"
      );
    };
  }
  return (pJSONSchemaObject) => {
    fs.writeFileSync(
      pOutputFileName,
      `/* generated - don't edit */\nmodule.exports=${JSON.stringify(
        stripAttribute(pJSONSchemaObject.default, "description")
      )}`,
      "utf8"
    );
  };
}

function getInputModuleName(pOutputFileName) {
  const lRE =
    path.extname(pOutputFileName) === ".json"
      ? /[^/]+\/([^.]+)\.schema.json/g
      : /[^/]+\/([^.]+)\.schema.js/g;
  return pOutputFileName.replace(lRE, "./$1.schema.mjs");
}

if (process.argv.length === 3) {
  const lOutputFileName = process.argv.pop();

  import(getInputModuleName(lOutputFileName))
    .then(emitConsolidatedSchema(lOutputFileName))
    .catch((pError) => {
      process.exitCode = 2;
      process.stderr.write(`${pError}\n`);
    });
} else {
  process.exitCode = 1;
  process.stderr.write(
    `\nUsage: generate-schemas.utl.mjs <target schema>\n\n  e.g. generate-schemas.utl.mjs ./src/schema/configuration.schema.json\n\n`
  );
}
