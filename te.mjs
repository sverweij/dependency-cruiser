/* eslint-disable unicorn/no-abusive-eslint-disable, eslint-comments/no-unlimited-disable */
/* eslint-disable */

import findScannableExtensions, {findTheoreticallySupportedExtensions}  from "#cli/init-config/find-extensions.mjs"


const lScannableExtensions = findScannableExtensions (["./src"])
const lPossibleExtensions = findTheoreticallySupportedExtensions (["./src"])

console.dir(
  lScannableExtensions
);

console.dir(
  lPossibleExtensions
);


// new Set(lPossibleExtensions).difference(new Set(lScannableExtensions))

let lExtensionsMissingSupport = [];

for (let lPossibleExtension of lPossibleExtensions) {
  if (!lScannableExtensions.includes(lPossibleExtension)) {
    lExtensionsMissingSupport.push(lPossibleExtension)
  }
}

console.dir(
  lExtensionsMissingSupport
);

