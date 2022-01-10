import ndjson from "ndjson";
import parseInput from "./parse-input";
import mangleEntry from "./mangle-entry";
import formatOutput from "./format-output";

process.stdin
  .pipe(ndjson.parse())
  .on("data", (pEntry) => {
    console.log(parseInput(pEntry).map(mangleEntry).map(formatOutput));
  })
  .on("error", (pError) => {
    console.error(pError);
    process.exitCode = 1;
    process.exit();
  })
  .on("end", () => {
    console.log(TerseAdvisoryLog2Table(lAdvisaryLog.get()));
  });
