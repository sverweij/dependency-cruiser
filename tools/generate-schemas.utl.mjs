/* eslint-disable security/detect-object-injection */
import { writeFileSync } from "node:fs";
import { extname } from "node:path";
import prettier from "prettier";
import babel from "@babel/core";

function stripAttribute(pObject, pAttribute) {
  const lObject = structuredClone(pObject);
  delete lObject[pAttribute];

  Object.keys(pObject).forEach((pKey) => {
    if (typeof pObject[pKey] === "object") {
      lObject[pKey] = stripAttribute(pObject[pKey], pAttribute);
    }
  });

  return lObject;
}

function emitConsolidatedSchema(pOutputFileName) {
  if (extname(pOutputFileName) === ".json") {
    return async (pJSONSchemaObject) => {
      const lFormattedJSON = await prettier.format(
        JSON.stringify(pJSONSchemaObject.default),
        {
          parser: "json",
        },
      );
      writeFileSync(pOutputFileName, lFormattedJSON, "utf8");
    };
  }
  return async (pJSONSchemaObject) => {
    const lUnMinified = `/* generated - don't edit */export default ${JSON.stringify(
      stripAttribute(pJSONSchemaObject.default, "description"),
    )}`;
    // to strip quoted attributes {"thing": 481} => {thing: 481}
    const lFormatted = await prettier.format(lUnMinified, { parser: "babel" });
    const lMinified = babel.transformSync(lFormatted, { minified: true }).code;
    writeFileSync(pOutputFileName, lMinified, "utf8");
  };
}

function getInputModuleName(pOutputFileName) {
  const lRE =
    extname(pOutputFileName) === ".json"
      ? /[^/]+\/([^.]+)\.schema.json/g
      : /[^/]+\/([^.]+)\.schema.mjs/g;
  return pOutputFileName.replace(lRE, "./$1.schema.mjs");
}

if (process.argv.length === 3) {
  const lOutputFileName = process.argv.pop();

  import(getInputModuleName(lOutputFileName))
    .then(emitConsolidatedSchema(lOutputFileName))
    // eslint-disable-next-line unicorn/prefer-top-level-await
    .catch((pError) => {
      process.exitCode = 2;
      process.stderr.write(`${pError}\n`);
    });
} else {
  process.exitCode = 1;
  process.stderr.write(
    `\nUsage: generate-schemas.utl.mjs <target schema>\n\n  e.g. generate-schemas.utl.mjs ./src/schema/configuration.schema.json\n\n`,
  );
}
