import { accessSync, constants } from "node:fs";

export default function assertFileExistence(pDirectoryOrFile) {
  try {
    accessSync(pDirectoryOrFile, constants.R_OK);
  } catch (pError) {
    throw new Error(
      `Can't open '${pDirectoryOrFile}' for reading. Does it exist?\n`,
    );
  }
}
