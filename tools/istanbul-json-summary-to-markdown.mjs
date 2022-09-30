function formatMetric(pCoverageMetric) {
  return `${pCoverageMetric.pct.toFixed(1)}%|${pCoverageMetric.covered}/${
    pCoverageMetric.total
  }|${pCoverageMetric.skipped} skipped`;
}

function formatSummary(pCoverageSummary) {
  return (
    `|||||\n` +
    `|:--|--:|:--:|--:|\n` +
    `|**Statements**|${formatMetric(pCoverageSummary.total.statements)}|\n` +
    `|**Branches**|${formatMetric(pCoverageSummary.total.branches)}|\n` +
    `|**Functions**|${formatMetric(pCoverageSummary.total.functions)}|\n` +
    `|**Lines**|${formatMetric(pCoverageSummary.total.lines)}|\n`
  );
}
/**
 * Takes the output from the instanbul json-summary reporter (in a readStream),
 * formats it in a markdown table and writes it to the provided writeStream
 *
 * @param {readStream} pStream stream to read the JSON from
 * @param {writeStream} pOutStream stream to write the markdown to
 */
function main(pInStream, pOutStream) {
  let lBuffer = "";

  pInStream
    .on("end", () => {
      pOutStream.write(formatSummary(JSON.parse(lBuffer)));
      pOutStream.end();
    })
    .on(
      "error",
      /* c8 ignore start */
      (pError) => {
        process.stderr.write(`${pError}\n`);
      }
      /* c8 ignore stop */
    )
    .on("data", (pChunk) => {
      lBuffer += pChunk;
    });
}

main(process.stdin, process.stdout);
