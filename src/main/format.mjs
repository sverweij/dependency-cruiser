import { assertFormatOptionsValid } from "./options/assert-validity.mjs";
import { normalizeFormatOptions } from "./options/normalize.mjs";
import reportWrap from "./report-wrap.mjs";
import validateCruiseResultSchema from "#schema/cruise-result.validate.mjs";
import { validateErrorsToString } from "#schema/utl.mjs";

function validateResultAgainstSchema(pResult) {
  if (!validateCruiseResultSchema(pResult)) {
    throw new Error(
      `The supplied dependency-cruiser result is not valid: ${validateErrorsToString(validateCruiseResultSchema.errors)}.\n`,
    );
  }
}
/** @type {import("../../types/dependency-cruiser.js").format} */
export default async function format(pResult, pFormatOptions = {}) {
  const lFormatOptions = normalizeFormatOptions(pFormatOptions);
  assertFormatOptionsValid(lFormatOptions);

  validateResultAgainstSchema(pResult);

  return await reportWrap(pResult, lFormatOptions);
}
