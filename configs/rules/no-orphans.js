module.exports = {
    name: 'no-orphans',
    severity: 'warn',
    from: {
        orphan: true,
        pathNot: '\\.d\\.ts$'
    },
    to: {}
};
