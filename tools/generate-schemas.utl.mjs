import fs from "node:fs";
import prettier from "prettier";

function jsonTheSchema(pOutputFileName) {
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

function getInputModuleName(pOutputFileName) {
  return pOutputFileName.replace(
    /[^/]+\/([^.]+)\.schema.json/g,
    "./$1.schema.mjs"
  );
}

if (process.argv.length === 3) {
  const lOutputFileName = process.argv.pop();

  import(getInputModuleName(lOutputFileName))
    .then(jsonTheSchema(lOutputFileName))
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
