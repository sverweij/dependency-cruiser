import { writeFileSync, createReadStream } from "node:fs";

const PIPE_BUFFER_SIZE = 512;

function writeToFile(pOutputTo, pDependencyString) {
  try {
    writeFileSync(pOutputTo, pDependencyString, {
      encoding: "utf8",
      flag: "w",
    });
  } catch (pError) {
    throw new Error(`Writing to '${pOutputTo}' didn't work. ${pError}`);
  }
}

/**
 * Writes the string pString to stdout in chunks of pBufferSize size.
 *
 * When writing to a pipe, it's possible that pipe's buffer is full.
 * To prevent this problem from happening we should take the value at which
 * the OS guarantees atomic writes to pipes - which on my OSX machine is
 * 512 bytes. That seems pretty low (I've seen reports of 4k on the internet)
 * so it looks like a safe limit to use for PIPE_BUFFER_SIZE
 *
 * @param  {string} pString The string to write
 * @param  {number} pBufferSize The size of the buffer to use.
 * @returns {void} nothing
 */
function writeToStdOut(pString, pBufferSize = PIPE_BUFFER_SIZE) {
  const lNumberOfChunks = Math.ceil(pString.length / pBufferSize);
  let lIndex = 0;

  /* eslint no-plusplus: 0 */
  for (lIndex = 0; lIndex < lNumberOfChunks; lIndex++) {
    const lChunkStart = lIndex * pBufferSize;
    process.stdout.write(
      pString.substring(lChunkStart, lChunkStart + pBufferSize),
      "utf8",
    );
  }
}
export function write(pOutputTo, pContent) {
  // previously we checked here to ensure pContent ended on an EOL (and if it
  // didn't we added one). As for one or two reporters we DON'T want this
  // to happen automatically (e.g. the 'null' one) we've moved that check
  // to the individual reporters and with a unit test ensured that all
  // reporters (current and future) keep doing that.
  if ("-" === pOutputTo) {
    writeToStdOut(pContent);
  } else {
    writeToFile(pOutputTo, pContent);
  }
}

export function getInStream(pInputFrom) {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return createReadStream(pInputFrom);
}
