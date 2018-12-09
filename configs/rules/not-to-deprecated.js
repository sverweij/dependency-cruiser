module.exports = {
    name: 'not-to-deprecated',
    comment: 'These modules are deprecated - find an alternative.',
    severity: 'warn',
    from: {},
    to: {
        dependencyTypes: [
            'deprecated'
        ]
    }
};
