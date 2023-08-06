/* eslint-disable unicorn/no-abusive-eslint-disable, eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { EOL } from "os";

/*
data mangle this into some terse text output:
{
  "name": "generates a valid config - tsConfig",
  "nesting": 1,
  "file": "/Users/sander/prg/js/dependency-cruiser/test/cli/init-config/build-config.test.mjs",
  "testNumber": 5,
  "details": {
    "duration_ms": 0.437433,
    "error": {
      "failureType": "testCodeFailure",
      "cause": {
        "errno": -2,
        "code": "ENOENT",
        "syscall": "chdir",
        "path": "/Users/sander/prg/js/dependency-cruiser/test/cli/__fixtures__/init-config/no-config-files-exist",
        "dest": "test/cli/__fixtures__/init-config/no-config-files-exist"
      },
      "code": "ERR_TEST_FAILURE"
    }
  }
}


{
  "name": "formats a cruise result, --focus filter works and writes it to a file",
  "nesting": 1,
  "file": "/Users/sander/prg/js/dependency-cruiser/test/cli/format.test.mjs",
  "testNumber": 2,
  "details": {
    "duration_ms": 203.079639,
    "error": {
      "failureType": "testCodeFailure",
      "cause": {
        "generatedMessage": true,
        "code": "ERR_ASSERTION",
        "actual": 0,
        "expected": 666,
        "operator": "strictEqual"
      },
      "code": "ERR_TEST_FAILURE"
    }
  }
}
*/
const LOCALE = undefined;
const gTimeFormat = new Intl.NumberFormat(LOCALE, {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;

export default async function* (source) {
  let lFailStack = [];
  let lDiagnosticStack = [];
  let lCount = 0;

  for await (const event of source) {
    switch (event.type) {
      case "test:pass":
        // if (lCount < 10) {
        //   yield JSON.stringify(event, null, 2);
        //   lCount++;
        // }
        if (event.data.details.type === "suite") {
          yield "";
        } else if (event.data.skip || event.data.todo) {
          yield ",";
        } else {
          yield ".";
        }
        break;
      case "test:fail":
        yield "!";
        break;
      // case "test:enqueue":
      //   yield "+";
      //   break;
      // case "test:dequeue":
      //   yield "-";
      //   break;
      case "test:diagnostic":
        lDiagnosticStack.push(event);
        // yield "D";
        break;
      // case "test:stdout":
      // yield event.data.message;
      // break;
      // case "test:stderr":
      // yield event.data.message;
      //   break;
      case "test:coverage":
        yield "C";
        break;
    }
  }

  const lDiagnostics = lDiagnosticStack
    .map(diagnosticToObject)
    .reduce((pAll, pDiagnostic) => ({ ...pAll, ...pDiagnostic }), {});

  yield EOL +
    lFailStack.map(summarizeFailsToText).join(EOL) +
    `${EOL}${lDiagnostics.pass} passing (${gTimeFormat(
      lDiagnostics.duration_ms,
    )})${EOL}` +
    `${lDiagnostics.fail > 0 ? lDiagnostics.fail + " failing" + EOL : ""}` +
    `${
      lDiagnostics.skipped > 0 ? lDiagnostics.skipped + " skipped" + EOL : ""
    }` +
    `${lDiagnostics.todo > 0 ? lDiagnostics.todo + " todo" + EOL : ""}` +
    EOL;
}

function summarizeFailsToText(pFailEvent) {
  if (pFailEvent.details.error.failureType === "testCodeFailure") {
    return (
      `✘ ${pFailEvent.name}\n` + `  ${formatError(pFailEvent)}\n\n` //+
      //   `${JSON.stringify(pTestResult, null, 2)}`
    );
  }
}

function diagnosticToObject(pDiagnosticEvent) {
  const lReturnValue = {};
  const [key, value] = pDiagnosticEvent.data.message.split(" ");
  lReturnValue[key] = value;
  return lReturnValue;
}

function formatError(pTestResult) {
  return pTestResult.details.error.cause.stack;
  //   switch (pTestResult.details.error.cause.code) {
  //     case "ERR_TEST_FAILURE":
  //       return pTestResult.details.error.cause.stack;
  //     case "ERR_ASSERTION":
  //       return (
  //         pTestResult.details.error.cause.message +
  //         pTestResult.details.error.cause.stack
  //       );
  //     default:
  //       return pTestResult.details.error.cause.message;
  //   }
}
