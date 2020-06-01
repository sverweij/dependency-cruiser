const fs = require("fs");
const { toSourceLocationArray, fileExists } = require("./environment-helpers");

function validateFileExistence(pInput) {
  return (
    fileExists(pInput) ||
    `hmm, '${pInput}' doesn't seem to exist - could you try again?`
  );
}

function validateLocation(pLocations) {
  for (const lLocation of toSourceLocationArray(pLocations)) {
    try {
      if (!fs.statSync(lLocation).isDirectory()) {
        return `'${lLocation}' doesn't seem to be a folder - please try again`;
      }
    } catch (pError) {
      return `'${lLocation}' doesn't seem to exist - please try again`;
    }
  }

  return true;
}

module.exports = {
  validateFileExistence,
  validateLocation,
};
