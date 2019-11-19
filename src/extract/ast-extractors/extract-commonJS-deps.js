const walk = require("acorn-walk");
const estreeHelpers = require("./estree-helpers");

function pushRequireCallsToDependencies(
  pDependencies,
  pModuleSystem,
  pExoticRequireStrings
) {
  return pNode => {
    ["require"].concat(pExoticRequireStrings).forEach(pName => {
      if (estreeHelpers.isRequireIdentifier(pNode, pName)) {
        const lExoticRequire =
          pName === "require" ? {} : { exoticRequire: pName };

        if (estreeHelpers.firstArgumentIsAString(pNode.arguments)) {
          pNode.arguments[0].value.split("!").forEach(pString =>
            pDependencies.push({
              moduleName: pString,
              moduleSystem: pModuleSystem,
              dynamic: false,
              ...lExoticRequire
            })
          );
        } else if (
          estreeHelpers.firstArgumentIsATemplateLiteral(pNode.arguments)
        ) {
          pDependencies.push({
            moduleName: pNode.arguments[0].quasis[0].value.cooked,
            moduleSystem: pModuleSystem,
            dynamic: false,
            ...lExoticRequire
          });
        }
      }
    });
  };
}

module.exports = (
  pAST,
  pDependencies,
  pModuleSystem,
  pExoticRequireStrings
) => {
  // var/const lalala = require('./lalala');
  // require('./lalala');
  // require('./lalala').doFunkyStuff();
  // require('zoinks!./wappie')
  // require(`./withatemplateliteral`)
  walk.simple(
    pAST,
    {
      CallExpression: pushRequireCallsToDependencies(
        pDependencies,
        pModuleSystem,
        pExoticRequireStrings
      )
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk.base
  );
};
