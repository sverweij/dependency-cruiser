/* eslint-disable unicorn/no-abusive-eslint-disable, eslint-comments/no-unlimited-disable */
/* eslint-disable */

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
import { format, relative } from "node:path";

export default async function* (source) {
  let stack = [];
  for await (const event of source) {
    switch (event.type) {
      case "test:pass":
        yield ".";
        break;
      case "test:fail":
        stack.push(event.data);
        yield "x";
        break;
    }
  }
  yield `\n` + stack.map(summarizeFailEventToText).join("\n");
}

function summarizeFailEventToText(pTestResult) {
  if (pTestResult.details.error.failureType === "testCodeFailure") {
    return (
      //   `${relative(process.cwd(), pTestResult.file)}\n` +
      `✘ ${pTestResult.name}\n` + `  ${formatError(pTestResult)}\n\n` //+
      //   `${JSON.stringify(pTestResult, null, 2)}`
    );
  }
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
