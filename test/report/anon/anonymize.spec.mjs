import { equal, deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import cruiseResultSchema from "../../../src/schema/cruise-result.schema.mjs";
import { clearCache } from "../../../src/report/anon/anonymize-path-element.mjs";
import anonymize from "../../../src/report/anon/index.mjs";
import sourceReport from "./__mocks__/src-report.mjs";
import fixtureReport from "./__fixtures__/src-report.mjs";
import sourceReportWithWordlist from "./__mocks__/src-report-wordlist.mjs";
import fixtureReportWithWordlist from "./__fixtures__/src-report-wordlist.mjs";
import reachesReport from "./__mocks__/reaches-report.mjs";
import fixtureReachesReport from "./__fixtures__/reaches-report.mjs";
import sourceCycle from "./__mocks__/cycle.mjs";
import fixtureCycle from "./__fixtures__/cycle.mjs";
import sourceDependents from "./__mocks__/dependents.mjs";
import fixtureDependents from "./__fixtures__/dependents.mjs";
import sourceFolders from "./__mocks__/folders.mjs";
import fixtureFolders from "./__fixtures__/folders.mjs";
import sourceFolderCycles from "./__mocks__/folder-cycles.mjs";
import fixtureFolderCycles from "./__fixtures__/folder-cycles.mjs";

const ajv = new Ajv();

const META_SYNTACTIC_VARIABLES = [
  "foo",
  "bar",
  "baz",
  "qux",
  "quux",
  "quuz",
  "corge",
  "grault",
  "garply",
  "waldo",
  "fred",
  "plugh",
  "xyzzy",
  "thud",
  "wibble",
  "wobble",
  "wubble",
  "flob",
];

describe("[I] report/anon", () => {
  beforeEach(() => {
    clearCache();
  });

  it("anonymizes a result tree with the passed word list", () => {
    const lResult = anonymize(sourceReport, {
      wordlist: structuredClone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureReport);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });

  it("anonymizes a result tree with the word list passed in the result tree", () => {
    const lResult = anonymize(sourceReportWithWordlist);
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureReportWithWordlist);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });

  it("anonymizes a result tree with (violated) rules", () => {
    const lResult = anonymize(sourceCycle, {
      wordlist: structuredClone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureCycle);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });
  it("anonymizes a result tree with (violated) reaches rules", () => {
    const lResult = anonymize(reachesReport, {
      wordlist: structuredClone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureReachesReport);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });
  it("anonymizes a result tree with dependents", () => {
    const lResult = anonymize(sourceDependents, {
      wordlist: structuredClone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureDependents);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });
  it("anonymizes a result tree with folders", () => {
    const lResult = anonymize(sourceFolders, {
      wordlist: structuredClone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureFolders);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });

  it("anonymizes a result tree with folders that contain folder cycles", () => {
    const lResult = anonymize(sourceFolderCycles, {
      wordlist: structuredClone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    deepEqual(lOutput, fixtureFolderCycles);
    ajv.validate(cruiseResultSchema, lOutput);
    equal(lResult.exitCode, 0);
  });
});
