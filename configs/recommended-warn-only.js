const base = require('./recommended');

module.exports = Object.assign(
    {},
    base,
    {
        forbidden: base.forbidden.map(
            pRule => {
                pRule.severity = "warn";
                return pRule;
            }
        )
    }
);
