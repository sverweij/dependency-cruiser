/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */

/* eslint-disable max-depth */
/* eslint-disable security/detect-object-injection */

import { createSourceFile, SyntaxKind } from "typescript";

function keyIsBoring(pKey) {
  return [
    "parent",
    "pos",
    "end",
    "flags",
    "emitNode",
    "modifierFlagsCache",
    "transformFlags",
    "id",
    "flowNode",
    "symbol",
    "original",
    "__proto__",
    "constructor",
  ].includes(pKey);
}

export function walkForPrinting(pObject) {
  if (Array.isArray(pObject)) {
    return pObject.map((pValue) => walkForPrinting(pValue));
  }
  if (typeof pObject === "object") {
    const lNewObject = {};
    for (const lKey in pObject) {
      if (!keyIsBoring(lKey) && pObject[lKey]) {
        if (lKey === "kind") {
          lNewObject.kind = SyntaxKind[pObject.kind];
        } else {
          lNewObject[lKey] = walkForPrinting(pObject[lKey]);
        }
      }
    }
    return lNewObject;
  }
  return pObject;
}

const lAST = createSourceFile(
  "xx",
  "/** @type {import('./hello.mjs')|import('./goodbye.mjs')} */",
  false,
);

console.log(JSON.stringify(walkForPrinting(lAST), null, 2));
