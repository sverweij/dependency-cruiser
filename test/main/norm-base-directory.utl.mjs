import { join } from "node:path";

export default function normBaseDirectory(
  pUnprocessedJSON,
  pBaseDirectory = process.cwd(),
) {
  const lReturnValue = structuredClone(pUnprocessedJSON);
  lReturnValue.summary.optionsUsed.baseDir = join(
    pBaseDirectory,
    lReturnValue.summary.optionsUsed?.baseDir ?? "",
  );
  return lReturnValue;
}
