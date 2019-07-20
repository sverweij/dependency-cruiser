const walk = require("./walk");
const estreeHelpers = require("./estree-helpers");

function pushImportNodeValue(pDependencies) {
  return pNode => {
    if (estreeHelpers.isImportStatement(pNode)) {
      if (estreeHelpers.firstArgumentIsAString(pNode.arguments)) {
        pDependencies.push({
          moduleName: pNode.arguments[0].value,
          moduleSystem: "es6",
          dynamic: true
        });
      } else if (
        estreeHelpers.firstArgumentIsATemplateLiteral(pNode.arguments)
      ) {
        pDependencies.push({
          moduleName: pNode.arguments[0].quasis[0].value.cooked,
          moduleSystem: "es6",
          dynamic: true
        });
      }
    }
  };
}

module.exports = (pAST, pDependencies) => {
  function pushSourceValue(pNode) {
    if (pNode.source && pNode.source.value) {
      pDependencies.push({
        moduleName: pNode.source.value,
        moduleSystem: "es6",
        dynamic: false
      });
    }
  }

  walk.simple(
    pAST,
    {
      ImportDeclaration: pushSourceValue,
      ExportAllDeclaration: pushSourceValue,
      ExportNamedDeclaration: pushSourceValue,
      CallExpression: pushImportNodeValue(pDependencies)
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk.base
  );
};
