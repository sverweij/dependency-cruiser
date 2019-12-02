const walk = require("acorn-walk");
const estreeHelpers = require("./estree-helpers");

function pushImportNodeValue(pDependencies) {
  return pNode => {
    if (estreeHelpers.isStringLiteral(pNode.source)) {
      pDependencies.push({
        module: pNode.source.value,
        moduleSystem: "es6",
        dynamic: true
      });
    } else if (estreeHelpers.isPlaceholderlessTemplateLiteral(pNode.source)) {
      pDependencies.push({
        module: pNode.source.quasis[0].value.cooked,
        moduleSystem: "es6",
        dynamic: true
      });
    }
  };
}

module.exports = (pAST, pDependencies) => {
  function pushSourceValue(pNode) {
    if (pNode.source && pNode.source.value) {
      pDependencies.push({
        module: pNode.source.value,
        moduleSystem: "es6",
        dynamic: false
      });
    }
  }

  walk.simple(
    pAST,
    {
      ImportDeclaration: pushSourceValue,
      ImportExpression: pushImportNodeValue(pDependencies),
      ExportAllDeclaration: pushSourceValue,
      ExportNamedDeclaration: pushSourceValue
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk.base
  );
};
