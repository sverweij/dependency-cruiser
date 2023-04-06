import { simple as walk_simple, base as walk_base } from "acorn-walk";
import { extend } from "acorn-jsx-walk";
import estreeHelpers from "./estree-helpers.mjs";

extend(walk_base);

function pushImportNodeValue(pDependencies) {
  return (pNode) => {
    if (estreeHelpers.isStringLiteral(pNode.source)) {
      pDependencies.push({
        module: pNode.source.value,
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      });
    } else if (estreeHelpers.isPlaceholderlessTemplateLiteral(pNode.source)) {
      pDependencies.push({
        module: pNode.source.quasis[0].value.cooked,
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      });
    }
  };
}

export default function extractES6Dependencies(pAST, pDependencies) {
  function pushSourceValue(pNode) {
    if (pNode.source && pNode.source.value) {
      pDependencies.push({
        module: pNode.source.value,
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      });
    }
  }

  walk_simple(
    pAST,
    {
      ImportDeclaration: pushSourceValue,
      ImportExpression: pushImportNodeValue(pDependencies),
      ExportAllDeclaration: pushSourceValue,
      ExportNamedDeclaration: pushSourceValue,
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk_base
  );
}
