export function validateErrorsToString(pErrors) {
  /* c8 ignore next 1 */
  return (pErrors || [])
    .map((pError) => `data${pError.instancePath} ${pError.message}`)
    .join(", ");
}
