const tryRequire = require("semver-try-require");
/** @type {import('@swc/core/Visitor')} */
const VisitorModule = tryRequire(
  "@swc/core/Visitor",
  require("../../../package.json").supportedTranspilers.swc
);

const Visitor = VisitorModule.default;

function pryStringsFromArguments(pArguments) {
  let lReturnValue = null;

  if (pArguments[0].expression.type === "StringLiteral") {
    lReturnValue = pArguments[0].expression.value;
  }
  // istanbul ignore else
  else if (pArguments[0].expression.type === "TemplateLiteral") {
    lReturnValue = pArguments[0].expression.quasis[0].cooked.value;
  }

  return lReturnValue;
}

function isPlaceholderlessTemplateLiteral(pArgument) {
  return (
    pArgument.expression.type === "TemplateLiteral" &&
    pArgument.expression.quasis.length === 1 &&
    pArgument.expression.expressions.length === 0
  );
}

function argumentsAreUsable(pArguments) {
  return (
    pArguments.length > 0 &&
    ["StringLiteral", "TemplateLiteral"].includes(
      pArguments[0].expression.type
    ) &&
    (!(pArguments[0].expression.type === "TemplateLiteral") ||
      isPlaceholderlessTemplateLiteral(pArguments[0]))
  );
}

function chunkIntoThing(pString) {
  const lChunks = pString.split(".");
  return {
    object: lChunks[0],
    property: lChunks[1],
    string: pString,
  };
}

// to recognize exotic requires like 'window.require'
function extractExoticMemberCallExpression(pNode, pExoticRequireStrings) {
  let lReturnValue = [];

  if (pNode.callee.type === "MemberExpression") {
    lReturnValue = pExoticRequireStrings
      .filter((pString) => pString.includes("."))
      .map(chunkIntoThing)
      .reduce((pAll, pThing) => {
        if (
          pNode.callee.object.value === pThing.object &&
          pNode.callee.property.value === pThing.property &&
          argumentsAreUsable(pNode.arguments)
        ) {
          pAll = pAll.concat({
            module: pryStringsFromArguments(pNode.arguments),
            moduleSystem: "cjs",
            exoticallyRequired: true,
            exoticRequire: pThing.string,
            dynamic: false,
          });
        }
        return pAll;
      }, []);
  }

  return lReturnValue;
}

function isInterestingCallExpression(pExoticRequireStrings, pNode) {
  return ["require", "import"]
    .concat(pExoticRequireStrings.filter((pString) => !pString.includes(".")))
    .includes(pNode.callee.value);
}
// istanbul ignore else
if (VisitorModule) {
  module.exports = class SwcDependencyVisitor extends Visitor {
    constructor(pExoticRequireStrings) {
      super();
      this.lExoticRequireStrings = pExoticRequireStrings;
    }

    visitCallExpression(pNode) {
      if (
        isInterestingCallExpression(this.lExoticRequireStrings, pNode) &&
        argumentsAreUsable(pNode.arguments)
      ) {
        this.lResult.push({
          module: pryStringsFromArguments(pNode.arguments),

          ...(pNode.callee.value === "import"
            ? { moduleSystem: "es6", dynamic: true }
            : { moduleSystem: "cjs", dynamic: false }),

          ...(["require", "import"].includes(pNode.callee.value)
            ? { exoticallyRequired: false }
            : { exoticallyRequired: true, exoticRequire: pNode.callee.value }),
        });
      }

      // using "window.require" as an exotic require string...
      this.lResult = this.lResult.concat(
        extractExoticMemberCallExpression(pNode, this.lExoticRequireStrings)
      );

      return super.visitCallExpression(pNode);
    }
    // istanbul ignore next
    visitTsType(pNode) {
      // override so the 'visitTsType not implemented' error message
      // as defined in the super class doesn't appear
      return pNode;
    }

    getDependencies(pAST) {
      this.lResult = [];
      this.visitModule(pAST);
      return this.lResult;
    }
  };
} else {
  module.exports = {};
}
