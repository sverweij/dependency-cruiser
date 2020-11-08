import { EOL } from "os";
import getStream from "get-stream";

const DECIMAL_BASE = 10;
const DECIMALS_TO_SHOW = 2;

getStream(process.stdin)
  .then((pString) => {
    process.stdout.write(
      `${JSON.parse(pString)
        ?.total?.lines?.pct.toFixed(DECIMALS_TO_SHOW)
        .toString(DECIMAL_BASE)}${EOL}`
    );
  })
  .catch((pError) => process.stderr.write(`${pError}${EOL}`));
