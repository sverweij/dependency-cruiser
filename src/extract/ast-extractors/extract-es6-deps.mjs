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
        dependencyTypes: ["dynamic-import"],
      });
    } else if (estreeHelpers.isPlaceholderlessTemplateLiteral(pNode.source)) {
      pDependencies.push({
        module: pNode.source.quasis[0].value.cooked,
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
        dependencyTypes: ["dynamic-import"],
      });
    }
  };
}

export default function extractES6Dependencies(pAST, pDependencies) {
  function pushImportSourceValue(pNode) {
    if (pNode.source && pNode.source.value) {
      pDependencies.push({
        module: pNode.source.value,
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["import"],
      });
    }
  }
  function pushExportSourceValue(pNode) {
    if (pNode.source && pNode.source.value) {
      pDependencies.push({
        module: pNode.source.value,
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["export"],
      });
    }
  }

  walk_simple(
    pAST,
    {
      ImportDeclaration: pushImportSourceValue,
      ImportExpression: pushImportNodeValue(pDependencies),
      ExportAllDeclaration: pushExportSourceValue,
      ExportNamedDeclaration: pushExportSourceValue,
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk_base,
  );
}
