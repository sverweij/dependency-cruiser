const _get = require("lodash/get");

function isStringLiteral(pArgument) {
  return pArgument.type === "Literal" && typeof pArgument.value === "string";
}

function firstArgumentIsAString(pArgumentsNode) {
  return (
    Boolean(pArgumentsNode) &&
    pArgumentsNode[0] &&
    isStringLiteral(pArgumentsNode[0])
  );
}

function isPlaceholderlessTemplateLiteral(pArgument) {
  return (
    pArgument.type === "TemplateLiteral" &&
    pArgument.quasis.length === 1 &&
    pArgument.expressions.length === 0
  );
}

function firstArgumentIsATemplateLiteral(pArgumentsNode) {
  return (
    Boolean(pArgumentsNode) &&
    pArgumentsNode[0] &&
    isPlaceholderlessTemplateLiteral(pArgumentsNode[0])
  );
}

function isRequireIdentifier(pNode) {
  return (
    "Identifier" === _get(pNode, "callee.type") &&
    "require" === _get(pNode, "callee.name")
  );
}

function isLikelyAMDDefineOrRequire(pNode) {
  return (
    pNode.expression.type === "CallExpression" &&
    pNode.expression.callee.type === "Identifier" &&
    (pNode.expression.callee.name === "define" ||
      pNode.expression.callee.name === "require")
  );
}

function isLikelyAMDDefine(pNode) {
  return (
    pNode.expression.type === "CallExpression" &&
    pNode.expression.callee.type === "Identifier" &&
    pNode.expression.callee.name === "define"
  );
}

module.exports = {
  firstArgumentIsAString,
  firstArgumentIsATemplateLiteral,
  isStringLiteral,
  isPlaceholderlessTemplateLiteral,
  isRequireIdentifier,
  isLikelyAMDDefineOrRequire,
  isLikelyAMDDefine
};
