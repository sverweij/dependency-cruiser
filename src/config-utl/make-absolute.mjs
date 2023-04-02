import { join, isAbsolute } from "path";

export default function makeAbsolute(pFilename) {
  let lReturnValue = pFilename;

  if (!isAbsolute(pFilename)) {
    lReturnValue = join(process.cwd(), pFilename);
  }
  return lReturnValue;
}
