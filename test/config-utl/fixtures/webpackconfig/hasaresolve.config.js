const path = require('path');

module.exports = {
    resolve: {
        alias: {
            'config': "src/config",
            'magic$': "src/merlin/browserify/magic"
        }
    }
};
