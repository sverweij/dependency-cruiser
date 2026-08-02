import { writeFileSync } from "node:fs";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";

const ajv = new Ajv({ code: { source: true, esm: true } });

if (!process.permission) {
  process.stderr.write(
    "This script only runs with node\'s permission model.\n\n",
  );
  process.exit(1);
}
// drop is not available in older node versions, like ^22, yet
if (Object.hasOwn(process.permission, "drop")) {
  process.permission.drop("fs.read", "..");
  process.permission.drop("fs.read", "/");
  process.permission.drop("fs.write", "..");
  process.permission.drop("fs.write", "/");
}

if (process.argv.length === 4) {
  const lOutputFileName = process.argv.pop();
  const lInputSchemaFileName = process.argv.pop();

  const lSchema = await import(`../${lInputSchemaFileName}`);
  const validate = ajv.compile(lSchema.default);

  const lModuleCode = standaloneCode(ajv, validate);

  writeFileSync(lOutputFileName, lModuleCode, "utf8");
} else {
  process.exitCode = 1;
  process.stderr.write(
    `\nUsage: generate-schema-validator.utl.mjs input-schema.json output-validator.mjs\n\n  e.g. generate-schema-validator.utl.mjs ./src/schema/configuration.schema.mjs ./src/schema/configuration.validate.mjs\n\n`,
  );
}
