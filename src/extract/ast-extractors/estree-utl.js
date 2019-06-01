function isStringLiteral(pArgument) {
    return pArgument.type === 'Literal' &&
        typeof pArgument.value === 'string';
}

function firstArgumentIsAString(pArgumentsNode) {
    return Boolean(pArgumentsNode) &&
        pArgumentsNode[0] &&
        isStringLiteral(pArgumentsNode[0]);
}

function isPlaceholderlessTemplateLiteral(pArgument){
    return pArgument.type === 'TemplateLiteral' &&
        pArgument.quasis.length === 1 &&
        pArgument.expressions.length === 0;
}

function firstArgumentIsATemplateLiteral(pArgumentsNode) {
    return Boolean(pArgumentsNode) &&
        pArgumentsNode[0] &&
        isPlaceholderlessTemplateLiteral(pArgumentsNode[0]);
}

module.exports = {
    firstArgumentIsAString,
    firstArgumentIsATemplateLiteral
};
