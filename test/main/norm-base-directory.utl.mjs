import { join } from "node:path";

export default function normBaseDirectory(
  pUnprocessedJSON,
  pBaseDirectory = process.cwd(),
) {
  let lReturnValue = structuredClone(pUnprocessedJSON);
  lReturnValue.summary.optionsUsed.baseDir = join(
    pBaseDirectory,
    lReturnValue.summary.optionsUsed?.baseDir ?? "",
  );
  return lReturnValue;
}
