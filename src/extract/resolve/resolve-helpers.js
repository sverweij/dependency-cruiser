const localNpmHelpers = require('./localNpmHelpers');

module.exports = {
    addLicenseAttribute(pModuleName, pBaseDir, pResolveOptions) {
        let lRetval = {};
        const lLicense = localNpmHelpers.getLicense(pModuleName, pBaseDir, pResolveOptions);

        if (Boolean(lLicense)) {
            lRetval.license = lLicense;
        }
        return lRetval;
    }
};
