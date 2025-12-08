export function validateErrorsToString(pErrors) {
  return pErrors
    .map((pError) => `data${pError.instancePath} ${pError.message}`)
    .join(", ");
}
