import {
  determineFromExtras,
  aggregateViolations,
  determineTo,
} from "./utl.mjs";
import template from "./error-html-template.mjs";
import meta from "#meta.cjs";
import { getOneLetterDependencyType } from "#report/utl/index.mjs";
import { diffViolationArrays } from "#graph-utl/compare.mjs";
/**
 * @import { ICruiseResult, IViolation } from "../../../types/cruise-result.mjs"
 * @import { IErrorReporterOptions } from "../../../types/reporter-options.mjs"
 * @import {  IReporterOutput } from "../../../types/dependency-cruiser.mjs"
 */

function getViolatedRuleRowClass(pViolatedRule) {
  return pViolatedRule.unviolated ? ' class="unviolated"' : "";
}

function getViolatedRuleOkNokCell(pViolatedRule) {
  if (pViolatedRule.unviolated) {
    return '<span class="ok">&check;</span>';
  }
  return `<span class="${pViolatedRule.severity}">&cross;</span>`;
}

function buildViolatedRuleRow(pViolatedRule) {
  return `<tr${getViolatedRuleRowClass(pViolatedRule)}>
    <td>${getViolatedRuleOkNokCell(pViolatedRule)}</td>
    <td>${pViolatedRule.severity}</td>
    <td class="nowrap">
      <a href="#${pViolatedRule.name}-instance"
         id="${pViolatedRule.name}-definition" 
         class="noiseless">${pViolatedRule.name}</a>
    </td>
    <td><strong>${pViolatedRule.count}</strong></td>
    <td><strong>${pViolatedRule.ignoredCount ?? 0}</strong></td>
    <td>${pViolatedRule.comment}</td>
  </tr>`;
}

/**
 * @param {ICruiseResult} pResults
 * @returns {string}
 */
function constructViolatedRulesTable(pResults) {
  return `<table>
    <tbody>
      <thead>
        <tr>
          <th></th>
          <th>severity</th>
          <th>rule</th>
          <th>violations</th>
          <th>ignored</th>
          <th>explanation</th>
        </tr>
      </thead>
      ${aggregateViolations(
        pResults.summary.violations,
        pResults.summary.ruleSetUsed,
      )
        .map(buildViolatedRuleRow)
        .join("\n")}
      <tr>
        <td colspan="6" class="controls">
          <div id="show-unviolated">
            &downarrow; <a href="#show-all-the-rules">also show unviolated rules</a>
          </div>
          <div id="hide-unviolated">
            &uparrow; <a href="">hide unviolated rules</a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>`;
}

/**
 * @param {IViolation} pViolation
 * @returns {string}
 */
function getViolationRowClass(pViolation) {
  return pViolation.rule.severity === "ignore" ? ' class="ignored"' : "";
}

/**
 * @param {string} pPrefix
 * @param {IErrorReporterOptions} pOptions
 * @returns {(pViolation: IViolation) => string}
 */
function constructViolationRow(pPrefix, pOptions) {
  return (pViolation) => {
    const lDependencyTypes = pViolation?.dependencyTypes ?? [];
    return `  <tr${getViolationRowClass(pViolation)}>
    <td class="${pViolation.rule.severity}">${pViolation.rule.severity}</td>
    <td class="nowrap">
      <a href="#${pViolation.rule.name}-definition" 
         id="${pViolation.rule.name}-instance"
         class="noiseless">${pViolation.rule.name}</a>
    </td>
    <td><a href="${pPrefix}${pViolation.from}">${
      pViolation.from
    }</a>${determineFromExtras(pViolation)}</td>
    <td><span class="dependency-type ${lDependencyTypes.join(" ")}" title="dependency types: ${lDependencyTypes.join(", ")}">${getOneLetterDependencyType(lDependencyTypes)}</span></td>
    <td>${determineTo(pViolation, pOptions)}</td>
  </tr>`;
  };
}

/**
 * @param {ICruiseResult} pResults
 * @param {IErrorReporterOptions} pOptions
 * @returns {string}
 */
function constructViolationsList(pResults, pOptions) {
  if (pResults.summary.violations.length > 0) {
    return `<span id="show-ignored-violations">
      <h2><svg class="p__svg--inline" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
        <path fill-rule="evenodd"
          d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z">
        </path>
      </svg> All violations</h2>
    <table>
      <thead>
        <tr>
          <th>severity</th>
          <th>rule</th>
          <th>from</th>
          <th>types</th>
          <th>to</th>
        </tr>
      </thead>
      <tbody>
      ${pResults.summary.violations
        .map(
          constructViolationRow(
            pResults.summary.optionsUsed.prefix ?? "",
            pOptions,
          ),
        )
        .join("\n")}
      ${
        pResults.summary.ignore > 0
          ? `<tr>
        <td colspan="5" class="controls">
          <div id="show-ignored">
            &downarrow; <a href="#show-ignored-violations">also show ignored violations</a>
          </div>
          <div id="hide-ignored">
            &uparrow; <a href="">hide ignored violations</a>
          </div>
        </td>
      </tr>`
          : ""
      }
      </tbody>
    </table>
    </span>`;
  }
  return `    <h2><span aria-hidden="true">&hearts;</span> No violations found</h2>
    <p>Get gummy bears to celebrate.</p>`;
}

/**
 * @param {number} pBaselineStaleCount
 * @returns {string}
 */
function constructStaleDiv(pBaselineStaleCount) {
  if ((pBaselineStaleCount ?? 0) > 0) {
    return `<div style="float:left;padding-right:20px" class="ignore">
    <strong>${pBaselineStaleCount}</strong> stale entries in baseline
    </div>`;
  }
  return "";
}

/**
 * @param {ICruiseResult} pResults
 * @param {IErrorReporterOptions} pOptions
 * @returns {string}
 */
