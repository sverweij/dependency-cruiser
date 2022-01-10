import * as unused from './imported-from-index-but-not-used';
import * as definitlyUsed from './definitely-used';
const alsoUsed = require('./also-used');

console.log(definitlyUsed.x, alsoUsed.x);

