module.exports = {
    name: 'no-duplicate-dep-types',
    comment: 'including things twice?',
    severity: 'warn',
    from: {},
    to: {
        moreThanOneDependencyType: true
    }
};
