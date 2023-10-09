import Ajv from "ajv";

import { assertFormatOptionsValid } from "./options/assert-validity.mjs";
import { normalizeFormatOptions } from "./options/normalize.mjs";
import reportWrap from "./report-wrap.mjs";
import cruiseResultSchema from "#cruise-result-schema";

function validateResultAgainstSchema(pResult) {
  const ajv = new Ajv();

  if (!ajv.validate(cruiseResultSchema, pResult)) {
    throw new Error(
      `The supplied dependency-cruiser result is not valid: ${ajv.errorsText()}.\n`,
    );
  }
}
/** @type {import("../../types/dependency-cruiser.js").format} */
export default async function format(pResult, pFormatOptions = {}) {
  const lFormatOptions = normalizeFormatOptions(pFormatOptions);
  assertFormatOptionsValid(lFormatOptions);

  validateResultAgainstSchema(pResult);

  // eslint-disable-next-line no-return-await
  return await reportWrap(pResult, lFormatOptions);
}
