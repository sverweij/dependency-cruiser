module.exports = {
    name: 'no-duplicate-dep-types',
    comment:
        "Likley this module depends on an external ('npm') package that occurs more than once " +
        "in your package.json i.e. bot as a devDependencies and in dependencies. This will cause " +
        "maintenance problems later on.",
    severity: 'warn',
    from: {},
    to: {
        moreThanOneDependencyType: true
    }
};
