import { simple as walk_simple, base as walk_base } from "acorn-walk";
import estreeHelpers from "./estree-helpers.mjs";

function pryStringsFromArguments(pArguments) {
  let lReturnValue = null;

  if (estreeHelpers.firstArgumentIsAString(pArguments)) {
    lReturnValue = pArguments[0].value;
  } else if (estreeHelpers.firstArgumentIsATemplateLiteral(pArguments)) {
    lReturnValue = pArguments[0].quasis[0].value.cooked;
  }

  return lReturnValue;
}

function getRequireTypes(pModuleSystem) {
  return pModuleSystem === "amd" ? ["amd-require"] : ["require"];
}
function getExoticRequireTypes(pModuleSystem) {
  return pModuleSystem === "amd" ? ["amd-exotic-require"] : ["exotic-require"];
}

function pushRequireCallsToDependencies(
  pDependencies,
  pModuleSystem,
  pRequireStrings,
) {
  return (pNode) => {
    for (let lName of pRequireStrings) {
      if (estreeHelpers.isRequireOfSomeSort(pNode, lName)) {
        const lModuleName = pryStringsFromArguments(pNode.arguments);
        if (lModuleName) {
          pDependencies.push({
            module: lModuleName,
            moduleSystem: pModuleSystem,
            dynamic: false,
            ...(lName === "require"
              ? {
                  exoticallyRequired: false,
                  dependencyTypes: getRequireTypes(pModuleSystem),
                }
              : {
                  exoticallyRequired: true,
                  exoticRequire: lName,
                  dependencyTypes: getExoticRequireTypes(pModuleSystem),
                }),
          });
        }
      }
    }
  };
}

export default function extractCommonJSDependencies(
  pAST,
  pDependencies,
  pModuleSystem,
  pExoticRequireStrings,
) {
  // var/const lalala = require('./lalala');
  // require('./lalala');
  // require('./lalala').doFunkyStuff();
  // require('zoinks!./wappie')
  // require(`./withatemplateliteral`)
  // as well as renamed requires/ require wrappers
  // as passed in pExoticRequireStrings ("need", "window.require")
  const lRequireStrings = ["require"].concat(pExoticRequireStrings);

  walk_simple(
    pAST,
    {
      CallExpression: pushRequireCallsToDependencies(
        pDependencies,
        pModuleSystem,
        lRequireStrings,
      ),
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk_base,
  );
}
