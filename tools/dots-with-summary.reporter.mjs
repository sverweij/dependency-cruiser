/* eslint-disable no-use-before-define */
import { EOL } from "node:os";

// eslint-disable-next-line no-undefined
const LOCALE = undefined;
const gTimeFormat = new Intl.NumberFormat(LOCALE, {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;

// eslint-disable-next-line max-lines-per-function, complexity
export default async function* dotsWithSummaryReporter(pSource) {
  let lFailStack = [];
  let lDiagnosticStack = [];

  for await (const lEvent of pSource) {
    switch (lEvent.type) {
      case "test:pass":
        if (lEvent.data.details.type === "suite") {
          yield "";
        } else if (lEvent.data.skip || lEvent.data.todo) {
          yield ",";
        } else {
          yield ".";
        }
        break;
      case "test:fail":
        lFailStack.push(lEvent.data);
        if (lEvent.data.details.type === "suite") {
          yield "";
        } else {
          yield "!";
        }
        break;
      case "test:diagnostic":
        lDiagnosticStack.push(lEvent);
        break;
      // // uncomment these lines if you're interested in any stdout/stderr
      // case "test:stdout":
      // yield lEvent.data.message;
      // break;
      // case "test:stderr":
      // yield lEvent.data.message;
      //   break;
      // // test:coverage apparently exists, but not seen in any runs so far
      // case "test:coverage":
      //   yield "C";
      //   break;
      default:
        break;
    }
  }

  const lDiagnostics = lDiagnosticStack
    .map(diagnosticToObject)
    .reduce((pAll, pDiagnostic) => ({ ...pAll, ...pDiagnostic }), {});

  yield `${
    EOL + lFailStack.map(summarizeFailsToText).filter(Boolean).join(EOL)
  }${EOL}${lDiagnostics.pass} passing (${gTimeFormat(
    lDiagnostics.duration_ms,
  )})${EOL}` +
    `${lDiagnostics.fail > 0 ? `${lDiagnostics.fail} failing${EOL}` : ""}` +
    `${
      lDiagnostics.skipped > 0 ? `${lDiagnostics.skipped} skipped${EOL}` : ""
    }` +
    `${lDiagnostics.todo > 0 ? `${lDiagnostics.todo} todo${EOL}` : ""}${EOL}`;
}

function summarizeFailsToText(pFailEvent) {
  if (pFailEvent.details.error.failureType === "testCodeFailure") {
    return `✘ ${pFailEvent.name}${EOL}  ${formatError(pFailEvent)}${EOL}${EOL}`;
  }
  return "";
}

function diagnosticToObject(pDiagnosticEvent) {
  const lReturnValue = {};
  const [key, value] = pDiagnosticEvent.data.message.split(" ");
  // eslint-disable-next-line security/detect-object-injection
  lReturnValue[key] = value;
  return lReturnValue;
}

function formatError(pTestResult) {
  return (
    pTestResult.details.error.cause.stack ||
    pTestResult.details.error.cause.message ||
    pTestResult.details.error.cause.code
  );
}
