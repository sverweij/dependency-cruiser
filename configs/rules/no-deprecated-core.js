module.exports = {
    name: 'no-deprecated-core',
    comment: 'These core modules are deprecated - find an alternative.',
    severity: 'error',
    from: {},
    to: {
        dependencyTypes: [
            'core'
        ],
        path: '^(punycode|domain|constants|sys|_linklist)$'
    }
};
