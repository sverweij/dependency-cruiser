const doesNotExist = require('does-not-exist');
const localModule = require('./local-module');

console.log(doesNotExist.doStuff(localModule));
