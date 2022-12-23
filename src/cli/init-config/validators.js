const fs = require("fs");
const { toSourceLocationArray } = require("./environment-helpers");

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
  validateLocation,
};
