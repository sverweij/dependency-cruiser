const walk   = require('acorn-walk');
const inject = require('acorn-dynamic-import/lib/walk').default;

module.exports = inject(walk);
