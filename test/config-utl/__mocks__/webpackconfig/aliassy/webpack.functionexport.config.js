module.exports = function(pEnvironment, pArguments) {
    return {
        mode: pEnvironment === 'production' || (pEnvironment && pEnvironment.production) ? 'production' : 'development',
        resolve: {
            alias: {
                configSpullenAlias: "./configspullen"
            },
            bustTheCache: true
        }
    }
}