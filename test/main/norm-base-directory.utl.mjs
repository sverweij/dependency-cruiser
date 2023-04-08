import { join } from "node:path";
import cloneDeep from "lodash/cloneDeep.js";

export default function normBaseDirectory(
  pUnprocessedJSON,
  pBaseDirectory = process.cwd()
) {
  let lReturnValue = cloneDeep(pUnprocessedJSON);
  lReturnValue.summary.optionsUsed.baseDir = join(
    pBaseDirectory,
    lReturnValue.summary.optionsUsed?.baseDir ?? ""
  );
  return lReturnValue;
}
