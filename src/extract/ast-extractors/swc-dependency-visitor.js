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

    pushImportExportSource(pNode) {
      if (pNode.source) {
        this.lResult.push({
          module: pNode.source.value,
          moduleSystem: "es6",
          exoticallyRequired: false,
        });
      }
    }
    visitImportDeclaration(pNode) {
      this.pushImportExportSource(pNode);
      return super.visitImportDeclaration(pNode);
    }

    visitTsImportEqualsDeclaration(pNode) {
      if (pNode.moduleRef.type === "TsExternalModuleReference") {
        this.lResult.push({
          module: pNode.moduleRef.expression.value,
          moduleSystem: "cjs",
          exoticallyRequired: false,
        });
      }
      return super.visitTsImportEqualsDeclaration(pNode);
    }

    // note: super class contains a typo. This will eventually be corrected.
    // To anticipate that (and to remain backward compatible when that happens)
    // also include the same method, but with the correct spelling.
    visitExportAllDeclration(pNode) {
      this.pushImportExportSource(pNode);
      return super.visitExportAllDeclration(pNode);
    }

    /* istanbul ignore next */
    visitExportAllDeclaration(pNode) {
      return this.visitExportAllDeclration(pNode);
    }

    // same spelling error as the above - same solution
    visitExportNamedDeclration(pNode) {
      this.pushImportExportSource(pNode);
      return super.visitExportNamedDeclration(pNode);
    }
    /* istanbul ignore next */
    visitExportNamedDeclaration(pNode) {
      return this.visitExportNamedDeclration(pNode);
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

    visitTsTypeAnnotation(pNode) {
      // as visitors for some shapes of type annotations aren't completely
      // implemented yet (1.2.51) pNode can come in as null (also see
      // comments in accompanying unit test)
      if (
        Boolean(pNode) &&
        Boolean(pNode.typeAnnotation) &&
        Boolean(pNode.typeAnnotation.argument)
      )
        this.lResult.push({
          module: pNode.typeAnnotation.argument.value,
          moduleSystem: "es6",
          exoticallyRequired: false,
        });
      return super.visitTsTypeAnnotation(pNode);
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
