const process = require('process');
const tryRequire = require('semver-try-require');
const localModule = require('./local-module');

const ts = tryRequire('typescript', '>=3');

console.log('typescript >=3 available?', Boolean(ts));
console.log('node version', process.version);
console.log('local module ran:', localModule());
