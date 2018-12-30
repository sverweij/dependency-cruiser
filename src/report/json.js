module.exports = pInput =>
    Object.assign(
        {},
        pInput,
        {
            modules: JSON.stringify(pInput, null, "    ")
        }
    );
