/* eslint-disable no-inline-comments */
/* eslint-disable max-classes-per-file */
import tryImport from "semver-try-require";
import meta from "#meta.cjs";

/** @type {import('@swc/core/Visitor')} */
const { Visitor } = await tryImport(
  "@swc/core/Visitor.js",
  meta.supportedTranspilers.swc,
);

function pryStringsFromArguments(pArguments) {
  let lReturnValue = null;

  if (pArguments[0].expression.type === "StringLiteral") {
    lReturnValue = pArguments[0].expression.value;
  } else if (pArguments[0].expression.type === "TemplateLiteral") {
    /* c8 ignore start */
    // @swc/core@1.2.159 and before: cooked.value.
    // @swc/core@1.2.160 and after: just cooked
    lReturnValue =
      pArguments[0].expression.quasis[0].cooked.value ||
      pArguments[0].expression.quasis[0].cooked;
  }
  /* c8 ignore stop */

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
      pArguments[0].expression.type,
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
          return pAll.concat({
            module: pryStringsFromArguments(pNode.arguments),
            moduleSystem: "cjs",
            exoticallyRequired: true,
            exoticRequire: pThing.string,
            dynamic: false,
            dependencyTypes: ["exotic-require"],
          });
        }
        return pAll;
      }, []);
  }

  return lReturnValue;
}

function isImportCallExpression(pNode) {
  /* 
    somewhere between swc 1.2.123 and 1.2.133 the swc AST started to
    represent import call expressions with .callee.type === "Import"
    instead of .callee.value === "import". Keeping both detection
    methods in here for backwards compatibility
  */
  return pNode.callee.value === "import" || pNode.callee.type === "Import";
}

function isNonExoticallyRequiredExpression(pNode) {
  return pNode.callee.value === "require" || isImportCallExpression(pNode);
}

function isInterestingCallExpression(pExoticRequireStrings, pNode) {
  /* 
    somewhere between swc 1.2.123 and 1.2.133 the swc AST started to
    represent import call expressions with .callee.type === "Import"
    instead of .callee.value === "import". Keeping both detection
    methods in here for backwards compatibility
  */
  return (
    pNode.callee.type === "Import" ||
    ["require", "import"]
      .concat(pExoticRequireStrings.filter((pString) => !pString.includes(".")))
      .includes(pNode.callee.value)
  );
}

export default Visitor
  ? class SwcDependencyVisitor extends Visitor {
      constructor(pExoticRequireStrings) {
        super();
        this.lExoticRequireStrings = pExoticRequireStrings;
      }

      pushExportSource(pNode) {
        if (pNode.source) {
          this.lResult.push({
            module: pNode.source.value,
            moduleSystem: "es6",
            exoticallyRequired: false,
            dependencyTypes: ["export"],
          });
        }
      }

      pushImportSource(pNode) {
        if (pNode.source) {
          this.lResult.push({
            module: pNode.source.value,
            moduleSystem: "es6",
            exoticallyRequired: false,
            dependencyTypes: ["import"],
          });
        }
      }

      visitImportDeclaration(pNode) {
        this.pushImportSource(pNode);
        return super.visitImportDeclaration(pNode);
      }

      visitTsImportEqualsDeclaration(pNode) {
        if (pNode.moduleRef.type === "TsExternalModuleReference") {
          this.lResult.push({
            module: pNode.moduleRef.expression.value,
            moduleSystem: "cjs",
            exoticallyRequired: false,
            dependencyTypes: ["import-equals"],
          });
        }
        return super.visitTsImportEqualsDeclaration(pNode);
      }

      // note: super class contains a typo. This will eventually be corrected.
      // To anticipate that (and to remain backward compatible when that happens)
      // also include the same method, but with the correct spelling.
      visitExportAllDeclration(pNode) {
        this.pushExportSource(pNode);
        /* c8 ignore start */
        // @ts-expect-error see above
        if (super.visitExportAllDeclration) {
          // @ts-expect-error see above
          return super.visitExportAllDeclration(pNode);
        } else {
          /* c8 ignore stop */
          return super.visitExportAllDeclaration(pNode);
        }
      }

      /* c8 ignore start */
      visitExportAllDeclaration(pNode) {
        return this.visitExportAllDeclration(pNode);
      }
      /* c8 ignore stop */

      // same spelling error as the above - same solution
      visitExportNamedDeclration(pNode) {
        this.pushExportSource(pNode);
        /* c8 ignore start */
        // @ts-expect-error see above
        if (super.visitExportNamedDeclration) {
          // @ts-expect-error see above
          return super.visitExportNamedDeclration(pNode);
        } else {
          /* c8 ignore stop */
          return super.visitExportNamedDeclaration(pNode);
        }
      }
      /* c8 ignore start */
      visitExportNamedDeclaration(pNode) {
        return this.visitExportNamedDeclration(pNode);
      }
      /* c8 ignore stop */

      visitCallExpression(pNode) {
        if (
          isInterestingCallExpression(this.lExoticRequireStrings, pNode) &&
          argumentsAreUsable(pNode.arguments)
        ) {
          this.lResult.push({
            module: pryStringsFromArguments(pNode.arguments),

            ...(isImportCallExpression(pNode)
              ? {
                  moduleSystem: "es6",
                  dynamic: true,
                  dependencyTypes: ["dynamic-import"],
                }
              : {
                  moduleSystem: "cjs",
                  dynamic: false,
                  dependencyTypes: ["require"],
                }),

            ...(isNonExoticallyRequiredExpression(pNode)
              ? { exoticallyRequired: false }
              : {
                  exoticallyRequired: true,
                  exoticRequire: pNode.callee.value,
                  dependencyTypes: ["exotic-require"],
                }),
          });
        }

        // using "window.require" as an exotic require string...
        this.lResult = this.lResult.concat(
          extractExoticMemberCallExpression(pNode, this.lExoticRequireStrings),
        );

        return super.visitCallExpression(pNode);
      }
      /* c8 ignore start */
      visitTsType(pNode) {
        // override so the 'visitTsType not implemented' error message
        // as defined in the super class doesn't appear
        return pNode;
      }
      /* c8 ignore stop */

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
            dependencyTypes: ["type-import"],
          });
        return super.visitTsTypeAnnotation(pNode);
      }

      // as far as I can tell swc doesn't do tripple slash directives (yet?)
      // visitTrippleSlashDirective(pNode)) {}

      getDependencies(pAST) {
        this.lResult = [];
        this.visitModule(pAST);
        return this.lResult;
      }
    }
  : /* c8 ignore start */
    class Empty {};
/* c8 ignore stop */
