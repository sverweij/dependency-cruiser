import { simple as walk_simple, base as walk_base } from "acorn-walk";
import extractCommonJSDependencies from "./extract-cjs-deps.mjs";
import {
  isLikelyAMDDefineOrRequire,
  isLikelyAMDDefine,
} from "./estree-helpers.mjs";

function extractRegularAMDDependencies(pNode, pDependencies) {
  if (isLikelyAMDDefineOrRequire(pNode)) {
    const lArrayExpressionArguments = pNode.expression.arguments.filter(
      (pArgument) => pArgument.type === "ArrayExpression",
    );

    for (const lArgument of lArrayExpressionArguments) {
      for (const lElement of lArgument.elements) {
        // eslint-disable-next-line max-depth
        if (lElement.value && typeof lElement.value === "string") {
          pDependencies.push({
            module: lElement.value,
            moduleSystem: "amd",
            dynamic: false,
            exoticallyRequired: false,
            dependencyTypes: ["amd-define"],
          });
        }
      }
    }
  }
}

function extractCommonJSWrappers(pNode, pDependencies, pExoticRequireStrings) {
  if (isLikelyAMDDefine(pNode)) {
    for (const lArgument of pNode.expression.arguments) {
      if (
        lArgument.type === "FunctionExpression" &&
        lArgument.params.some(
          (pParameter) =>
            pParameter.name === "require" ||
            pExoticRequireStrings.includes(pParameter.name),
        )
      ) {
        extractCommonJSDependencies(
          lArgument.body,
          pDependencies,
          "amd",
          pExoticRequireStrings,
        );
      }
    }
  }
}

export default function extractAMDDependencies(
  pAST,
  pDependencies,
  pExoticRequireStrings,
) {
  walk_simple(
    pAST,
    {
      ExpressionStatement: (pNode) => {
        // module as a function (define(Array, function))
        // module with a name (define(string, Array, function))
        // 'root' require module (require(Array, function)
        extractRegularAMDDependencies(pNode, pDependencies);
        // CommonJS-wrappers:
        //  (define(function(require, exports, module){
        //  define(["require", ...], function(require, ...){
        //      ... every 'require' call is a depencency
        // Won't work if someone decides to name the first parameter of
        // the function passed to the define something else from "require"
        extractCommonJSWrappers(pNode, pDependencies, pExoticRequireStrings);
      },
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk_base,
  );
}
