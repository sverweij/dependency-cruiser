module.exports = {
    name: 'no-non-package-json',
    severity: 'error',
    comment: 'because an npm i --production will otherwise deliver an unreliably running module',
    from: {
    },
    to: {
        dependencyTypes: [
            'npm-no-pkg',
            'npm-unknown'
        ]
    }
};
