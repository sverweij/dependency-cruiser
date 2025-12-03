import { simple as walk_simple, base as walk_base } from "acorn-walk";
import {
  firstArgumentIsAString,
  firstArgumentIsATemplateLiteral,
  isRequireOfSomeSort,
} from "./estree-helpers.mjs";

function pryStringsFromArguments(pArguments) {
  let lReturnValue = null;

  if (firstArgumentIsAString(pArguments)) {
    lReturnValue = pArguments[0].value;
  } else if (firstArgumentIsATemplateLiteral(pArguments)) {
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

function getDependencyTypeAttributes(pName, pModuleSystem) {
  switch (pName) {
    case "require":
      return {
        exoticallyRequired: false,
        dependencyTypes: getRequireTypes(pModuleSystem),
      };
    case "process.getBuiltinModule":
    case "globalThis.process.getBuiltinModule":
      return {
        exoticallyRequired: false,
        dependencyTypes: ["process-get-builtin-module"],
      };
    default:
      return {
        exoticallyRequired: true,
        exoticRequire: pName,
        dependencyTypes: getExoticRequireTypes(pModuleSystem),
      };
  }
}

function pushRequireCallsToDependencies(
  pDependencies,
  pModuleSystem,
  pRequireStrings,
) {
  return (pNode) => {
    for (const lName of pRequireStrings) {
      if (isRequireOfSomeSort(pNode, lName)) {
        const lModuleName = pryStringsFromArguments(pNode.arguments);
        if (lModuleName) {
          pDependencies.push({
            module: lModuleName,
            moduleSystem: pModuleSystem,
            dynamic: false,
            ...getDependencyTypeAttributes(lName, pModuleSystem),
          });
        }
      }
    }
  };
}

// eslint-disable-next-line max-params
export default function extractCommonJSDependencies(
  pAST,
  pDependencies,
  pModuleSystem,
  pExoticRequireStrings,
  pDetectProcessBuiltinModuleCalls,
) {
  // var/const lalala = require('./lalala');
  // require('./lalala');
  // require('./lalala').doFunkyStuff();
  // require('zoinks!./wappie')
  // require(`./withatemplateliteral`)
  // when feature switched as such it will also detect
  //   process.getBuiltinModule('fs')
  //   globalThis.process.getBuiltinModule('path')
  // as well as renamed requires/ require wrappers
  // as passed in pExoticRequireStrings ("need", "window.require")
  const lRequireStrings = ["require"]
    .concat(
      pDetectProcessBuiltinModuleCalls
        ? ["process.getBuiltinModule", "globalThis.process.getBuiltinModule"]
        : [],
    )
    .concat(pExoticRequireStrings);

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
