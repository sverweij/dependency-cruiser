import dependencyToIncidenceTransformer from "../utl/dependency-to-incidence-transformer.mjs";
import templateText from "./html-template.mjs";

// should use os.EOL, but it doesn't matter whether we use \r\n or \n here
// as it's running in the browser anyway, which doesn't care. Also os.EOL will
// make the test running on windows cry.
const EOL = "\n";

function addShowTitle(pDependencyEntry) {
  return {
    ...pDependencyEntry,
    incidences: pDependencyEntry.incidences.map((pIncidence) => ({
      ...pIncidence,
      hasRelation: pIncidence.incidence !== "false",
    })),
  };
}

function getClasses(pModule, pOtherClasses) {
  let lClasses = pOtherClasses || [];
  if (pModule.coreModule) {
    lClasses.push("cell-core-module");
  }
  if (pModule.couldNotResolve) {
    lClasses.push("cell-unresolvable-module");
  }
  return lClasses.length > 0 ? ` class="${lClasses.join(" ")}"` : "";
}

function constructTableHead(pModules) {
  return pModules
    .map(
      (pModule) =>
        `<th><div${getClasses(pModule)}>${pModule.source}</div></th>`,
    )
    .join("");
}

function constructTableCellTitle(pModule, pIncidence) {
  let lTitleLines = [];
  if (pIncidence.rule) {
    lTitleLines.push(`${pIncidence.rule}:`);
  }
  if (pIncidence.hasRelation) {
    lTitleLines.push(`${pModule.source} -> ${pIncidence.to}`);
  }
  return lTitleLines.length > 0 ? ` title="${lTitleLines.join(EOL)}"` : "";
}

function constructTableCell(pModule) {
  return (pIncidence) => {
    const lReturnValue = `<td class="cell cell-${
      pIncidence.incidence
    }"${constructTableCellTitle(pModule, pIncidence)}></td>`;
    return lReturnValue;
  };
}

function constructTableRow(pModule) {
  const lReturnValue = `
      <tr>
        <td${getClasses(pModule, ["first-cell"])}>${pModule.source}</td>
        ${pModule.incidences.map(constructTableCell(pModule)).join("")}
        <td${getClasses(pModule, ["first-cell"])}>${pModule.source}</td>
      </tr>`;
  return lReturnValue;
}

function constructTableBody(pModules) {
  return pModules.map(constructTableRow).join("");
}

function constructTable(pModules) {
  const lReturnValue = `
  <table id="table-rotated">
    <thead>
      <tr>
        <td class="controls top-left">
          <a id="rotate" href="#table-rotated">rotate</a>
          <a id="unrotate" href="#">rotate back</a>
        </td>
        ${constructTableHead(pModules)}
        <td class="top-right"></td>
      </tr>
    </thead>
    <tbody>
    ${constructTableBody(pModules)}
    </tbody>
    <tfoot>
      <tr>
        <td class="bottom-left"></td>
        ${constructTableHead(pModules)}
        <td class="bottom-right"></td>
      </tr>
    </tfoot>
  </table>
`;

  return lReturnValue;
}

function report(pResults) {
  const lModules = dependencyToIncidenceTransformer(pResults.modules).map(
    addShowTitle,
  );
  return templateText.replace("{{table-here}}", constructTable(lModules));
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {import("../../../types/cruise-result.mjs").ICruiseResult} pResults
 * @returns {import("../../../types/dependency-cruiser.js").IReporterOutput}
 */
export default function html(pResults) {
  return {
    output: report(pResults),
    exitCode: 0,
  };
}
