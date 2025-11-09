/* eslint-disable no-inline-comments */
export function isStringLiteral(pArgument) {
  return pArgument.type === "Literal" && typeof pArgument.value === "string";
}

export function firstArgumentIsAString(pArgumentsNode) {
  return (
    pArgumentsNode && pArgumentsNode[0] && isStringLiteral(pArgumentsNode[0])
  );
}

export function isPlaceholderLessTemplateLiteral(pArgument) {
  return (
    pArgument.type === "TemplateLiteral" &&
    pArgument.quasis.length === 1 &&
    pArgument.expressions.length === 0
  );
}

export function firstArgumentIsATemplateLiteral(pArgumentsNode) {
  return (
    pArgumentsNode &&
    pArgumentsNode[0] &&
    isPlaceholderLessTemplateLiteral(pArgumentsNode[0])
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

function isNestedMemberCallExpression(
  pNode,
  pObjectName,
  pSecondObjectName,
  pPropertyName,
) {
  return (
    pNode.type === "CallExpression" &&
    pNode.callee.type === "MemberExpression" &&
    pNode.callee.object.type === "MemberExpression" &&
    pNode.callee.object.object.type === "Identifier" &&
    pNode.callee.object.object.name === pObjectName && // i.e. globalThis
    pNode.callee.object.property.type === "Identifier" &&
    pNode.callee.object.property.name === pSecondObjectName && // i.e. process
    pNode.callee.property.type === "Identifier" &&
    pNode.callee.property.name === pPropertyName // i.e. getBuiltinModule
  );
}

function isCalleeIdentifier(pNode, pName) {
  return "Identifier" === pNode?.callee?.type && pName === pNode?.callee?.name;
}

export function isRequireOfSomeSort(pNode, pName) {
  const lRequireStringElements = pName.split(".");

  switch (lRequireStringElements.length) {
    case 1:
      return isCalleeIdentifier(pNode, pName);
    // eslint-disable-next-line no-magic-numbers
    case 2:
      return isMemberCallExpression(pNode, ...lRequireStringElements);
    // eslint-disable-next-line no-magic-numbers
    case 3:
      return isNestedMemberCallExpression(pNode, ...lRequireStringElements);
    default:
      return false;
  }
}

export function isLikelyAMDDefineOrRequire(pNode) {
  return (
    pNode.expression.type === "CallExpression" &&
    pNode.expression.callee.type === "Identifier" &&
    (pNode.expression.callee.name === "define" ||
      pNode.expression.callee.name === "require")
  );
}

export function isLikelyAMDDefine(pNode) {
  return (
    pNode.expression.type === "CallExpression" &&
    pNode.expression.callee.type === "Identifier" &&
    pNode.expression.callee.name === "define"
  );
}
