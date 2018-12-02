module.exports = {
    name: 'no-circular',
    comment: 'circular dependencies will make you dizzy',
    severity: 'error',
    from: {},
    to: {
        circular: true
    }
};
