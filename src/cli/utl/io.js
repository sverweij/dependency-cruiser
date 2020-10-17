const fs = require("fs");

const PIPE_BUFFER_SIZE = 512;

function writeToFile(pOutputTo, pDependencyString) {
  try {
    fs.writeFileSync(pOutputTo, pDependencyString, {
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
    // eslint-disable-next-line unicorn/prefer-string-slice
    process.stdout.write(
      pString.substr(lIndex * pBufferSize, pBufferSize),
      "utf8"
    );
  }
}
function write(pOutputTo, pContent) {
  if ("-" === pOutputTo) {
    writeToStdOut(pContent);
  } else {
    writeToFile(pOutputTo, pContent);
  }
}

function getInStream(pInputFrom) {
  if ("-" === pInputFrom) {
    return process.stdin;
  }
  return fs.createReadStream(pInputFrom);
}

module.exports = {
  write,
  getInStream,
};
