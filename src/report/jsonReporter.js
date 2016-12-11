"use strict";

module.exports = pInput =>
    Object.assign(
        {},
        pInput,
        {
            dependencies: JSON.stringify(pInput, null, "    ")
        }
    );
