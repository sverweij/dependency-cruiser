import {
  determineFromExtras,
  aggregateViolations,
  determineTo,
} from "./utl.mjs";
import template from "./error-html-template.mjs";
import meta from "#meta.cjs";

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
 * @param {import('../../../types/cruise-result.mjs')} pResults
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
 * @param {import('../../../types/cruise-result.mjs').IViolation} pViolation
 * @returns {string}
 */
function getViolationRowClass(pViolation) {
  return pViolation.rule.severity === "ignore" ? ' class="ignored"' : "";
}

/**
 * @param {import('../../../types/cruise-result.mjs').IViolation} pViolation
 * @returns {string}
 */
function constructViolationRow(pPrefix) {
  return (pViolation) => {
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
    <td>${determineTo(pViolation)}</td>
  </tr>`;
  };
}

/**
 * @param {import('../../../types/cruise-result.mjs').ICruiseResult} pResults
 * @returns {string}
 */
function constructViolationsList(pResults) {
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
          <th>to</th>
        </tr>
      </thead>
      <tbody>
      ${pResults.summary.violations
        .map(constructViolationRow(pResults.summary.optionsUsed.prefix ?? ""))
        .join("\n")}
      ${
        pResults.summary.ignore > 0
          ? `<tr>
        <td colspan="4" class="controls">
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
 * @param {import('../../../types/cruise-result.mjs')} pResults
 * @returns {string}
 */
function report(pResults) {
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
    .replace("{{violatedRulesTable}}", constructViolatedRulesTable(pResults))
    .replace("{{violationsList}}", constructViolationsList(pResults))
    .replace("{{depcruiseVersion}}", `dependency-cruiser@${meta.version}`)
    .replace("{{runDate}}", new Date().toISOString());
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {import("../../../types/cruise-result.mjs").ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {import("../../../types/dependency-cruiser.js").IReporterOutput} - output: an html program showing the summary & the violations (if any)
 *                              exitCode: 0
 */
export default function errorHtml(pResults) {
  return {
    output: report(pResults),
    exitCode: 0,
  };
}
