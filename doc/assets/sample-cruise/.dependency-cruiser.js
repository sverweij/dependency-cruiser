module.exports = {
    extends: '../../../configs/recommended-strict',
    forbidden: [{
        severity: 'error',
        from: {pathNot: 'sub'},
        to: {path:'sub'}
    }],
    options:{
        exclude: 'node_modules'
    }
}
