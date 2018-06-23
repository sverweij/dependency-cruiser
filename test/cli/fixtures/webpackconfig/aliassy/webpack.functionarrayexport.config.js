module.exports = [function (pEnvironment, pArguments) {
    if (pEnvironment && pEnvironment.production) {
        return {
            resolve: {
                alias: {
                    configSpullenAlias: "./configspullen"
                },
                bustTheCache: true
            },
            
        }
    } else {
        return {
            resolve: {
                alias: {
                    configSpullenAlias: "./configspullen"
                },
                bustTheCache: true
            }
        }
    }
},{
    resolve: {
        bustTheCache: true
    }
}];