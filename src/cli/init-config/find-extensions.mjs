// @ts-check
/* eslint-disable security/detect-object-injection */
import { scannableExtensions } from "#extract/transpile/meta.mjs";
import getExtension from "#utl/get-extension.mjs";
import findAllFiles from "#utl/find-all-files.mjs";

/**
 * @param {Record<string,number>} pAll
 * @param {string} pExtension
 */
function reduceToCounts(pAll, pExtension) {
  if (pAll[pExtension]) {
    pAll[pExtension] += 1;
  } else {
    pAll[pExtension] = 1;
  }
  return pAll;
}

function compareByCount(pCountsObject) {
  return function compare(pLeft, pRight) {
    return pCountsObject[pRight] - pCountsObject[pLeft];
  };
}

/**
 * @param {string[]} pDirectories
 * @param {{baseDir?: string; ignoreFileContents?: string}=} pOptions
 * @returns {string[]}
 */
export default function findExtensions(pDirectories, pOptions) {
  const lOptions = {
    baseDir: process.cwd(),
    scannableExtensions,
    ...pOptions,
  };

  const lExtensionsWithCounts = pDirectories
    .flatMap((pDirectory) =>
      findAllFiles(pDirectory, {
        baseDir: lOptions.baseDir,
        ignoreFileContents: lOptions?.ignoreFileContents,
      })
        .map(getExtension)
        .filter(Boolean),
    )
    .reduce(reduceToCounts, {});

  return Object.keys(lExtensionsWithCounts)
    .filter((pExtension) => lOptions.scannableExtensions.includes(pExtension))
    .sort(compareByCount(lExtensionsWithCounts));
}
