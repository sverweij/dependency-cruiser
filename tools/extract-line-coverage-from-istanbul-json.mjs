// eslint-disable-next-line node/no-missing-import, import/no-unresolved
// import { EOL } from "node:os"; // node 10 still barfs on this
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
