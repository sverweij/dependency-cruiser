const path = require('path');

module.exports = function (pEnvironment, pArguments) {
    if (pEnvironment && pEnvironment.production) {
        return {
            resolve: {
                alias: {
                    'config': "src/config",
                    'magic$': "src/merlin/browserify/magic"
                }
            }
        }
    } else {
        return {
            resolve: {
                alias: {
                    'config': "src/dev-config",
                    'magic$': "src/merlin/browserify/hipsterlib"
                }
            }
        }
    }
};