function constructBaselineStaleTable(pResults, pOptions) {
  if ((pResults.summary.baselineStale ?? 0) > 0) {
    const { old } = diffViolationArrays(
      pResults.summary.optionsUsed.knownViolations,
      pResults.summary.violations,
    );
    return `<span id="stale-baseline-entries">
      <h2><svg class="p__svg--inline" viewBox="144 144 512 512" version="1.1" aria-hidden="true"><path d="M583.48 299.64a202 202 0 0 0-108.32-109.58 194.4 194.4 0 0 0-150.29 0 202.3 202.3 0 0 0-123.43 186.4v224.26a25.2 25.2 0 0 0 5.04 14.7q4.46.63 8.96.61c8.52.2 16.98-1.52 24.74-5.04a89 89 0 0 0 26.8-22.57c2.57-2.82 5.04-5.54 7.66-8.06 3.6-3.67 7.7-6.84 12.14-9.42a41 41 0 0 1 20.81-5.04c19.75 0 29.43 10.53 40.6 22.73a101 101 0 0 0 22.58 20.15 63 63 0 0 0 4.48 2.42 60.4 60.4 0 0 0 49.48 0q2.33-1.08 4.43-2.37c8.5-5.54 16.1-12.34 22.57-20.15 11.18-12.2 20.86-22.73 40.6-22.73A41 41 0 0 1 513.2 571a58 58 0 0 1 12.15 9.42 132 132 0 0 1 7.65 8.07 89 89 0 0 0 27 22.36 57 57 0 0 0 24.75 5.04q4.53 0 9.01-.6c3.2-4.25 4.95-9.4 5.04-14.71v-224.1a202 202 0 0 0-15.32-76.83zm0 124.74v176.33c-18.9-.45-28.41-10.73-39.35-22.67-2.42-2.62-5.04-5.34-7.5-7.96a83 83 0 0 0-11.44-9.73 55.4 55.4 0 0 0-32.8-10.07c-26.4 0-39.9 14.71-51.74 27.66s-20.9 23.02-40.65 23.02-29.43-10.53-40.61-22.72-25.2-27.66-51.74-27.66a55.4 55.4 0 0 0-32.75 10.08 83 83 0 0 0-11.44 9.72c-2.62 2.62-5.04 5.34-7.56 7.96-10.93 11.94-20.45 22.17-39.3 22.67V376.46c0-102.78 82.33-186.4 183.5-186.4 101.16 0 183.49 83.63 183.49 186.4z"/><path d="M511.69 280.75a59.6 59.6 0 1 0 59.6 63.83q.4-3.98 0-7.95a59.55 59.55 0 0 0-59.6-55.88m-44.53 59.65a44.45 44.45 0 0 1 66.1-38.84h-.91a38.92 38.92 0 0 0 0 77.84h.9a44.45 44.45 0 0 1-66.1-38.84zm-38.59-3.98a59.6 59.6 0 1 0 0 7.96q.4-3.99 0-7.96m-104.14 3.98a44.44 44.44 0 0 1 66.1-38.84h-.6a38.91 38.91 0 1 0 0 77.84h.9a44.45 44.45 0 0 1-66.4-39"/>
    </svg> Stale entries in the baseline</h2>
    <p>
      These violations are in the baseline (typically <tt>.dependency-cruiser-known-violations.json</tt>), 
      but don't match any real violations anymore, e.g. because they were fixed in the meantime. You
      can remove them with dependency-cruiser's 
      <a href="https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#--baseline-create-or-update-a-known-violations-baseline"><tt>--baseline --baseline-mode shrink-only</tt>
      command line options</a>.
    </p>
    <table>
      <thead>
        <tr>
          <th>severity</th>
          <th>rule</th>
          <th>from</th>
          <th>types</th>
          <th>to</th>
        </tr>
      </thead>
      <tbody>
      ${old
        .map(
          constructViolationRow(
            pResults.summary.optionsUsed.prefix ?? "",
            pOptions,
          ),
        )
        .join("\n")}
      </tbody>
    </table>
    </span>`;
  }
  return "";
}

/**
 * @param {ICruiseResult} pResults
 * @param {IErrorReporterOptions} pOptions
 * @returns {string}
 */
function report(pResults, pOptions) {
  const lOptions = {
    showExternalModulesUnresolved: false,
    showAliasedModulesUnresolved: false,
    ...pOptions,
  };
  return template
    .replace("{{totalCruised}}", pResults.summary.totalCruised)
    .replace(
      "{{totalDependenciesCruised}}",
      pResults.summary.totalDependenciesCruised,
    )
    .replace("{{error}}", pResults.summary.error)
    .replace("{{warn}}", pResults.summary.warn)
    .replace("{{info}}", pResults.summary.info)
    .replace("{{ignore}}", pResults.summary.ignore ?? 0)
    .replace("{{staleDiv}}", constructStaleDiv(pResults.summary.baselineStale))
    .replace("{{violatedRulesTable}}", constructViolatedRulesTable(pResults))
    .replace("{{violationsList}}", constructViolationsList(pResults, lOptions))
    .replace(
      "{{baselineStaleTable}}",
      constructBaselineStaleTable(pResults, pOptions),
    )
    .replace("{{depcruiseVersion}}", `dependency-cruiser@${meta.version}`)
    .replace("{{runDate}}", new Date().toISOString());
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @param {IErrorReporterOptions} pOptions
 * @returns {IReporterOutput} - output: an html program showing the summary & the violations (if any)
 *                              exitCode: 0
 */
export default function errorHtml(pResults, pOptions) {
  return {
    output: report(pResults, pOptions || {}),
    exitCode: 0,
  };
}
