const walk = require("acorn-walk");
const { extend } = require("acorn-jsx-walk");
const estreeHelpers = require("./estree-helpers");

extend(walk.base);

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

module.exports = function extractES6Dependencies(pAST, pDependencies) {
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

  walk.simple(
    pAST,
    {
      ImportDeclaration: pushSourceValue,
      ImportExpression: pushImportNodeValue(pDependencies),
      ExportAllDeclaration: pushSourceValue,
      ExportNamedDeclaration: pushSourceValue,
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk.base
  );
};
