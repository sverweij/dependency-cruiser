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

function isMemberCallExpression(pNode, pObjectName, pPropertyName) {
  return (
    pNode.type === "CallExpression" &&
    pNode.callee.type === "MemberExpression" &&
    pNode.callee.object.type === "Identifier" &&
    pNode.callee.object.name === pObjectName &&
    pNode.callee.property.type === "Identifier" &&
    pNode.callee.property.name === pPropertyName
  );
}

function isCalleeIdentifier(pNode, pName) {
  return (
    "Identifier" === _get(pNode, "callee.type") &&
    pName === _get(pNode, "callee.name")
  );
}

function isRequireOfSomeSort(pNode, pName) {
  const lRequireStringElements = pName.split(".");

  return lRequireStringElements.length > 1
    ? isMemberCallExpression(pNode, ...lRequireStringElements)
    : isCalleeIdentifier(pNode, pName);
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
  isMemberCallExpression,
  isCalleeIdentifier,
  isRequireOfSomeSort,
  isLikelyAMDDefineOrRequire,
  isLikelyAMDDefine,
};
