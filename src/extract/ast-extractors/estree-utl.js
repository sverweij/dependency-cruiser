function isPlaceholderlessTemplateLiteral(pArgument){
    return pArgument.type === 'TemplateLiteral' &&
        pArgument.quasis.length === 1 &&
        pArgument.expressions.length === 0;
}

module.exports = {
    isPlaceholderlessTemplateLiteral
};
