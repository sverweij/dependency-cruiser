/**
 * Reads a file the TypeScript compiler can understand from stdin,
 * parses it and prints the AST as JSON to stdout. There's some
 * simplifications in the AST to make it more readable:
 * - The `kind` property is replaced with the string representation
 *  of the SyntaxKind enum.
 * - Some properties are omitted, as they are not interesting.
 * - The `parent` property is omitted, as it creates circular references.
 *
 * Why don't you use e.g. AST Explorer?
 * We need a fairly recent version of the TypeScript compiler - preferably
 * the one that is in the devDependencies. The one in AST Explorer is not
 * recent enough a.t.m.
 *
 * Also, having this locally means we can use it more easily in scripts
 * and/ or in a local buffer.
 *
 * Usage:
 *  node src2tsast.mjs < file.ts
 *
 *  practical applications:
 *  node src2tsast.mjs < file.ts | jq .externalModuleIndicator
 *  node src2tsast.mjs < file.ts | pbcopy # copy to clipboard, and with castle-V paste it into an empty buffer
 *
 */

/* eslint-disable no-magic-numbers */
/* eslint-disable max-depth */
/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/prevent-abbreviations */

import { readFileSync } from "node:fs";
import { EOL } from "node:os";
import { createSourceFile, SyntaxKind, ScriptTarget } from "typescript";

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

const lInput = readFileSync(0, "utf8");
const lAST = createSourceFile("stdin", lInput, ScriptTarget.Latest, false);
const lDigestibleAST = walkForPrinting(lAST);
const lDigestibleASTAsJSON = JSON.stringify(lDigestibleAST, null, 2);

process.stdout.write(lDigestibleASTAsJSON + EOL);
